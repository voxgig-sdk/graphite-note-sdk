# ModelResult entity test

import json
import os
import time

import pytest

from graphitenote_sdk.utility.voxgig_struct import voxgig_struct as vs
from graphitenote_sdk import GraphiteNoteSDK
from graphitenote_sdk.core import helpers
from graphitenote_sdk.config import shared_config
from graphitenote_sdk.feature.base_feature import GraphiteNoteBaseFeature

_TEST_DIR = os.path.dirname(os.path.abspath(__file__))
from test import runner



# main.kit.test.live.strict is true (the default is true): a live
# request that fails, or a live test missing an input it needs,
# fails the test.
# An account with no record for a test to read skips it either way.
LIVE_STRICT = True


class TestModelResultEntity:

    def test_should_create_instance(self):
        testsdk = GraphiteNoteSDK.test(None, None)
        ent = testsdk.ModelResult(None)
        assert ent is not None

    def test_should_refuse_an_invalid_request(self):
        if "validate" not in (shared_config().get("feature") or {}):
            pytest.skip("feature not present in this SDK: validate")
        client = GraphiteNoteSDK.test(
            None, {"feature": {"validate": {"active": True}}})
        with pytest.raises(Exception) as err:
            client.ModelResult(None).create({"model_code": 1}, None)
        assert "validate_failed" == getattr(err.value, "code", None)

    def test_should_run_basic_flow(self):
        setup = _model_result_basic_setup(None)
        # Per-op sdk-test-control.json skip — basic test exercises a flow with
        # multiple ops; skipping any one skips the whole flow (steps depend
        # on each other).
        _live = setup.get("live", False)
        for _op in ["create"]:
            _skip, _reason = runner.is_control_skipped("entityOp", "model_result." + _op, "live" if _live else "unit")
            if _skip:
                pytest.skip(_reason or "skipped via sdk-test-control.json")
                return
        if setup["live"]:
            for _live_key in ["model_code01"]:
                if setup.get("synthetic_only") or setup["idmap"].get(_live_key) is None:
                    runner.live_miss(LIVE_STRICT, f"Live entity test blocked: needs {_live_key} via GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID")
        client = setup["client"]

        # CREATE
        model_result_ref01_ent = client.ModelResult(None)
        model_result_ref01_data = helpers.to_map(vs.getprop(
            vs.getpath(setup["data"], "new.model_result"), "model_result_ref01"))
        model_result_ref01_data["model_code"] = setup["idmap"]["model_code01"]

        model_result_ref01_data = helpers.to_map(runner.entity_data(model_result_ref01_ent.create(model_result_ref01_data, None)))
        assert model_result_ref01_data is not None



def _model_result_basic_setup(extra):
    runner.load_env_local()

    entity_data_file = os.path.join(_TEST_DIR, "../../.sdk/test/entity/model_result/ModelResultTestData.json")
    with open(entity_data_file, "r", encoding="utf-8") as f:
        entity_data_source = f.read()

    entity_data = json.loads(entity_data_source)

    options = {}
    options["entity"] = entity_data.get("existing")

    client = GraphiteNoteSDK.test(options, extra)

    # Generate idmap via transform.
    idmap = vs.transform(
        ["model_result01", "model_result02", "model_result03", "model_code01"],
        {
            "`$PACK`": ["", {
                "`$KEY`": "`$COPY`",
                "`$VAL`": ["`$FORMAT`", "upper", "`$COPY`"],
            }],
        }
    )

    # Whether *_ENTID supplied the idmap, read before env_override consumes
    # it: without it, the ids a live flow binds are the fixture's synthetic ones.
    _entid_env_raw = os.environ.get(
        "GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID")
    _idmap_overridden = _entid_env_raw is not None and _entid_env_raw.strip().startswith("{")

    env = runner.env_override({
        "GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID": idmap,
        "GRAPHITE_NOTE_TEST_LIVE": "FALSE",
        "GRAPHITE_NOTE_TEST_EXPLAIN": "FALSE",
        "GRAPHITE_NOTE_APIKEY": "",
    })

    idmap_resolved = helpers.to_map(
        env.get("GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID"))
    if idmap_resolved is None:
        idmap_resolved = helpers.to_map(idmap)

    if env.get("GRAPHITE_NOTE_TEST_LIVE") == "TRUE":
        merged_opts = vs.merge([
            # FIRST, so the generated fields below win: sdk-test-control.json's
            # test.client.options adds to the live client, it does not
            # redirect it.
            runner.live_client_options(),
            {
                "apikey": env.get("GRAPHITE_NOTE_APIKEY"),
            },
            extra or {},
        ])
        client = GraphiteNoteSDK(helpers.to_map(merged_opts))

    _live = env.get("GRAPHITE_NOTE_TEST_LIVE") == "TRUE"
    return {
        "client": client,
        "data": entity_data,
        "idmap": idmap_resolved,
        "env": env,
        "explain": env.get("GRAPHITE_NOTE_TEST_EXPLAIN") == "TRUE",
        "live": _live,
        "synthetic_only": _live and not _idmap_overridden,
        "now": int(time.time() * 1000),
    }
