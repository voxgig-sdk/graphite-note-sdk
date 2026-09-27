"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const Fs = __importStar(require("node:fs"));
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const live_runner_1 = require("../../live-runner");
const live_entity_1 = require("../../live-entity");
const __1 = require("../../..");
const utility_1 = require("../../utility");
(0, utility_1.loadEnvLocal)(__dirname + '/../../../.env.local');
(0, node_test_1.describe)('PredictionEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when GRAPHITE_NOTE_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('GRAPHITE_NOTE_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.GraphiteNoteSDK.test();
        const ent = testsdk.Prediction();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.GRAPHITE_NOTE_TEST_LIVE;
        for (const op of ['create']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'prediction.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "columns": { "a": true, "h": "Columns", "n": "columns", "r": false, "sh": "Column names associated with each prediction row.", "t": "`$ARRAY`", "key$": "columns", "index$": 0 }, "data": { "a": true, "h": "Data", "n": "data", "op": { "create": { "req": true, "type": "`$OBJECT`" } }, "r": false, "t": "`$ARRAY`", "key$": "data", "index$": 1 } }, "name": "prediction", "op": { "create": { "input": "data", "name": "create", "points": [{ "a": true, "co": { "id": "POST /v1/prediction/model/{model_code}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "k": "param", "n": "model_code", "or": "model_code", "r": true, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "POST", "o": "/v1/prediction/model/{model_code}", "q": { "exist": ["model_code"] }, "r": {}, "s": [{ "lit": "v1" }, { "lit": "prediction" }, { "lit": "model" }, { "var": "model_code" }], "t": { "req": "`reqdata`", "res": "`body.data`" }, "index$": 0 }, { "a": true, "co": { "id": "POST /v2/prediction/model/{model_code}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "k": "param", "n": "model_code", "or": "model_code", "r": true, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "POST", "o": "/v2/prediction/model/{model_code}", "q": { "exist": ["model_code"] }, "r": {}, "s": [{ "lit": "v2" }, { "lit": "prediction" }, { "lit": "model" }, { "var": "model_code" }], "t": { "req": "`reqdata`", "res": "`body.data`" }, "index$": 1 }], "key$": "create" } }, "relations": { "ancestors": [] }, "key$": "prediction", "name__orig": "prediction", "Name": "Prediction", "name_": "prediction", "name-": "prediction", "NAME": "PREDICTION", "index$": 5 }, { "active": true, "entity": "prediction", "key$": "BasicPredictionFlow", "kind": "basic", "name": "BasicPredictionFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": { "ref": "prediction_ref01" }, "m": { "model_code": "model_code01" }, "o": "create", "s": [], "v": [], "index$": 0 }] }, 'Prediction', { "POST /v1/prediction/model/{model_code}": { "protocol": "http", "requestBody": { "required": true, "content": { "application/json": { "schema": { "type": "object", "properties": { "data": { "type": "object", "properties": { "predict_values": { "description": "Either an array of prediction rows (each row an array of alias/selectedValue objects — Binary/Multiclass Classification and Regression models), or a single timeseries object (startDate/endDate/sequenceID[/daysData] — Timeseries models).", "oneOf": [{}, {}] } }, "required": ["predict_values"], "key$": "data" } }, "required": ["data"], "x-ref": "#/components/schemas/PredictionRequestV1", "index$": 1 } } } }, "parameters": [{ "name": "model_code", "in": "path", "required": true, "description": "The model's code: open the model, Settings tab, ID section.", "schema": { "type": "string" }, "index$": 0 }] }, "POST /v2/prediction/model/{model_code}": { "protocol": "http", "requestBody": { "required": true, "content": { "application/json": { "schema": { "type": "object", "properties": { "data": { "type": "object", "properties": { "predict_values": { "type": "array", "items": { "type": "object", "properties": {}, "description": "One prediction row: keys are the EXACT column names used during model training, values are the inputs. All training features are required; extra identifier fields (Lead ID, Customer ID) are passed through unchanged and echoed in the response.", "additionalProperties": true, "x-ref": "#/components/schemas/PredictionRowV2" } } }, "required": ["predict_values"], "key$": "data" } }, "required": ["data"], "x-ref": "#/components/schemas/PredictionRequestV2", "index$": 1 } } } }, "parameters": [{ "name": "model_code", "in": "path", "required": true, "description": "The model's code: open the model, Settings tab, ID section.", "schema": { "type": "string" }, "index$": 0 }] } });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        // CREATE
        const prediction_ref01_ent = client.Prediction();
        let prediction_ref01_data = setup.data.new.prediction['prediction_ref01'];
        prediction_ref01_data['model_code'] = setup.idmap['model_code01'];
        prediction_ref01_data = (await prediction_ref01_ent.create(prediction_ref01_data)).data();
        (0, node_assert_1.default)(null != prediction_ref01_data);
    });
});
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/prediction/PredictionTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.GraphiteNoteSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['prediction01', 'prediction02', 'prediction03', 'model_code01'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'GRAPHITE_NOTE_TEST_PREDICTION_ENTID': idmap,
        'GRAPHITE_NOTE_TEST_LIVE': 'FALSE',
        'GRAPHITE_NOTE_TEST_EXPLAIN': 'FALSE',
        'GRAPHITE_NOTE_APIKEY': '',
    });
    idmap = env['GRAPHITE_NOTE_TEST_PREDICTION_ENTID'];
    const live = 'TRUE' === env.GRAPHITE_NOTE_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['GRAPHITE_NOTE_TEST_PREDICTION_ENTID'];
        idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {};
        if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
            throw new Error('Live ENTID must be a JSON object');
        }
        client = new __1.GraphiteNoteSDK(merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            (0, utility_1.liveClientOptions)(),
            {
                apikey: env.GRAPHITE_NOTE_APIKEY,
            },
            // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
            // last entry is undefined, and basicSetup is normally called with no
            // argument at all - so a bare 'extra' silently discarded the apikey
            // and server values above and handed the SDK undefined. Harmless
            // while there was nothing in that object; not harmless now.
            extra || {},
            { system: { fetch: transport.fetch } }
        ]));
    }
    const setup = {
        idmap,
        env,
        options,
        client,
        struct,
        data: entityData,
        explain: 'TRUE' === env.GRAPHITE_NOTE_TEST_EXPLAIN,
        live,
        transport,
        now: Date.now(),
    };
    return setup;
}
//# sourceMappingURL=PredictionEntity.test.js.map