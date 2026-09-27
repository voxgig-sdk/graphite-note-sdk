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
(0, node_test_1.describe)('ModelResultEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when GRAPHITE_NOTE_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('GRAPHITE_NOTE_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.GraphiteNoteSDK.test();
        const ent = testsdk.ModelResult();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.GRAPHITE_NOTE_TEST_LIVE;
        for (const op of ['create']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'model_result.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "data": { "a": true, "h": "Data", "n": "data", "r": false, "t": "`$ARRAY`", "key$": "data", "index$": 0 }, "page": { "a": true, "h": "Page", "n": "page", "r": false, "sh": "Page number for paginated results.", "t": "`$INTEGER`", "key$": "page", "index$": 1 }, "pagesize": { "a": true, "h": "Pagesize", "n": "pagesize", "r": false, "sh": "Rows per page.", "t": "`$INTEGER`", "key$": "pagesize", "index$": 2 } }, "name": "model_result", "op": { "create": { "input": "data", "name": "create", "points": [{ "a": true, "co": { "id": "POST /model/fetch-result/{model_code}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "k": "param", "n": "model_code", "or": "model_code", "r": true, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "POST", "o": "/model/fetch-result/{model_code}", "q": { "exist": ["model_code"] }, "r": {}, "s": [{ "lit": "model" }, { "lit": "fetch-result" }, { "var": "model_code" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "create" } }, "relations": { "ancestors": [] }, "key$": "model_result", "name__orig": "model_result", "Name": "ModelResult", "name_": "model_result", "name-": "model-result", "NAME": "MODEL_RESULT", "index$": 4 }, { "active": true, "entity": "model_result", "key$": "BasicModelResultFlow", "kind": "basic", "name": "BasicModelResultFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": { "ref": "model_result_ref01" }, "m": { "model_code": "model_code01" }, "o": "create", "s": [], "v": [], "index$": 0 }] }, 'ModelResult', { "POST /model/fetch-result/{model_code}": { "protocol": "http", "requestBody": { "required": true, "content": { "application/json": { "schema": { "type": "object", "properties": { "page": { "type": "integer", "description": "Page number for paginated results. Defaults to 1.", "key$": "page" }, "page-size": { "type": "integer", "description": "Rows per page. Defaults to 10000.", "key$": "page-size" } }, "description": "Pagination for model result retrieval. Response carries X-Page and X-Page-Size headers.", "x-ref": "#/components/schemas/ModelResultRequest", "index$": 1 } } } }, "parameters": [{ "name": "model_code", "in": "path", "required": true, "description": "The model's code: open the model, Settings tab, ID section.", "schema": { "type": "string" }, "index$": 0 }] } });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        // CREATE
        const model_result_ref01_ent = client.ModelResult();
        let model_result_ref01_data = setup.data.new.model_result['model_result_ref01'];
        model_result_ref01_data['model_code'] = setup.idmap['model_code01'];
        model_result_ref01_data = (await model_result_ref01_ent.create(model_result_ref01_data)).data();
        (0, node_assert_1.default)(null != model_result_ref01_data);
    });
});
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/model_result/ModelResultTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.GraphiteNoteSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['model_result01', 'model_result02', 'model_result03', 'model_code01'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID': idmap,
        'GRAPHITE_NOTE_TEST_LIVE': 'FALSE',
        'GRAPHITE_NOTE_TEST_EXPLAIN': 'FALSE',
        'GRAPHITE_NOTE_APIKEY': '',
    });
    idmap = env['GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID'];
    const live = 'TRUE' === env.GRAPHITE_NOTE_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID'];
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
//# sourceMappingURL=ModelResultEntity.test.js.map