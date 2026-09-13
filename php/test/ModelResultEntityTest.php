<?php
declare(strict_types=1);

// ModelResult entity test

require_once __DIR__ . '/../graphitenote_sdk.php';
require_once __DIR__ . '/Runner.php';

use PHPUnit\Framework\TestCase;
use Voxgig\Struct\Struct as Vs;

class ModelResultEntityTest extends TestCase
{
    public function test_create_instance(): void
    {
        $testsdk = GraphiteNoteSDK::test(null, null);
        $ent = $testsdk->ModelResult(null);
        $this->assertNotNull($ent);
    }

    public function test_basic_flow(): void
    {
        $setup = model_result_basic_setup(null);
        // Per-op sdk-test-control.json skip.
        $_live = !empty($setup["live"]);
        foreach (["create"] as $_op) {
            [$_shouldSkip, $_reason] = Runner::is_control_skipped("entityOp", "model_result." . $_op, $_live ? "live" : "unit");
            if ($_shouldSkip) {
                $this->markTestSkipped($_reason ?? "skipped via sdk-test-control.json");
                return;
            }
        }
        // The basic flow consumes synthetic IDs from the fixture. In live mode
        // without an *_ENTID env override, those IDs hit the live API and 4xx.
        if (!empty($setup["synthetic_only"])) {
            $this->markTestSkipped("live entity test uses synthetic IDs from fixture — set GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID JSON to run live");
            return;
        }
        $client = $setup["client"];

        // CREATE
        $model_result_ref01_ent = $client->ModelResult(null);
        $model_result_ref01_data = Helpers::to_map(Vs::getprop(
            Vs::getpath($setup["data"], "new.model_result"), "model_result_ref01"));
        $model_result_ref01_data["model_code"] = $setup["idmap"]["model_code01"];

        $model_result_ref01_data_result = $model_result_ref01_ent->create($model_result_ref01_data, null);
        $model_result_ref01_data = Helpers::to_map(is_object($model_result_ref01_data_result) && method_exists($model_result_ref01_data_result, 'data_get') ? $model_result_ref01_data_result->data_get() : $model_result_ref01_data_result);
        $this->assertNotNull($model_result_ref01_data);

    }
}

function model_result_basic_setup($extra)
{
    Runner::load_env_local();

    $entity_data_file = __DIR__ . '/../../.sdk/test/entity/model_result/ModelResultTestData.json';
    $entity_data_source = file_get_contents($entity_data_file);
    $entity_data = json_decode($entity_data_source, true);

    $options = [];
    $options["entity"] = $entity_data["existing"];

    $client = GraphiteNoteSDK::test($options, $extra);

    // Generate idmap.
    $idmap = [];
    foreach (["model_result01", "model_result02", "model_result03", "fetch_result01", "fetch_result02", "fetch_result03", "model_code01"] as $k) {
        $idmap[$k] = strtoupper($k);
    }

    // Detect ENTID env override before envOverride consumes it. When live
    // mode is on without a real override, the basic test runs against synthetic
    // IDs from the fixture and 4xx's. Surface this so the test can skip.
    $entid_env_raw = getenv("GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID");
    $idmap_overridden = $entid_env_raw !== false && str_starts_with(trim($entid_env_raw), "{");

    $env = Runner::env_override([
        "GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID" => $idmap,
        "GRAPHITE_NOTE_TEST_LIVE" => "FALSE",
        "GRAPHITE_NOTE_TEST_EXPLAIN" => "FALSE",
        "GRAPHITE_NOTE_APIKEY" => "",
    ]);

    $idmap_resolved = Helpers::to_map(
        $env["GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID"]);
    if ($idmap_resolved === null) {
        $idmap_resolved = Helpers::to_map($idmap);
    }

    if ($env["GRAPHITE_NOTE_TEST_LIVE"] === "TRUE") {
        $merged_opts = Vs::merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            Runner::live_client_options(),
            [
                "apikey" => $env["GRAPHITE_NOTE_APIKEY"],
            ],
            // ismap, not a plain "?? []" default: an empty PHP array is a
            // LIST, and a non-map later entry REPLACES the accumulated map in
            // merge - so the no-extras call discarded live_client_options()
            // and the apikey/server map above it.
            Vs::ismap($extra) ? $extra : new \stdClass(),
        ]);
        // "?? []" because merge legitimately answers with a stdClass when every
        // contributing entry is an EMPTY map - an SDK with no apikey and no
        // server variables generates an empty middle entry, so that is the
        // common case, not the edge one. to_map returns null for a non-array by
        // design, and the constructor takes a non-nullable array, so without the
        // fallback every such SDK died on "must be of type array, null given"
        // the moment live mode was switched on. Offline mode never reaches this
        // branch, which is why the offline suite stayed green.
        $client = new GraphiteNoteSDK(Helpers::to_map($merged_opts) ?? []);
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
