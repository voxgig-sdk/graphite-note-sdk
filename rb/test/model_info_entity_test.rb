# ModelInfo entity test

require "minitest/autorun"
require "json"
require_relative "../GraphiteNote_sdk"
require_relative "runner"

class ModelInfoEntityTest < Minitest::Test
  def test_create_instance
    testsdk = GraphiteNoteSDK.test(nil, nil)
    ent = testsdk.ModelInfo(nil)
    assert !ent.nil?
  end

  def test_basic_flow
    setup = model_info_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["load"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "model_info." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    # The basic flow consumes synthetic IDs from the fixture. In live mode
    # without an *_ENTID env override, those IDs hit the live API and 4xx.
    if setup[:synthetic_only]
      skip "live entity test uses synthetic IDs from fixture — set GRAPHITENOTE_TEST_MODEL_INFO_ENTID JSON to run live"
      return
    end
    client = setup[:client]

    # Bootstrap entity data from existing test data.
    model_info_ref01_data_raw = Vs.items(Helpers.to_map(
      Vs.getpath(setup[:data], "existing.model_info")))
    model_info_ref01_data = nil
    if model_info_ref01_data_raw.length > 0
      model_info_ref01_data = Helpers.to_map(model_info_ref01_data_raw[0][1])
    end

    # LOAD
    model_info_ref01_ent = client.ModelInfo(nil)
    model_info_ref01_match_dt0 = {}
    model_info_ref01_data_dt0_loaded = model_info_ref01_ent.load(model_info_ref01_match_dt0, nil)
    assert !model_info_ref01_data_dt0_loaded.nil?

  end
end

def model_info_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "model_info", "ModelInfoTestData.json")
  entity_data_source = File.read(entity_data_file)
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = GraphiteNoteSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["model_info01", "model_info02", "model_info03", "fetch_model_info01", "fetch_model_info02", "fetch_model_info03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Detect ENTID env override before envOverride consumes it. When live
  # mode is on without a real override, the basic test runs against synthetic
  # IDs from the fixture and 4xx's. Surface this so the test can skip.
  entid_env_raw = ENV["GRAPHITENOTE_TEST_MODEL_INFO_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "GRAPHITENOTE_TEST_MODEL_INFO_ENTID" => idmap,
    "GRAPHITENOTE_TEST_LIVE" => "FALSE",
    "GRAPHITENOTE_TEST_EXPLAIN" => "FALSE",
    "GRAPHITENOTE_APIKEY" => "NONE",
  })

  idmap_resolved = Helpers.to_map(
    env["GRAPHITENOTE_TEST_MODEL_INFO_ENTID"])
  if idmap_resolved.nil?
    idmap_resolved = Helpers.to_map(idmap)
  end

  if env["GRAPHITENOTE_TEST_LIVE"] == "TRUE"
    merged_opts = Vs.merge([
      {
        "apikey" => env["GRAPHITENOTE_APIKEY"],
      },
      extra || {},
    ])
    client = GraphiteNoteSDK.new(Helpers.to_map(merged_opts))
  end

  live = env["GRAPHITENOTE_TEST_LIVE"] == "TRUE"
  {
    client: client,
    data: entity_data,
    idmap: idmap_resolved,
    env: env,
    explain: env["GRAPHITENOTE_TEST_EXPLAIN"] == "TRUE",
    live: live,
    synthetic_only: live && !idmap_overridden,
    now: (Time.now.to_f * 1000).to_i,
  }
end
