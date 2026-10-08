<?php
declare(strict_types=1);

// ModelInfo direct test

require_once __DIR__ . '/../graphitenote_sdk.php';
require_once __DIR__ . '/Runner.php';

use PHPUnit\Framework\TestCase;

class ModelInfoDirectTest extends TestCase
{
    // main.kit.test.live.strict is true (the default is true): a live
    // request that fails, or a live test missing an input it needs,
    // fails the test.
    // An account with no record for a test to read skips it either way.
    private const LIVE_STRICT = true;

    private static function liveOk(array $result): bool
    {
        $status = Helpers::to_int($result["status"] ?? 0);
        return empty($result["err"]) && !empty($result["ok"]) && $status >= 200 && $status < 300;
    }

    public function test_direct_load_model_info(): void
    {
        $setup = model_info_direct_setup(["id" => "direct01"]);
        [$_shouldSkip, $_reason] = Runner::is_control_skipped("direct", "direct-load-model_info", $setup["live"] ? "live" : "unit");
        if ($_shouldSkip) {
            $this->markTestSkipped($_reason ?? "skipped via sdk-test-control.json");
            return;
        }
        if ($setup["live"]) {
            foreach (["model_code01"] as $_liveKey) {
                if (null === ($setup["idmap"][$_liveKey] ?? null)) {
                    Runner::live_miss(self::LIVE_STRICT, "Live test blocked: needs " . $_liveKey . " via GRAPHITE_NOTE_TEST_MODEL_INFO_ENTID");
                }
            }
        }
        $client = $setup["client"];

        $params = [];
        $query = [];
        if ($setup["live"]) {
            $params["model_code"] = $setup["idmap"]["model_code01"] ?? null;
        } else {
            $params["model_code"] = "direct01";
        }

        $result = $client->direct([
            "path" => "model/fetch-model-info/{model_code}",
            "method" => "GET",
            "params" => $params,
            "query" => $query,
        ]);
        if ($setup["live"]) {
            if (!self::liveOk($result)) {
                Runner::live_miss(self::LIVE_STRICT, "Live load failed: " . Runner::live_describe($result));
            }
            if (null === ($result["data"] ?? null)) {
                Runner::live_miss(self::LIVE_STRICT, "Live load returned no data: " . Runner::live_describe($result));
            }
            $this->assertNotNull($result["data"]);
        } else {
            $this->assertArrayNotHasKey("err", $result);
            $this->assertTrue($result["ok"]);
            $this->assertEquals(200, Helpers::to_int($result["status"]));
            $this->assertNotNull($result["data"]);
            if (is_array($result["data"]) && isset($result["data"]["id"])) {
                $this->assertEquals("direct01", $result["data"]["id"]);
            }
            $this->assertCount(1, $setup["calls"]);
        }
    }

}


function model_info_direct_setup($mockres)
{
    Runner::load_env_local();

    $calls = new \ArrayObject();

    $env = Runner::env_override([
        "GRAPHITE_NOTE_TEST_MODEL_INFO_ENTID" => [],
        "GRAPHITE_NOTE_TEST_LIVE" => "FALSE",
        "GRAPHITE_NOTE_APIKEY" => "",
    ]);

    $live = $env["GRAPHITE_NOTE_TEST_LIVE"] === "TRUE";

    if ($live) {
        // Merged so the generated fields win: sdk-test-control.json's
        // test.client.options adds to the live client, it does not redirect it.
        $merged_opts = array_merge(Runner::live_client_options(), [
            "apikey" => $env["GRAPHITE_NOTE_APIKEY"],
        ]);
        $client = new GraphiteNoteSDK($merged_opts);
        $idmap = $env["GRAPHITE_NOTE_TEST_MODEL_INFO_ENTID"] ?? [];
        return [
            "client" => $client,
            "calls" => $calls,
            "live" => true,
            "idmap" => is_array($idmap) ? $idmap : [],
        ];
    }

    $mock_fetch = function ($url, $init) use ($calls, $mockres) {
        $calls[] = ["url" => $url, "init" => $init];
        return [
            [
                "status" => 200,
                "statusText" => "OK",
                "headers" => [],
                "json" => function () use ($mockres) {
                    if ($mockres !== null) {
                        return $mockres;
                    }
                    return ["id" => "direct01"];
                },
                "body" => "mock",
            ],
            null,
        ];
    };

    $client = new GraphiteNoteSDK([
        "base" => "http://localhost:8080",
        "system" => [
            "fetch" => $mock_fetch,
        ],
    ]);

    return [
        "client" => $client,
        "calls" => $calls,
        "live" => false,
        "idmap" => [],
    ];
}
