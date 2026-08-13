<?php
declare(strict_types=1);

// ModelInfo entity test

require_once __DIR__ . '/../graphitenote_sdk.php';
require_once __DIR__ . '/Runner.php';

use PHPUnit\Framework\TestCase;
use Voxgig\Struct\Struct as Vs;

class ModelInfoEntityTest extends TestCase
{
    public function test_create_instance(): void
    {
        $testsdk = GraphiteNoteSDK::test(null, null);
        $ent = $testsdk->ModelInfo(null);
        $this->assertNotNull($ent);
    }

    public function test_basic_flow(): void
    {
        $setup = model_info_basic_setup(null);
        // Per-op sdk-test-control.json skip.
        $_live = !empty($setup["live"]);
        foreach (["load"] as $_op) {
            [$_shouldSkip, $_reason] = Runner::is_control_skipped("entityOp", "model_info." . $_op, $_live ? "live" : "unit");
            if ($_shouldSkip) {
                $this->markTestSkipped($_reason ?? "skipped via sdk-test-control.json");
                return;
            }
        }
        // The basic flow consumes synthetic IDs from the fixture. In live mode
        // without an *_ENTID env override, those IDs hit the live API and 4xx.
        if (!empty($setup["synthetic_only"])) {
            $this->markTestSkipped("live entity test uses synthetic IDs from fixture — set GRAPHITE_NOTE_TEST_MODEL_INFO_ENTID JSON to run live");
            return;
        }
        $client = $setup["client"];

        // Bootstrap entity data from existing test data.
        $model_info_ref01_data_raw = Vs::items(Helpers::to_map(
            Vs::getpath($setup["data"], "existing.model_info")));
        $model_info_ref01_data = null;
        if (count($model_info_ref01_data_raw) > 0) {
            $model_info_ref01_data = Helpers::to_map($model_info_ref01_data_raw[0][1]);
        }

        // LOAD
        $model_info_ref01_ent = $client->ModelInfo(null);
        $model_info_ref01_match_dt0 = [];
        $model_info_ref01_data_dt0_loaded = $model_info_ref01_ent->load($model_info_ref01_match_dt0, null);
        $this->assertNotNull($model_info_ref01_data_dt0_loaded);

    }
}

function model_info_basic_setup($extra)
{
    Runner::load_env_local();

    $entity_data_file = __DIR__ . '/../../.sdk/test/entity/model_info/ModelInfoTestData.json';
    $entity_data_source = file_get_contents($entity_data_file);
    $entity_data = json_decode($entity_data_source, true);

    $options = [];
    $options["entity"] = $entity_data["existing"];

    $client = GraphiteNoteSDK::test($options, $extra);

    // Generate idmap.
    $idmap = [];
    foreach (["model_info01", "model_info02", "model_info03", "fetch_model_info01", "fetch_model_info02", "fetch_model_info03"] as $k) {
        $idmap[$k] = strtoupper($k);
    }

    // Detect ENTID env override before envOverride consumes it. When live
    // mode is on without a real override, the basic test runs against synthetic
    // IDs from the fixture and 4xx's. Surface this so the test can skip.
    $entid_env_raw = getenv("GRAPHITE_NOTE_TEST_MODEL_INFO_ENTID");
    $idmap_overridden = $entid_env_raw !== false && str_starts_with(trim($entid_env_raw), "{");

    $env = Runner::env_override([
        "GRAPHITE_NOTE_TEST_MODEL_INFO_ENTID" => $idmap,
        "GRAPHITE_NOTE_TEST_LIVE" => "FALSE",
        "GRAPHITE_NOTE_TEST_EXPLAIN" => "FALSE",
        "GRAPHITE_NOTE_APIKEY" => "NONE",
    ]);

    $idmap_resolved = Helpers::to_map(
        $env["GRAPHITE_NOTE_TEST_MODEL_INFO_ENTID"]);
    if ($idmap_resolved === null) {
        $idmap_resolved = Helpers::to_map($idmap);
    }

    if ($env["GRAPHITE_NOTE_TEST_LIVE"] === "TRUE") {
        $merged_opts = Vs::merge([
            [
                "apikey" => $env["GRAPHITE_NOTE_APIKEY"],
            ],
            $extra ?? [],
        ]);
        $client = new GraphiteNoteSDK(Helpers::to_map($merged_opts));
    }

    $live = $env["GRAPHITE_NOTE_TEST_LIVE"] === "TRUE";
    return [
        "client" => $client,
        "data" => $entity_data,
        "idmap" => $idmap_resolved,
        "env" => $env,
        "explain" => $env["GRAPHITE_NOTE_TEST_EXPLAIN"] === "TRUE",
        "live" => $live,
        "synthetic_only" => $live && !$idmap_overridden,
        "now" => (int)(microtime(true) * 1000),
    ];
}
