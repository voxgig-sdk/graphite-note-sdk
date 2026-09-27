# GraphiteNote SDK configuration


# The sekreto plugin DEFINITIONS the model selected per feature, imported
# above by name from the modules the catalogue's active `plugin.def`
# entries declare. Handed to each feature (secrets builds its Sekreto
# with them): a provider kind not listed here is unknown to that SDK.
FEATURE_PLUGINS = {
}


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
            "slug": "graphite-note",
            "version": "0.1.1",
            "target": "py",
        },
        "feature": {
            "debug": {
        "options": {
          "active": False,
          "max": 100,
          "redact": [
            "authorization",
            "cookie",
            "set-cookie",
            "api-key",
            "apikey",
            "x-api-key",
            "idempotency-key",
          ],
        },
        "optspec": {
          "now": "`$FUNCTION`",
          "onEntry": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "none",
      },
            "idempotency": {
        "options": {
          "active": False,
          "header": "Idempotency-Key",
          "methods": [
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
          ],
          "ops": [
            "create",
            "update",
            "remove",
          ],
        },
        "optspec": {
          "keygen": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "none",
      },
            "metrics": {
        "options": {
          "active": False,
        },
        "optspec": {
          "now": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "none",
      },
            "paging": {
        "options": {
          "active": False,
          "afterVar": "after",
          "cursorParam": "cursor",
          "firstVar": "first",
          "limitParam": "limit",
          "pageParam": "page",
          "startPage": 1,
        },
        "optspec": {
          "limit": "`$NUMBER`",
          "ops": "`$LIST`",
        },
        "strict": False,
        "transport": "none",
      },
            "ratelimit": {
        "options": {
          "active": False,
          "burst": 5,
          "rate": 5,
        },
        "optspec": {
          "now": "`$FUNCTION`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "retry": {
        "options": {
          "active": False,
          "factor": 2,
          "maxDelay": 2000,
          "minDelay": 50,
          "retries": 2,
          "statuses": [
            408,
            425,
            429,
            500,
            502,
            503,
            504,
          ],
        },
        "optspec": {
          "jitter": "`$BOOLEAN`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "test": {
        "options": {
          "active": False,
        },
        "optspec": {
          "entity": "`$MAP`",
          "net": "`$MAP`",
        },
        "strict": False,
        "transport": "base",
      },
            "timeout": {
        "options": {
          "active": False,
          "ms": 30000,
        },
        "optspec": {
          "clearTimer": "`$FUNCTION`",
          "setTimer": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
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
                "dataset_complete": {},
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
            "title": "Columns",
            "type": "`$INTEGER`",
            "op": {
              "create": {
                "req": True,
                "type": "`$ARRAY`",
              },
            },
            "short": "Number of columns created.",
          },
          {
            "name": "datasetcode",
            "title": "Datasetcode",
            "type": "`$STRING`",
            "short": "Unique code assigned to the created dataset.",
          },
          {
            "name": "name",
            "title": "Name",
            "type": "`$STRING`",
            "req": True,
            "short": "Human-readable dataset name.",
          },
          {
            "name": "tablename",
            "title": "Tablename",
            "type": "`$STRING`",
            "short": "Backing table name, e.g.",
          },
          {
            "name": "usercode",
            "title": "Usercode",
            "type": "`$STRING`",
            "req": True,
            "short": "Unique code identifying the user.",
          },
        ],
        "name": "dataset",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "kind": "http",
                "method": "POST",
                "orig": "/dataset-create",
                "segments": [
                  {
                    "lit": "dataset-create",
                  },
                ],
                "parts": [
                  "dataset-create",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
                "args": {},
                "select": {},
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "dataset_complete": {
        "fields": [
          {
            "name": "datasetcode",
            "title": "Datasetcode",
            "type": "`$STRING`",
            "req": True,
          },
          {
            "name": "details",
            "title": "Details",
            "type": "`$OBJECT`",
          },
          {
            "name": "status",
            "title": "Status",
            "type": "`$STRING`",
            "short": "'success' on success.",
          },
          {
            "name": "usercode",
            "title": "Usercode",
            "type": "`$STRING`",
            "req": True,
          },
        ],
        "name": "dataset_complete",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "kind": "http",
                "method": "POST",
                "orig": "/dataset-complete",
                "segments": [
                  {
                    "lit": "dataset-complete",
                  },
                ],
                "parts": [
                  "dataset-complete",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
                "args": {},
                "select": {},
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
            "title": "Append",
            "type": "`$BOOLEAN`",
            "req": True,
            "short": "True to append to existing rows; false to truncate the dataset first.",
          },
          {
            "name": "columns",
            "title": "Columns",
            "type": "`$ARRAY`",
            "req": True,
          },
          {
            "name": "compressed",
            "title": "Compressed",
            "type": "`$BOOLEAN`",
            "req": True,
            "short": "True when insert-data is gzip+base64; false when it is a JSON-escaped string.",
          },
          {
            "name": "datasetcode",
            "title": "Datasetcode",
            "type": "`$STRING`",
            "req": True,
          },
          {
            "name": "details",
            "title": "Details",
            "type": "`$OBJECT`",
          },
          {
            "name": "insertdata",
            "title": "Insertdata",
            "type": "`$STRING`",
            "req": True,
            "short": "The rows to insert, as a STRING: a JSON-escaped array-of-arrays when compressed is false, or gzipped-then-base64 when compressed is true.",
          },
          {
            "name": "status",
            "title": "Status",
            "type": "`$STRING`",
            "short": "'success' on success.",
          },
          {
            "name": "usercode",
            "title": "Usercode",
            "type": "`$STRING`",
            "req": True,
          },
        ],
        "name": "dataset_fill",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "kind": "http",
                "method": "POST",
                "orig": "/dataset-fill",
                "segments": [
                  {
                    "lit": "dataset-fill",
                  },
                ],
                "parts": [
                  "dataset-fill",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
                "args": {},
                "select": {},
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
            "title": "Code",
            "type": "`$STRING`",
            "short": "Model code (Settings tab, ID section).",
          },
          {
            "name": "created_at",
            "title": "Created At",
            "type": "`$STRING`",
            "format": "date-time",
          },
          {
            "name": "dataset_code",
            "title": "Dataset Code",
            "type": "`$STRING`",
            "short": "Code of the dataset the model is trained on.",
          },
          {
            "name": "model_name",
            "title": "Model Name",
            "type": "`$STRING`",
            "short": "Model type name, e.g.",
          },
          {
            "name": "name",
            "title": "Name",
            "type": "`$STRING`",
            "short": "User-given model name.",
          },
          {
            "name": "properties",
            "title": "Properties",
            "type": "`$OBJECT`",
            "short": "Full model configuration and structured metadata (excluding bulky training artifacts); shape differs by model type (RFM, CLV, ABC, ...).",
          },
          {
            "name": "updated_at",
            "title": "Updated At",
            "type": "`$STRING`",
            "format": "date-time",
          },
        ],
        "name": "model_info",
        "op": {
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/model/fetch-model-info/{model_code}",
                "segments": [
                  {
                    "lit": "model",
                  },
                  {
                    "lit": "fetch-model-info",
                  },
                  {
                    "var": "model_code",
                  },
                ],
                "parts": [
                  "model",
                  "fetch-model-info",
                  "{model_code}",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
                "args": {
                  "params": [
                    {
                      "name": "model_code",
                      "orig": "model_code",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "model_code",
                  ],
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "model_result": {
        "fields": [
          {
            "name": "data",
            "title": "Data",
            "type": "`$ARRAY`",
          },
          {
            "name": "page",
            "title": "Page",
            "type": "`$INTEGER`",
            "short": "Page number for paginated results.",
          },
          {
            "name": "pagesize",
            "title": "Pagesize",
            "type": "`$INTEGER`",
            "short": "Rows per page.",
          },
        ],
        "name": "model_result",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "kind": "http",
                "method": "POST",
                "orig": "/model/fetch-result/{model_code}",
                "segments": [
                  {
                    "lit": "model",
                  },
                  {
                    "lit": "fetch-result",
                  },
                  {
                    "var": "model_code",
                  },
                ],
                "parts": [
                  "model",
                  "fetch-result",
                  "{model_code}",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "params": [
                    {
                      "name": "model_code",
                      "orig": "model_code",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "model_code",
                  ],
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "prediction": {
        "fields": [
          {
            "name": "columns",
            "title": "Columns",
            "type": "`$ARRAY`",
            "short": "Column names associated with each prediction row.",
          },
          {
            "name": "data",
            "title": "Data",
            "type": "`$ARRAY`",
            "op": {
              "create": {
                "req": True,
                "type": "`$OBJECT`",
              },
            },
          },
        ],
        "name": "prediction",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "kind": "http",
                "method": "POST",
                "orig": "/v1/prediction/model/{model_code}",
                "segments": [
                  {
                    "lit": "v1",
                  },
                  {
                    "lit": "prediction",
                  },
                  {
                    "lit": "model",
                  },
                  {
                    "var": "model_code",
                  },
                ],
                "parts": [
                  "v1",
                  "prediction",
                  "model",
                  "{model_code}",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
                "args": {
                  "params": [
                    {
                      "name": "model_code",
                      "orig": "model_code",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "model_code",
                  ],
                },
              },
              {
                "kind": "http",
                "method": "POST",
                "orig": "/v2/prediction/model/{model_code}",
                "segments": [
                  {
                    "lit": "v2",
                  },
                  {
                    "lit": "prediction",
                  },
                  {
                    "lit": "model",
                  },
                  {
                    "var": "model_code",
                  },
                ],
                "parts": [
                  "v2",
                  "prediction",
                  "model",
                  "{model_code}",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
                "args": {
                  "params": [
                    {
                      "name": "model_code",
                      "orig": "model_code",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "model_code",
                  ],
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
    },
    }
