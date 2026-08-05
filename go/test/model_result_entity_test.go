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

func TestModelResultEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.ModelResult(nil)
		if ent == nil {
			t.Fatal("expected non-nil ModelResultEntity")
		}
	})

	t.Run("basic", func(t *testing.T) {
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
		// The basic flow consumes synthetic IDs from the fixture. In live mode
		// without an *_ENTID env override, those IDs hit the live API and 4xx.
		if setup.syntheticOnly {
			t.Skip("live entity test uses synthetic IDs from fixture — set GRAPHITENOTE_TEST_MODEL_RESULT_ENTID JSON to run live")
			return
		}
		client := setup.client

		// CREATE
		modelResultRef01Ent := client.ModelResult(nil)
		modelResultRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath([]any{"new", "model_result"}, setup.data), "model_result_ref01"))
		modelResultRef01Data["model_code"] = setup.idmap["model_code01"]

		modelResultRef01DataResult, err := modelResultRef01Ent.Create(modelResultRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		modelResultRef01Data = core.ToMapAny(modelResultRef01DataResult)
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
	idmap := vs.Transform(
		[]any{"model_result01", "model_result02", "model_result03", "fetch_result01", "fetch_result02", "fetch_result03", "model_code01"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Detect ENTID env override before envOverride consumes it. When live
	// mode is on without a real override, the basic test runs against synthetic
	// IDs from the fixture and 4xx's. Surface this so the test can skip.
	entidEnvRaw := os.Getenv("GRAPHITENOTE_TEST_MODEL_RESULT_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"GRAPHITENOTE_TEST_MODEL_RESULT_ENTID": idmap,
		"GRAPHITENOTE_TEST_LIVE":      "FALSE",
		"GRAPHITENOTE_TEST_EXPLAIN":   "FALSE",
		"GRAPHITENOTE_APIKEY":         "NONE",
	})

	idmapResolved := core.ToMapAny(env["GRAPHITENOTE_TEST_MODEL_RESULT_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["GRAPHITENOTE_TEST_LIVE"] == "TRUE" {
		mergedOpts := vs.Merge([]any{
			map[string]any{
				"apikey": env["GRAPHITENOTE_APIKEY"],
			},
			extra,
		})
		client = sdk.NewGraphiteNoteSDK(core.ToMapAny(mergedOpts))
	}

	live := env["GRAPHITENOTE_TEST_LIVE"] == "TRUE"
	return &entityTestSetup{
		client:        client,
		data:          entityData,
		idmap:         idmapResolved,
		env:           env,
		explain:       env["GRAPHITENOTE_TEST_EXPLAIN"] == "TRUE",
		live:          live,
		syntheticOnly: live && !idmapOverridden,
		now:           time.Now().UnixMilli(),
	}
}
