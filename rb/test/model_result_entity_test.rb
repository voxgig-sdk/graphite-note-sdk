# ModelResult entity test

require "minitest/autorun"
require "json"
require_relative "../GraphiteNote_sdk"
require_relative "runner"

class ModelResultEntityTest < Minitest::Test
  def test_create_instance
    testsdk = GraphiteNoteSDK.test(nil, nil)
    ent = testsdk.ModelResult(nil)
    assert !ent.nil?
  end

  def test_basic_flow
    setup = model_result_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["create"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "model_result." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    # The basic flow consumes synthetic IDs from the fixture. In live mode
    # without an *_ENTID env override, those IDs hit the live API and 4xx.
    if setup[:synthetic_only]
      skip "live entity test uses synthetic IDs from fixture — set GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID JSON to run live"
      return
    end
    client = setup[:client]

    # CREATE
    model_result_ref01_ent = client.ModelResult(nil)
    model_result_ref01_data = Helpers.to_map(Vs.getprop(
      Vs.getpath(setup[:data], "new.model_result"), "model_result_ref01"))
    model_result_ref01_data["model_code"] = setup[:idmap]["model_code01"]

    model_result_ref01_data_result = model_result_ref01_ent.create(model_result_ref01_data, nil)
    model_result_ref01_data = Helpers.to_map(model_result_ref01_data_result.respond_to?(:data_get) ? model_result_ref01_data_result.data_get : model_result_ref01_data_result)
    assert !model_result_ref01_data.nil?

  end
end

def model_result_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "model_result", "ModelResultTestData.json")
  entity_data_source = File.read(entity_data_file)
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = GraphiteNoteSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["model_result01", "model_result02", "model_result03", "fetch_result01", "fetch_result02", "fetch_result03", "model_code01"],
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
  entid_env_raw = ENV["GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID" => idmap,
    "GRAPHITE_NOTE_TEST_LIVE" => "FALSE",
    "GRAPHITE_NOTE_TEST_EXPLAIN" => "FALSE",
    "GRAPHITE_NOTE_APIKEY" => "NONE",
  })

  idmap_resolved = Helpers.to_map(
    env["GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID"])
  if idmap_resolved.nil?
    idmap_resolved = Helpers.to_map(idmap)
  end

  if env["GRAPHITE_NOTE_TEST_LIVE"] == "TRUE"
    merged_opts = Vs.merge([
      {
        "apikey" => env["GRAPHITE_NOTE_APIKEY"],
      },
      extra || {},
    ])
    client = GraphiteNoteSDK.new(Helpers.to_map(merged_opts))
  end

  live = env["GRAPHITE_NOTE_TEST_LIVE"] == "TRUE"
  {
    client: client,
    data: entity_data,
    idmap: idmap_resolved,
    env: env,
    explain: env["GRAPHITE_NOTE_TEST_EXPLAIN"] == "TRUE",
    live: live,
    synthetic_only: live && !idmap_overridden,
    now: (Time.now.to_f * 1000).to_i,
  }
end
