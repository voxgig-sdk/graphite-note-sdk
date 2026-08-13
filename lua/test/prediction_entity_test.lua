-- Prediction entity test

local json = require("dkjson")
local vs = require("utility.struct.struct")
local sdk = require("graphite-note_sdk")
local helpers = require("core.helpers")
local runner = require("test.runner")

local _test_dir = debug.getinfo(1, "S").source:match("^@(.+/)")  or "./"

describe("PredictionEntity", function()
  it("should create instance", function()
    local testsdk = sdk.test(nil, nil)
    local ent = testsdk:Prediction(nil)
    assert.is_not_nil(ent)
  end)

  it("should run basic flow", function()
    local setup = prediction_basic_setup(nil)
    -- Per-op sdk-test-control.json skip.
    local _live = setup.live or false
    for _, _op in ipairs({"create"}) do
      local _should_skip, _reason = runner.is_control_skipped("entityOp", "prediction." .. _op, _live and "live" or "unit")
      if _should_skip then
        pending(_reason or "skipped via sdk-test-control.json")
        return
      end
    end
    -- The basic flow consumes synthetic IDs from the fixture. In live mode
    -- without an *_ENTID env override, those IDs hit the live API and 4xx.
    if setup.synthetic_only then
      pending("live entity test uses synthetic IDs from fixture — set GRAPHITE_NOTE_TEST_PREDICTION_ENTID JSON to run live")
      return
    end
    local client = setup.client

    -- CREATE
    local prediction_ref01_ent = client:Prediction(nil)
    local prediction_ref01_data = helpers.to_map(vs.getprop(
      vs.getpath(setup.data, "new.prediction"), "prediction_ref01"))
    prediction_ref01_data["model_code"] = setup.idmap["model_code01"]

    local prediction_ref01_data_result, err = prediction_ref01_ent:create(prediction_ref01_data, nil)
    assert.is_nil(err)
    prediction_ref01_data = helpers.to_map(type(prediction_ref01_data_result) == 'table' and prediction_ref01_data_result.data_get and prediction_ref01_data_result:data_get() or prediction_ref01_data_result)
    assert.is_not_nil(prediction_ref01_data)

  end)
end)

function prediction_basic_setup(extra)
  runner.load_env_local()

  local entity_data_file = _test_dir .. "../../.sdk/test/entity/prediction/PredictionTestData.json"
  local f = io.open(entity_data_file, "r")
  if f == nil then
    error("failed to read prediction test data: " .. entity_data_file)
  end
  local entity_data_source = f:read("*a")
  f:close()

  local entity_data = json.decode(entity_data_source)

  local options = {}
  options["entity"] = entity_data["existing"]

  local client = sdk.test(options, extra)

  -- Generate idmap via transform.
  local idmap = vs.transform(
    { "prediction01", "prediction02", "prediction03", "model01", "model02", "model03", "model_code01" },
    {
      ["`$PACK`"] = { "", {
        ["`$KEY`"] = "`$COPY`",
        ["`$VAL`"] = { "`$FORMAT`", "upper", "`$COPY`" },
      }},
    }
  )

  -- Detect ENTID env override before envOverride consumes it. When live
  -- mode is on without a real override, the basic test runs against synthetic
  -- IDs from the fixture and 4xx's. Surface this so the test can skip.
  local entid_env_raw = os.getenv("GRAPHITE_NOTE_TEST_PREDICTION_ENTID")
  local idmap_overridden = entid_env_raw ~= nil and entid_env_raw:match("^%s*{") ~= nil

  local env = runner.env_override({
    ["GRAPHITE_NOTE_TEST_PREDICTION_ENTID"] = idmap,
    ["GRAPHITE_NOTE_TEST_LIVE"] = "FALSE",
    ["GRAPHITE_NOTE_TEST_EXPLAIN"] = "FALSE",
    ["GRAPHITE_NOTE_APIKEY"] = "NONE",
  })

  local idmap_resolved = helpers.to_map(
    env["GRAPHITE_NOTE_TEST_PREDICTION_ENTID"])
  if idmap_resolved == nil then
    idmap_resolved = helpers.to_map(idmap)
  end

  if env["GRAPHITE_NOTE_TEST_LIVE"] == "TRUE" then
    local merged_opts = vs.merge({
      {
        apikey = env["GRAPHITE_NOTE_APIKEY"],
      },
      extra or {},
    })
    client = sdk.new(helpers.to_map(merged_opts))
  end

  local live = env["GRAPHITE_NOTE_TEST_LIVE"] == "TRUE"
  return {
    client = client,
    data = entity_data,
    idmap = idmap_resolved,
    env = env,
    explain = env["GRAPHITE_NOTE_TEST_EXPLAIN"] == "TRUE",
    live = live,
    synthetic_only = live and not idmap_overridden,
    now = os.time() * 1000,
  }
end
