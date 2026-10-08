package sdktest

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"

	sdk "github.com/voxgig-sdk/graphite-note-sdk/go"
	"github.com/voxgig-sdk/graphite-note-sdk/go/core"

	vs "github.com/voxgig-sdk/graphite-note-sdk/go/utility/struct"
)

// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const model_resultEntityLiveStrict = true


func TestModelResultEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.ModelResult(nil)
		if ent == nil {
			t.Fatal("expected non-nil ModelResultEntity")
		}
	})

	t.Run("validate", func(t *testing.T) {
		if !fhHasFeature("validate") {
			t.Skip("feature not present in this SDK: validate")
		}
		client := sdk.TestSDK(nil, map[string]any{
			"feature": map[string]any{"validate": map[string]any{"active": true}},
		})
		_, err := client.ModelResult(nil).Create(map[string]any{"model_code": 1}, nil)
		if sdkerr, ok := err.(*core.GraphiteNoteError); !ok || "validate_failed" != sdkerr.Code {
			t.Fatalf("expected validate_failed, got %v", err)
		}
	})

	t.Run("basic", func(tt *testing.T) {
		var t testing.TB = tt
		setup := model_resultBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "model_result." + _op, _mode); _shouldSkip {
				if _reason == "" {
					_reason = "skipped via sdk-test-control.json"
				}
				t.Skip(_reason)
				return
			}
		}
		if setup.live {
			for _, _liveKey := range []string{"model_code01"} {
				if setup.syntheticOnly || setup.idmap[_liveKey] == nil {
					liveMiss(t, model_resultEntityLiveStrict, "Live entity test blocked: needs %s via GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID", _liveKey)
				}
			}
		}
		client := setup.client

		// CREATE
		modelResultRef01Ent := client.ModelResult(nil)
		modelResultRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath(setup.data, []any{"new", "model_result"}), "model_result_ref01"))
		modelResultRef01Data["model_code"] = setup.idmap["model_code01"]

		modelResultRef01DataResult, err := modelResultRef01Ent.Create(modelResultRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		modelResultRef01Data = core.ToMapAny(entityData(modelResultRef01DataResult))
		if modelResultRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}

	})
}

func model_resultBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "model_result", "ModelResultTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read model_result test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse model_result test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap, _ := vs.Transform(
		[]any{"model_result01", "model_result02", "model_result03", "model_code01"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Whether *_ENTID supplied the idmap, read before envOverride consumes it:
	// without it, the ids a live flow binds are the fixture's synthetic ones.
	entidEnvRaw := os.Getenv("GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID": idmap,
		"GRAPHITE_NOTE_TEST_LIVE":      "FALSE",
		"GRAPHITE_NOTE_TEST_EXPLAIN":   "FALSE",
		"GRAPHITE_NOTE_APIKEY":         "",
	})

	idmapResolved := core.ToMapAny(env["GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["GRAPHITE_NOTE_TEST_LIVE"] == "TRUE" {
		// An empty map, not a nil one: Merge returns nil when its last entry
		// is nil, and BasicSetup is normally called with no extras - so a
		// bare nil silently discarded the apikey and server values below.
		extraOpts := extra
		if extraOpts == nil {
			extraOpts = map[string]any{}
		}

		mergedOpts := vs.Merge([]any{
			// liveClientOptions() FIRST, so the generated fields below win:
			// sdk-test-control.json's test.client.options adds to the live
			// client, it does not redirect it.
			liveClientOptions(),
			map[string]any{
				"apikey": env["GRAPHITE_NOTE_APIKEY"],
			},
			extraOpts,
		})
		client = sdk.NewGraphiteNoteSDK(core.ToMapAny(mergedOpts))
	}

	live := env["GRAPHITE_NOTE_TEST_LIVE"] == "TRUE"
	return &entityTestSetup{
		client:        client,
		data:          entityData,
		idmap:         idmapResolved,
		env:           env,
		explain:       env["GRAPHITE_NOTE_TEST_EXPLAIN"] == "TRUE",
		live:          live,
		syntheticOnly: live && !idmapOverridden,
		now:           time.Now().UnixMilli(),
	}
}
