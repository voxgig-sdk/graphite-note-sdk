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
(0, node_test_1.describe)('ModelInfoEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when GRAPHITE_NOTE_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('GRAPHITE_NOTE_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.GraphiteNoteSDK.test();
        const ent = testsdk.ModelInfo();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('validate', async (t) => {
        if (null == __1.config.feature?.validate) {
            t.skip('feature not present in this SDK: validate');
            return;
        }
        const client = __1.GraphiteNoteSDK.test(undefined, { feature: { validate: { active: true } } });
        await node_assert_1.default.rejects(client.ModelInfo().load({ "model_code": 1 }), (err) => 'validate_failed' === err.code);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.GRAPHITE_NOTE_TEST_LIVE;
        for (const op of []) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'model_info.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "code": { "a": true, "h": "Code", "n": "code", "r": false, "sh": "Model code (Settings tab, ID section).", "t": "`$STRING`", "key$": "code", "index$": 0 }, "created_at": { "a": true, "fo": "date-time", "h": "Created At", "n": "created_at", "r": false, "t": "`$STRING`", "key$": "created_at", "index$": 1 }, "dataset_code": { "a": true, "h": "Dataset Code", "n": "dataset_code", "r": false, "sh": "Code of the dataset the model is trained on.", "t": "`$STRING`", "key$": "dataset_code", "index$": 2 }, "model_name": { "a": true, "h": "Model Name", "n": "model_name", "r": false, "sh": "Model type name, e.g.", "t": "`$STRING`", "key$": "model_name", "index$": 3 }, "name": { "a": true, "h": "Name", "n": "name", "r": false, "sh": "User-given model name.", "t": "`$STRING`", "key$": "name", "index$": 4 }, "properties": { "a": true, "h": "Properties", "n": "properties", "r": false, "sh": "Full model configuration and structured metadata (excluding bulky training artifacts); shape differs by model type (RFM, CLV, ABC, ...).", "t": "`$OBJECT`", "key$": "properties", "index$": 5 }, "updated_at": { "a": true, "fo": "date-time", "h": "Updated At", "n": "updated_at", "r": false, "t": "`$STRING`", "key$": "updated_at", "index$": 6 } }, "name": "model_info", "op": { "load": { "input": "data", "name": "load", "points": [{ "a": true, "co": { "id": "GET /model/fetch-model-info/{model_code}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "k": "param", "n": "model_code", "or": "model_code", "r": true, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "GET", "o": "/model/fetch-model-info/{model_code}", "q": { "exist": ["model_code"] }, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "model" }, { "lit": "fetch-model-info" }, { "var": "model_code" }], "t": { "req": "`reqdata`", "res": "`body.data`" }, "index$": 0 }], "key$": "load" } }, "relations": { "ancestors": [] }, "key$": "model_info", "name__orig": "model_info", "Name": "ModelInfo", "name_": "model_info", "name-": "model-info", "NAME": "MODEL_INFO", "index$": 3 }, { "active": true, "entity": "model_info", "key$": "BasicModelInfoFlow", "kind": "basic", "name": "BasicModelInfoFlow", "param": {}, "step": [{ "a": false, "d": {}, "i": { "ref": "model_info_ref01", "srcdatavar": "model_info_ref01_data", "suffix": "_dt0" }, "m": { "id": "model_info01" }, "o": "load", "s": [], "v": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-model_info_ref01" } }], "unreachable": true }] }, 'ModelInfo', { "GET /model/fetch-model-info/{model_code}": { "protocol": "http", "parameters": [{ "name": "model_code", "in": "path", "required": true, "description": "The model's code: open the model, Settings tab, ID section.", "schema": { "type": "string" }, "index$": 0 }] } }, { strict: LIVE_STRICT, t });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        let model_info_ref01_data = Object.values(setup.data.existing.model_info)[0];
    });
});
// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true;
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/model_info/ModelInfoTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.GraphiteNoteSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['model_info01', 'model_info02', 'model_info03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'GRAPHITE_NOTE_TEST_MODEL_INFO_ENTID': idmap,
        'GRAPHITE_NOTE_TEST_LIVE': 'FALSE',
        'GRAPHITE_NOTE_TEST_EXPLAIN': 'FALSE',
        'GRAPHITE_NOTE_APIKEY': '',
    });
    idmap = env['GRAPHITE_NOTE_TEST_MODEL_INFO_ENTID'];
    const live = 'TRUE' === env.GRAPHITE_NOTE_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['GRAPHITE_NOTE_TEST_MODEL_INFO_ENTID'];
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
//# sourceMappingURL=ModelInfoEntity.test.js.map