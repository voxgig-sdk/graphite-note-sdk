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
const dataset_fillEntityLiveStrict = true


func TestDatasetFillEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.DatasetFill(nil)
		if ent == nil {
			t.Fatal("expected non-nil DatasetFillEntity")
		}
	})

	t.Run("validate", func(t *testing.T) {
		if !fhHasFeature("validate") {
			t.Skip("feature not present in this SDK: validate")
		}
		client := sdk.TestSDK(nil, map[string]any{
			"feature": map[string]any{"validate": map[string]any{"active": true}},
		})
		_, err := client.DatasetFill(nil).Create(map[string]any{"append": "x", "columns": "x", "compressed": true, "datasetcode": "x", "insertdata": "x", "usercode": "x"}, nil)
		if sdkerr, ok := err.(*core.GraphiteNoteError); !ok || "validate_failed" != sdkerr.Code {
			t.Fatalf("expected validate_failed, got %v", err)
		}
	})

	t.Run("basic", func(tt *testing.T) {
		var t testing.TB = tt
		setup := dataset_fillBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "dataset_fill." + _op, _mode); _shouldSkip {
				if _reason == "" {
					_reason = "skipped via sdk-test-control.json"
				}
				t.Skip(_reason)
				return
			}
		}
		client := setup.client

		// CREATE
		datasetFillRef01Ent := client.DatasetFill(nil)
		datasetFillRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath(setup.data, []any{"new", "dataset_fill"}), "dataset_fill_ref01"))

		datasetFillRef01DataResult, err := datasetFillRef01Ent.Create(datasetFillRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		datasetFillRef01Data = core.ToMapAny(entityData(datasetFillRef01DataResult))
		if datasetFillRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}

	})
}

func dataset_fillBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "dataset_fill", "DatasetFillTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read dataset_fill test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse dataset_fill test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap, _ := vs.Transform(
		[]any{"dataset_fill01", "dataset_fill02", "dataset_fill03"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Whether *_ENTID supplied the idmap, read before envOverride consumes it:
	// without it, the ids a live flow binds are the fixture's synthetic ones.
	entidEnvRaw := os.Getenv("GRAPHITE_NOTE_TEST_DATASET_FILL_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"GRAPHITE_NOTE_TEST_DATASET_FILL_ENTID": idmap,
		"GRAPHITE_NOTE_TEST_LIVE":      "FALSE",
		"GRAPHITE_NOTE_TEST_EXPLAIN":   "FALSE",
		"GRAPHITE_NOTE_APIKEY":         "",
	})

	idmapResolved := core.ToMapAny(env["GRAPHITE_NOTE_TEST_DATASET_FILL_ENTID"])
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
