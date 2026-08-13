# DatasetFill entity test

require "minitest/autorun"
require "json"
require_relative "../GraphiteNote_sdk"
require_relative "runner"

class DatasetFillEntityTest < Minitest::Test
  def test_create_instance
    testsdk = GraphiteNoteSDK.test(nil, nil)
    ent = testsdk.DatasetFill(nil)
    assert !ent.nil?
  end

  def test_basic_flow
    setup = dataset_fill_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["create"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "dataset_fill." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    # The basic flow consumes synthetic IDs from the fixture. In live mode
    # without an *_ENTID env override, those IDs hit the live API and 4xx.
    if setup[:synthetic_only]
      skip "live entity test uses synthetic IDs from fixture — set GRAPHITE_NOTE_TEST_DATASET_FILL_ENTID JSON to run live"
      return
    end
    client = setup[:client]

    # CREATE
    dataset_fill_ref01_ent = client.DatasetFill(nil)
    dataset_fill_ref01_data = Helpers.to_map(Vs.getprop(
      Vs.getpath(setup[:data], "new.dataset_fill"), "dataset_fill_ref01"))

    dataset_fill_ref01_data_result = dataset_fill_ref01_ent.create(dataset_fill_ref01_data, nil)
    dataset_fill_ref01_data = Helpers.to_map(dataset_fill_ref01_data_result.respond_to?(:data_get) ? dataset_fill_ref01_data_result.data_get : dataset_fill_ref01_data_result)
    assert !dataset_fill_ref01_data.nil?

  end
end

def dataset_fill_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "dataset_fill", "DatasetFillTestData.json")
  entity_data_source = File.read(entity_data_file)
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = GraphiteNoteSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["dataset_fill01", "dataset_fill02", "dataset_fill03"],
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
  entid_env_raw = ENV["GRAPHITE_NOTE_TEST_DATASET_FILL_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "GRAPHITE_NOTE_TEST_DATASET_FILL_ENTID" => idmap,
    "GRAPHITE_NOTE_TEST_LIVE" => "FALSE",
    "GRAPHITE_NOTE_TEST_EXPLAIN" => "FALSE",
    "GRAPHITE_NOTE_APIKEY" => "NONE",
  })

  idmap_resolved = Helpers.to_map(
    env["GRAPHITE_NOTE_TEST_DATASET_FILL_ENTID"])
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
