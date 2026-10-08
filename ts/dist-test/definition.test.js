"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const __1 = require("..");
const definition_runner_1 = require("./definition-runner");
const utility_1 = require("./utility");
// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN = [
    {
        "entity": "dataset",
        "accessor": "Dataset",
        "op": "create",
        "method": "POST",
        "path": "/dataset-create",
        "args": [],
        "select": {},
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [],
        "queryArgs": [],
        "auth": [
            [
                {
                    "in": "header",
                    "name": "authorization",
                    "scheme": "bearer"
                }
            ]
        ],
        "status": 200,
        "sample": {
            "data": {
                "dataset-code": "x",
                "table-name": "x",
                "columns": 1
            }
        },
        "idField": "id"
    },
    {
        "entity": "dataset_complete",
        "accessor": "DatasetComplete",
        "op": "create",
        "method": "POST",
        "path": "/dataset-complete",
        "args": [],
        "select": {},
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [],
        "queryArgs": [],
        "auth": [
            [
                {
                    "in": "header",
                    "name": "authorization",
                    "scheme": "bearer"
                }
            ]
        ],
        "status": 200,
        "sample": {
            "data": {
                "status": "x",
                "details": {
                    "dataset-code": "x",
                    "rows-count": 1
                }
            }
        },
        "idField": "id"
    },
    {
        "entity": "dataset_fill",
        "accessor": "DatasetFill",
        "op": "create",
        "method": "POST",
        "path": "/dataset-fill",
        "args": [],
        "select": {},
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [],
        "queryArgs": [],
        "auth": [
            [
                {
                    "in": "header",
                    "name": "authorization",
                    "scheme": "bearer"
                }
            ]
        ],
        "status": 200,
        "sample": {
            "data": {
                "status": "x",
                "details": {
                    "dataset-code": "x",
                    "rows-count": 1
                }
            }
        },
        "idField": "id"
    },
    {
        "entity": "model_info",
        "accessor": "ModelInfo",
        "op": "load",
        "method": "GET",
        "path": "/model/fetch-model-info/{model_code}",
        "args": [
            {
                "name": "model_code",
                "wire": "model_code",
                "value": "p1"
            }
        ],
        "select": {},
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [],
        "queryArgs": [],
        "auth": [
            [
                {
                    "in": "header",
                    "name": "authorization",
                    "scheme": "bearer"
                }
            ]
        ],
        "status": 200,
        "sample": {
            "data": {
                "code": "x",
                "name": "x",
                "model_name": "x",
                "dataset_code": "x",
                "created_at": "2026-01-01T00:00:00Z",
                "updated_at": "2026-01-01T00:00:00Z",
                "properties": {}
            }
        },
        "idField": "id"
    },
    {
        "entity": "model_result",
        "accessor": "ModelResult",
        "op": "create",
        "method": "POST",
        "path": "/model/fetch-result/{model_code}",
        "args": [
            {
                "name": "model_code",
                "wire": "model_code",
                "value": "p1"
            }
        ],
        "select": {},
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [],
        "queryArgs": [],
        "auth": [
            [
                {
                    "in": "header",
                    "name": "authorization",
                    "scheme": "bearer"
                }
            ]
        ],
        "status": 200,
        "sample": {
            "data": [
                {
                    "id": 1
                }
            ]
        },
        "idField": "id"
    }
];
(0, node_test_1.describe)('definition', () => {
    for (const point of PLAN) {
        (0, node_test_1.test)(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
            const control = (0, utility_1.isControlSkipped)('entityOp', point.entity + '.' + point.op, 'definition');
            if (control.skip) {
                t.skip(control.reason || 'skipped via sdk-test-control.json');
                return;
            }
            await (0, definition_runner_1.runDefinitionPoint)(__1.SDK, point);
        });
    }
});
//# sourceMappingURL=definition.test.js.map