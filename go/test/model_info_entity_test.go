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

func TestModelInfoEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.ModelInfo(nil)
		if ent == nil {
			t.Fatal("expected non-nil ModelInfoEntity")
		}
	})

	t.Run("basic", func(t *testing.T) {
		setup := model_infoBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"load"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "model_info." + _op, _mode); _shouldSkip {
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
			t.Skip("live entity test uses synthetic IDs from fixture — set GRAPHITENOTE_TEST_MODEL_INFO_ENTID JSON to run live")
			return
		}
		client := setup.client

		// Bootstrap entity data from existing test data (no create step in flow).
		modelInfoRef01DataRaw := vs.Items(core.ToMapAny(vs.GetPath("existing.model_info", setup.data)))
		var modelInfoRef01Data map[string]any
		if len(modelInfoRef01DataRaw) > 0 {
			modelInfoRef01Data = core.ToMapAny(modelInfoRef01DataRaw[0][1])
		}
		// Discard guards against Go's unused-var check when the flow's steps
		// happen not to consume the bootstrap data (e.g. list-only flows).
		_ = modelInfoRef01Data

		// LOAD
		modelInfoRef01Ent := client.ModelInfo(nil)
		modelInfoRef01MatchDt0 := map[string]any{}
		modelInfoRef01DataDt0Loaded, err := modelInfoRef01Ent.Load(modelInfoRef01MatchDt0, nil)
		if err != nil {
			t.Fatalf("load failed: %v", err)
		}
		if modelInfoRef01DataDt0Loaded == nil {
			t.Fatal("expected load result to be non-nil")
		}

	})
}

func model_infoBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "model_info", "ModelInfoTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read model_info test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse model_info test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap := vs.Transform(
		[]any{"model_info01", "model_info02", "model_info03", "fetch_model_info01", "fetch_model_info02", "fetch_model_info03"},
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
	entidEnvRaw := os.Getenv("GRAPHITENOTE_TEST_MODEL_INFO_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"GRAPHITENOTE_TEST_MODEL_INFO_ENTID": idmap,
		"GRAPHITENOTE_TEST_LIVE":      "FALSE",
		"GRAPHITENOTE_TEST_EXPLAIN":   "FALSE",
		"GRAPHITENOTE_APIKEY":         "NONE",
	})

	idmapResolved := core.ToMapAny(env["GRAPHITENOTE_TEST_MODEL_INFO_ENTID"])
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
