# Prediction entity test

import json
import os
import time

import pytest

from utility.voxgig_struct import voxgig_struct as vs
from graphitenote_sdk import GraphiteNoteSDK
from core import helpers

_TEST_DIR = os.path.dirname(os.path.abspath(__file__))
from test import runner


class TestPredictionEntity:

    def test_should_create_instance(self):
        testsdk = GraphiteNoteSDK.test(None, None)
        ent = testsdk.Prediction(None)
        assert ent is not None

    def test_should_run_basic_flow(self):
        setup = _prediction_basic_setup(None)
        # Per-op sdk-test-control.json skip — basic test exercises a flow with
        # multiple ops; skipping any one skips the whole flow (steps depend
        # on each other).
        _live = setup.get("live", False)
        for _op in ["create"]:
            _skip, _reason = runner.is_control_skipped("entityOp", "prediction." + _op, "live" if _live else "unit")
            if _skip:
                pytest.skip(_reason or "skipped via sdk-test-control.json")
                return
        # The basic flow consumes synthetic IDs from the fixture. In live mode
        # without an *_ENTID env override, those IDs hit the live API and 4xx.
        if setup.get("synthetic_only"):
            pytest.skip("live entity test uses synthetic IDs from fixture — "
                        "set GRAPHITENOTE_TEST_PREDICTION_ENTID JSON to run live")
        client = setup["client"]

        # CREATE
        prediction_ref01_ent = client.Prediction(None)
        prediction_ref01_data = helpers.to_map(vs.getprop(
            vs.getpath(setup["data"], "new.prediction"), "prediction_ref01"))
        prediction_ref01_data["model_code"] = setup["idmap"]["model_code01"]

        prediction_ref01_data = helpers.to_map(prediction_ref01_ent.create(prediction_ref01_data, None))
        assert prediction_ref01_data is not None



def _prediction_basic_setup(extra):
    runner.load_env_local()

    entity_data_file = os.path.join(_TEST_DIR, "../../.sdk/test/entity/prediction/PredictionTestData.json")
    with open(entity_data_file, "r") as f:
        entity_data_source = f.read()

    entity_data = json.loads(entity_data_source)

    options = {}
    options["entity"] = entity_data.get("existing")

    client = GraphiteNoteSDK.test(options, extra)

    # Generate idmap via transform.
    idmap = vs.transform(
        ["prediction01", "prediction02", "prediction03", "model01", "model02", "model03", "model_code01"],
        {
            "`$PACK`": ["", {
                "`$KEY`": "`$COPY`",
                "`$VAL`": ["`$FORMAT`", "upper", "`$COPY`"],
            }],
        }
    )

    # Detect ENTID env override before envOverride consumes it. When live
    # mode is on without a real override, the basic test runs against synthetic
    # IDs from the fixture and 4xx's. We surface this so the test can skip.
    _entid_env_raw = os.environ.get(
        "GRAPHITENOTE_TEST_PREDICTION_ENTID")
    _idmap_overridden = _entid_env_raw is not None and _entid_env_raw.strip().startswith("{")

    env = runner.env_override({
        "GRAPHITENOTE_TEST_PREDICTION_ENTID": idmap,
        "GRAPHITENOTE_TEST_LIVE": "FALSE",
        "GRAPHITENOTE_TEST_EXPLAIN": "FALSE",
        "GRAPHITENOTE_APIKEY": "NONE",
    })

    idmap_resolved = helpers.to_map(
        env.get("GRAPHITENOTE_TEST_PREDICTION_ENTID"))
    if idmap_resolved is None:
        idmap_resolved = helpers.to_map(idmap)

    if env.get("GRAPHITENOTE_TEST_LIVE") == "TRUE":
        merged_opts = vs.merge([
            {
                "apikey": env.get("GRAPHITENOTE_APIKEY"),
            },
            extra or {},
        ])
        client = GraphiteNoteSDK(helpers.to_map(merged_opts))

    _live = env.get("GRAPHITENOTE_TEST_LIVE") == "TRUE"
    return {
        "client": client,
        "data": entity_data,
        "idmap": idmap_resolved,
        "env": env,
        "explain": env.get("GRAPHITENOTE_TEST_EXPLAIN") == "TRUE",
        "live": _live,
        "synthetic_only": _live and not _idmap_overridden,
        "now": int(time.time() * 1000),
    }
