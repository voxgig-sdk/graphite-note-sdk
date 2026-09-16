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
// AFTER the imports on purpose: TypeScript hoists `import` above any
// statement in the emitted CommonJS, so a loader placed above them would
// run only after every imported module had already been evaluated - and
// anything reading process.env at module scope would miss these values.
(0, utility_1.loadEnvLocal)(__dirname + '/../../../.env.local');
(0, node_test_1.describe)('DatasetFillEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when GRAPHITE_NOTE_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('GRAPHITE_NOTE_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.GraphiteNoteSDK.test();
        const ent = testsdk.DatasetFill();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.GRAPHITE_NOTE_TEST_LIVE;
        for (const op of ['create']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'dataset_fill.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": [{ "active": true, "name": "append", "req": true, "short": "True to append to existing rows; false to truncate the dataset first.", "type": "`$BOOLEAN`", "index$": 0 }, { "active": true, "name": "columns", "req": true, "type": "`$ARRAY`", "index$": 1 }, { "active": true, "name": "compressed", "req": true, "short": "True when insert-data is gzip+base64; false when it is a JSON-escaped string.", "type": "`$BOOLEAN`", "index$": 2 }, { "active": true, "name": "datasetcode", "req": true, "type": "`$STRING`", "index$": 3 }, { "active": true, "name": "details", "req": false, "type": "`$OBJECT`", "index$": 4 }, { "active": true, "name": "insertdata", "req": true, "short": "The rows to insert, as a STRING: a JSON-escaped array-of-arrays when compressed is false, or gzipped-then-base64 when compressed is true.", "type": "`$STRING`", "index$": 5 }, { "active": true, "name": "status", "req": false, "short": "'success' on success.", "type": "`$STRING`", "index$": 6 }, { "active": true, "name": "usercode", "req": true, "type": "`$STRING`", "index$": 7 }], "name": "dataset_fill", "op": { "create": { "input": "data", "name": "create", "points": [{ "active": true, "args": {}, "contract": { "id": "POST /dataset-complete", "json": "{\"operationId\":\"CompleteDataset\",\"parameters\":[],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"schema\":{\"description\":\"Signals the end of dataset insertion: triggers final dataset shape calculation and post-processing.\",\"properties\":{\"dataset-code\":{\"type\":\"string\"},\"user-code\":{\"type\":\"string\"}},\"required\":[\"user-code\",\"dataset-code\"],\"type\":\"object\"}}},\"required\":true},\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"data\":{\"properties\":{\"details\":{\"properties\":{\"dataset-code\":{\"type\":\"string\"},\"rows-count\":{\"description\":\"Total rows in the dataset after the operation.\",\"type\":\"integer\"}},\"type\":\"object\"},\"status\":{\"description\":\"'success' on success.\",\"type\":\"string\"}},\"type\":\"object\"}},\"type\":\"object\"}}},\"description\":\"Success.\"},\"429\":{\"content\":{\"application/json\":{\"schema\":{\"additionalProperties\":true,\"description\":\"Error payload. Notable statuses: 429 rate limit (tenant 10/min, global 200/min); custom 44x business errors — 441 subscription plan limit, 442 email exists, 443 free trial finished, 445 model creation limit.\",\"properties\":{\"message\":{\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"Rate limit exceeded (tenant 10/min, global 200/min).\"}},\"security\":[{\"BearerTokenAuth\":[]}],\"securitySchemes\":{\"BearerTokenAuth\":{\"description\":\"Tenant token from the Graphite Note app's Account Info page.\",\"scheme\":\"bearer\",\"type\":\"http\"}},\"securitySource\":\"definition\"}", "source": "openapi3", "version": 1 }, "kind": "http", "method": "POST", "orig": "/dataset-complete", "segments": [{ "lit": "dataset-complete" }], "select": {}, "transform": { "req": "`reqdata`", "res": "`body.data`" }, "index$": 0 }, { "active": true, "args": {}, "contract": { "id": "POST /dataset-fill", "json": "{\"operationId\":\"FillDataset\",\"parameters\":[],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"append\":{\"description\":\"True to append to existing rows; false to truncate the dataset first.\",\"type\":\"boolean\"},\"columns\":{\"items\":{\"description\":\"One column of a dataset's structure.\",\"properties\":{\"alias\":{\"description\":\"Display alias for the column.\",\"type\":\"string\"},\"format\":{\"description\":\"Optional display format, e.g. '#,###.##' for numeric or 'Y-d-m H:i:s' for datetime.\",\"type\":\"string\"},\"name\":{\"description\":\"Column name as it appears in the source data.\",\"type\":\"string\"},\"subtype\":{\"enum\":[\"text\",\"numeric\",\"date\",\"datetime\"],\"type\":\"string\"},\"type\":{\"enum\":[\"measure\",\"dimension\"],\"type\":\"string\"}},\"required\":[\"name\",\"alias\",\"type\",\"subtype\"],\"type\":\"object\"},\"type\":\"array\"},\"compressed\":{\"description\":\"True when insert-data is gzip+base64; false when it is a JSON-escaped string.\",\"type\":\"boolean\"},\"dataset-code\":{\"type\":\"string\"},\"insert-data\":{\"description\":\"The rows to insert, as a STRING: a JSON-escaped array-of-arrays when compressed is false, or gzipped-then-base64 when compressed is true. Batch large datasets (e.g. 10,000 rows per call).\",\"type\":\"string\"},\"user-code\":{\"type\":\"string\"}},\"required\":[\"user-code\",\"dataset-code\",\"columns\",\"insert-data\",\"compressed\",\"append\"],\"type\":\"object\"}}},\"required\":true},\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"data\":{\"properties\":{\"details\":{\"properties\":{\"dataset-code\":{\"type\":\"string\"},\"rows-count\":{\"description\":\"Total rows in the dataset after the operation.\",\"type\":\"integer\"}},\"type\":\"object\"},\"status\":{\"description\":\"'success' on success.\",\"type\":\"string\"}},\"type\":\"object\"}},\"type\":\"object\"}}},\"description\":\"Success.\"},\"429\":{\"content\":{\"application/json\":{\"schema\":{\"additionalProperties\":true,\"description\":\"Error payload. Notable statuses: 429 rate limit (tenant 10/min, global 200/min); custom 44x business errors — 441 subscription plan limit, 442 email exists, 443 free trial finished, 445 model creation limit.\",\"properties\":{\"message\":{\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"Rate limit exceeded (tenant 10/min, global 200/min).\"}},\"security\":[{\"BearerTokenAuth\":[]}],\"securitySchemes\":{\"BearerTokenAuth\":{\"description\":\"Tenant token from the Graphite Note app's Account Info page.\",\"scheme\":\"bearer\",\"type\":\"http\"}},\"securitySource\":\"definition\"}", "source": "openapi3", "version": 1 }, "kind": "http", "method": "POST", "orig": "/dataset-fill", "segments": [{ "lit": "dataset-fill" }], "select": {}, "transform": { "req": "`reqdata`", "res": "`body.data`" }, "index$": 1 }], "key$": "create" } }, "relations": { "ancestors": [] }, "key$": "dataset_fill", "name__orig": "dataset_fill", "Name": "DatasetFill", "name_": "dataset_fill", "name-": "dataset-fill", "NAME": "DATASET_FILL", "index$": 1 }, { "active": true, "entity": "dataset_fill", "key$": "BasicDatasetFillFlow", "kind": "basic", "name": "BasicDatasetFillFlow", "param": {}, "step": [{ "active": true, "data": {}, "input": { "ref": "dataset_fill_ref01" }, "match": {}, "op": "create", "spec": [], "valid": [], "index$": 0 }] }, 'DatasetFill');
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        // CREATE
        const dataset_fill_ref01_ent = client.DatasetFill();
        let dataset_fill_ref01_data = setup.data.new.dataset_fill['dataset_fill_ref01'];
        dataset_fill_ref01_data = (await dataset_fill_ref01_ent.create(dataset_fill_ref01_data)).data();
        (0, node_assert_1.default)(null != dataset_fill_ref01_data);
    });
});
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/dataset_fill/DatasetFillTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.GraphiteNoteSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['dataset_fill01', 'dataset_fill02', 'dataset_fill03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'GRAPHITE_NOTE_TEST_DATASET_FILL_ENTID': idmap,
        'GRAPHITE_NOTE_TEST_LIVE': 'FALSE',
        'GRAPHITE_NOTE_TEST_EXPLAIN': 'FALSE',
        'GRAPHITE_NOTE_APIKEY': '',
    });
    idmap = env['GRAPHITE_NOTE_TEST_DATASET_FILL_ENTID'];
    const live = 'TRUE' === env.GRAPHITE_NOTE_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['GRAPHITE_NOTE_TEST_DATASET_FILL_ENTID'];
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
//# sourceMappingURL=DatasetFillEntity.test.js.map