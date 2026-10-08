# ModelResult entity test

require "minitest/autorun"
require "json"
require_relative "../GraphiteNote_sdk"
require_relative "runner"

class ModelResultEntityTest < Minitest::Test
  # main.kit.test.live.strict is true (the default is true): a live
  # request that fails, or a live test missing an input it needs,
  # fails the test.
  # An account with no record for a test to read skips it either way.
  LIVE_STRICT = true

  def test_create_instance
    testsdk = GraphiteNoteSDK.test(nil, nil)
    ent = testsdk.ModelResult(nil)
    assert !ent.nil?
  end

  def test_validate
    cfg = GraphiteNoteConfig.shared_config
    unless cfg["feature"].is_a?(Hash) && cfg["feature"].key?("validate")
      skip("feature not present in this SDK: validate")
    end
    client = GraphiteNoteSDK.test(nil, { "feature" => { "validate" => { "active" => true } } })
    err = assert_raises(StandardError) do
      client.ModelResult(nil).create({ "model_code" => 1 }, nil)
    end
    assert_equal "validate_failed", err.code
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
    if setup[:live]
      ["model_code01"].each do |_live_key|
        if setup[:synthetic_only] || setup[:idmap][_live_key].nil?
          Runner.live_miss(LIVE_STRICT, "Live entity test blocked: needs #{_live_key} via GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID")
        end
      end
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
  entity_data_source = File.read(entity_data_file, encoding: "UTF-8")
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = GraphiteNoteSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["model_result01", "model_result02", "model_result03", "model_code01"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Whether *_ENTID supplied the idmap, read before env_override consumes
  # it: without it, the ids a live flow binds are the fixture's synthetic ones.
  entid_env_raw = ENV["GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID" => idmap,
    "GRAPHITE_NOTE_TEST_LIVE" => "FALSE",
    "GRAPHITE_NOTE_TEST_EXPLAIN" => "FALSE",
    "GRAPHITE_NOTE_APIKEY" => "",
  })

  idmap_resolved = Helpers.to_map(
    env["GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID"])
  if idmap_resolved.nil?
    idmap_resolved = Helpers.to_map(idmap)
  end

  if env["GRAPHITE_NOTE_TEST_LIVE"] == "TRUE"
    merged_opts = Vs.merge([
      # FIRST, so the generated fields below win: sdk-test-control.json's
      # test.client.options adds to the live client, it does not redirect it.
      Runner.live_client_options,
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
