# GraphiteNote SDK configuration


_shared_config = None


def shared_config():
    """Return the process-wide config, built once on first use.

    The SDK reads the config on every request and never writes to it, so one
    instance is shared by every client rather than rebuilt per client.

    The returned dict is shared: treat it as read-only. Callers that need to
    mutate should use make_config, which always returns a fresh copy.
    """
    global _shared_config
    if _shared_config is None:
        _shared_config = make_config()
    return _shared_config


def make_config():
    """Build a fresh, fully materialised config dict.

    Every call rebuilds the whole structure, so prefer shared_config unless
    you need a private copy you intend to mutate.
    """
    return {
        "main": {
            "name": "GraphiteNote",
        },
        "feature": {
            "test": {
        "options": {
          "active": False,
        },
      },
        },
        "options": {
            "base": "https://app.graphite-note.com/api",
            "auth": {
                "prefix": "Bearer",
            },
            "headers": {
        "content-type": "application/json",
      },
            "entity": {
                "dataset": {},
                "dataset_fill": {},
                "model_info": {},
                "model_result": {},
                "prediction": {},
            },
        },
        "entity": {
      "dataset": {
        "fields": [
          {
            "name": "columns",
            "op": {
              "create": {
                "req": True,
                "type": "`$ARRAY`",
              },
            },
            "type": "`$INTEGER`",
          },
          {
            "name": "datasetcode",
            "type": "`$STRING`",
          },
          {
            "name": "name",
            "req": True,
            "type": "`$STRING`",
          },
          {
            "name": "tablename",
            "type": "`$STRING`",
          },
          {
            "name": "usercode",
            "req": True,
            "type": "`$STRING`",
          },
        ],
        "name": "dataset",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "args": {},
                "kind": "http",
                "method": "POST",
                "orig": "/dataset-create",
                "parts": [
                  "dataset-create",
                ],
                "select": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "dataset_fill": {
        "fields": [
          {
            "name": "append",
            "req": True,
            "type": "`$BOOLEAN`",
          },
          {
            "name": "columns",
            "req": True,
            "type": "`$ARRAY`",
          },
          {
            "name": "compressed",
            "req": True,
            "type": "`$BOOLEAN`",
          },
          {
            "name": "datasetcode",
            "req": True,
            "type": "`$STRING`",
          },
          {
            "name": "details",
            "type": "`$OBJECT`",
          },
          {
            "name": "insertdata",
            "req": True,
            "type": "`$STRING`",
          },
          {
            "name": "status",
            "type": "`$STRING`",
          },
          {
            "name": "usercode",
            "req": True,
            "type": "`$STRING`",
          },
        ],
        "name": "dataset_fill",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "args": {},
                "kind": "http",
                "method": "POST",
                "orig": "/dataset-complete",
                "parts": [
                  "dataset-complete",
                ],
                "select": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
              },
              {
                "args": {},
                "kind": "http",
                "method": "POST",
                "orig": "/dataset-fill",
                "parts": [
                  "dataset-fill",
                ],
                "select": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "model_info": {
        "fields": [
          {
            "name": "code",
            "type": "`$STRING`",
          },
          {
            "name": "created_at",
            "type": "`$STRING`",
          },
          {
            "name": "dataset_code",
            "type": "`$STRING`",
          },
          {
            "name": "model_name",
            "type": "`$STRING`",
          },
          {
            "name": "name",
            "type": "`$STRING`",
          },
          {
            "name": "properties",
            "type": "`$OBJECT`",
          },
          {
            "name": "updated_at",
            "type": "`$STRING`",
          },
        ],
        "name": "model_info",
        "op": {
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "args": {
                  "params": [
                    {
                      "kind": "param",
                      "name": "model_code",
                      "orig": "model_code",
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                  ],
                },
                "kind": "http",
                "method": "GET",
                "orig": "/model/fetch-model-info/{model_code}",
                "parts": [
                  "model",
                  "fetch-model-info",
                  "{model_code}",
                ],
                "select": {
                  "exist": [
                    "model_code",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [
            [
              "fetch_model_info",
            ],
          ],
        },
      },
      "model_result": {
        "fields": [
          {
            "name": "data",
            "type": "`$ARRAY`",
          },
          {
            "name": "page",
            "type": "`$INTEGER`",
          },
          {
            "name": "pagesize",
            "type": "`$INTEGER`",
          },
        ],
        "name": "model_result",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "args": {
                  "params": [
                    {
                      "kind": "param",
                      "name": "model_code",
                      "orig": "model_code",
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                  ],
                },
                "kind": "http",
                "method": "POST",
                "orig": "/model/fetch-result/{model_code}",
                "parts": [
                  "model",
                  "fetch-result",
                  "{model_code}",
                ],
                "select": {
                  "exist": [
                    "model_code",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [
            [
              "fetch_result",
            ],
          ],
        },
      },
      "prediction": {
        "fields": [
          {
            "name": "columns",
            "type": "`$ARRAY`",
          },
          {
            "name": "data",
            "op": {
              "create": {
                "req": True,
                "type": "`$OBJECT`",
              },
            },
            "type": "`$ARRAY`",
          },
        ],
        "name": "prediction",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "args": {
                  "params": [
                    {
                      "kind": "param",
                      "name": "model_code",
                      "orig": "model_code",
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                  ],
                },
                "kind": "http",
                "method": "POST",
                "orig": "/v1/prediction/model/{model_code}",
                "parts": [
                  "v1",
                  "prediction",
                  "model",
                  "{model_code}",
                ],
                "select": {
                  "exist": [
                    "model_code",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
              },
              {
                "args": {
                  "params": [
                    {
                      "kind": "param",
                      "name": "model_code",
                      "orig": "model_code",
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                  ],
                },
                "kind": "http",
                "method": "POST",
                "orig": "/v2/prediction/model/{model_code}",
                "parts": [
                  "v2",
                  "prediction",
                  "model",
                  "{model_code}",
                ],
                "select": {
                  "exist": [
                    "model_code",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [
            [
              "model",
            ],
          ],
        },
      },
    },
    }
