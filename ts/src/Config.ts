
import { BaseFeature } from './feature/base/BaseFeature'
import { DebugFeature } from './feature/debug/DebugFeature'
import { IdempotencyFeature } from './feature/idempotency/IdempotencyFeature'
import { MetricsFeature } from './feature/metrics/MetricsFeature'
import { PagingFeature } from './feature/paging/PagingFeature'
import { RatelimitFeature } from './feature/ratelimit/RatelimitFeature'
import { RetryFeature } from './feature/retry/RetryFeature'
import { TestFeature } from './feature/test/TestFeature'
import { TimeoutFeature } from './feature/timeout/TimeoutFeature'



const FEATURE_CLASS: Record<string, typeof BaseFeature> = {
   debug: DebugFeature,
 idempotency: IdempotencyFeature,
 metrics: MetricsFeature,
 paging: PagingFeature,
 ratelimit: RatelimitFeature,
 retry: RetryFeature,
 test: TestFeature,
 timeout: TimeoutFeature,

}


// Per-feature plugin DEFINITIONS (voxgig/plugin `Definition` values), from
// the model's active plugin groups. A feature that takes a `plugins` option
// (secrets over sekreto) reads its own entry; a feature with no plugins has
// none. Named imports above make each definition statically reachable, so
// an SDK carries exactly the plugin modules its model selects — the same
// leanness the old side-effect registry imports bought, without a registry.
const FEATURE_PLUGINS: Record<string, any[]> = {
  
}


class Config {

  makeFeature(this: any, fn: string) {
    const fc = FEATURE_CLASS[fn]
    const fi = new fc()
    // TODO: errors etc
    return fi
  }

  // False for a feature added at runtime via options.extend (station's
  // adopt path) - the constructor uses this to skip makeFeature for names
  // no generated class backs.
  hasFeature(this: any, fn: string) {
    return null != FEATURE_CLASS[fn]
  }


  main = {
    name: 'GraphiteNote',
        slug: "graphite-note",
    version: "0.0.1",
    target: "ts",

  }


  feature = {
     debug:     {
      "options": {
        "active": false,
        "max": 100,
        "redact": [
          "authorization",
          "cookie",
          "set-cookie",
          "api-key",
          "apikey",
          "x-api-key",
          "idempotency-key"
        ]
      },
      "optspec": {
        "now": "`$FUNCTION`",
        "onEntry": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "none"
    },
 idempotency:     {
      "options": {
        "active": false,
        "header": "Idempotency-Key",
        "methods": [
          "POST",
          "PUT",
          "PATCH",
          "DELETE"
        ],
        "ops": [
          "create",
          "update",
          "remove"
        ]
      },
      "optspec": {
        "keygen": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "none"
    },
 metrics:     {
      "options": {
        "active": false
      },
      "optspec": {
        "now": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "none"
    },
 paging:     {
      "options": {
        "active": false,
        "afterVar": "after",
        "cursorParam": "cursor",
        "firstVar": "first",
        "limitParam": "limit",
        "pageParam": "page",
        "startPage": 1
      },
      "optspec": {
        "limit": "`$NUMBER`",
        "ops": "`$LIST`"
      },
      "strict": false,
      "transport": "none"
    },
 ratelimit:     {
      "options": {
        "active": false,
        "burst": 5,
        "rate": 5
      },
      "optspec": {
        "now": "`$FUNCTION`",
        "sleep": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "wrap"
    },
 retry:     {
      "options": {
        "active": false,
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
          504
        ]
      },
      "optspec": {
        "jitter": "`$BOOLEAN`",
        "sleep": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "wrap"
    },
 test:     {
      "options": {
        "active": false
      },
      "optspec": {
        "entity": "`$MAP`",
        "net": "`$MAP`"
      },
      "strict": false,
      "transport": "base"
    },
 timeout:     {
      "options": {
        "active": false,
        "ms": 30000
      },
      "optspec": {
        "clearTimer": "`$FUNCTION`",
        "setTimer": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "wrap"
    },

  }


  options = {
    base: "https://app.graphite-note.com/api",

    auth: {
      prefix: 'Bearer',
    },

    headers: {
      "content-type": "application/json"
    },

    entity: {
      
        dataset: {
        },
  
        dataset_fill: {
        },
  
        model_info: {
        },
  
        model_result: {
        },
  
        prediction: {
        },
  
    }
  }


  entity = {
    "dataset": {
      "fields": [
        {
          "name": "columns",
          "op": {
            "create": {
              "req": true,
              "type": "`$ARRAY`"
            }
          },
          "short": "Number of columns created.",
          "type": "`$INTEGER`"
        },
        {
          "name": "datasetcode",
          "short": "Unique code assigned to the created dataset.",
          "type": "`$STRING`"
        },
        {
          "name": "name",
          "req": true,
          "short": "Human-readable dataset name.",
          "type": "`$STRING`"
        },
        {
          "name": "tablename",
          "short": "Backing table name, e.g.",
          "type": "`$STRING`"
        },
        {
          "name": "usercode",
          "req": true,
          "short": "Unique code identifying the user.",
          "type": "`$STRING`"
        }
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
              "segments": [
                {
                  "lit": "dataset-create"
                }
              ],
              "select": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              },
              "parts": [
                "dataset-create"
              ]
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "dataset_fill": {
      "fields": [
        {
          "name": "append",
          "req": true,
          "short": "True to append to existing rows; false to truncate the dataset first.",
          "type": "`$BOOLEAN`"
        },
        {
          "name": "columns",
          "req": true,
          "type": "`$ARRAY`"
        },
        {
          "name": "compressed",
          "req": true,
          "short": "True when insert-data is gzip+base64; false when it is a JSON-escaped string.",
          "type": "`$BOOLEAN`"
        },
        {
          "name": "datasetcode",
          "req": true,
          "type": "`$STRING`"
        },
        {
          "name": "details",
          "type": "`$OBJECT`"
        },
        {
          "name": "insertdata",
          "req": true,
          "short": "The rows to insert, as a STRING: a JSON-escaped array-of-arrays when compressed is false, or gzipped-then-base64 when compressed is true.",
          "type": "`$STRING`"
        },
        {
          "name": "status",
          "short": "'success' on success.",
          "type": "`$STRING`"
        },
        {
          "name": "usercode",
          "req": true,
          "type": "`$STRING`"
        }
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
              "segments": [
                {
                  "lit": "dataset-complete"
                }
              ],
              "select": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              },
              "parts": [
                "dataset-complete"
              ]
            },
            {
              "args": {},
              "kind": "http",
              "method": "POST",
              "orig": "/dataset-fill",
              "segments": [
                {
                  "lit": "dataset-fill"
                }
              ],
              "select": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              },
              "parts": [
                "dataset-fill"
              ]
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "model_info": {
      "fields": [
        {
          "name": "code",
          "short": "Model code (Settings tab, ID section).",
          "type": "`$STRING`"
        },
        {
          "format": "date-time",
          "name": "created_at",
          "type": "`$STRING`"
        },
        {
          "name": "dataset_code",
          "short": "Code of the dataset the model is trained on.",
          "type": "`$STRING`"
        },
        {
          "name": "model_name",
          "short": "Model type name, e.g.",
          "type": "`$STRING`"
        },
        {
          "name": "name",
          "short": "User-given model name.",
          "type": "`$STRING`"
        },
        {
          "name": "properties",
          "short": "Full model configuration and structured metadata (excluding bulky training artifacts); shape differs by model type (RFM, CLV, ABC, ...).",
          "type": "`$OBJECT`"
        },
        {
          "format": "date-time",
          "name": "updated_at",
          "type": "`$STRING`"
        }
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
                    "reqd": true,
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
              "method": "GET",
              "orig": "/model/fetch-model-info/{model_code}",
              "segments": [
                {
                  "lit": "model"
                },
                {
                  "lit": "fetch-model-info"
                },
                {
                  "var": "model_code"
                }
              ],
              "select": {
                "exist": [
                  "model_code"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              },
              "parts": [
                "model",
                "fetch-model-info",
                "{model_code}"
              ]
            }
          ]
        }
      },
      "relations": {
        "ancestors": [
          [
            "fetch_model_info"
          ]
        ]
      }
    },
    "model_result": {
      "fields": [
        {
          "name": "data",
          "type": "`$ARRAY`"
        },
        {
          "name": "page",
          "short": "Page number for paginated results.",
          "type": "`$INTEGER`"
        },
        {
          "name": "pagesize",
          "short": "Rows per page.",
          "type": "`$INTEGER`"
        }
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
                    "reqd": true,
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
              "method": "POST",
              "orig": "/model/fetch-result/{model_code}",
              "segments": [
                {
                  "lit": "model"
                },
                {
                  "lit": "fetch-result"
                },
                {
                  "var": "model_code"
                }
              ],
              "select": {
                "exist": [
                  "model_code"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "model",
                "fetch-result",
                "{model_code}"
              ]
            }
          ]
        }
      },
      "relations": {
        "ancestors": [
          [
            "fetch_result"
          ]
        ]
      }
    },
    "prediction": {
      "fields": [
        {
          "name": "columns",
          "short": "Column names associated with each prediction row.",
          "type": "`$ARRAY`"
        },
        {
          "name": "data",
          "op": {
            "create": {
              "req": true,
              "type": "`$OBJECT`"
            }
          },
          "type": "`$ARRAY`"
        }
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
                    "reqd": true,
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
              "method": "POST",
              "orig": "/v1/prediction/model/{model_code}",
              "segments": [
                {
                  "lit": "v1"
                },
                {
                  "lit": "prediction"
                },
                {
                  "lit": "model"
                },
                {
                  "var": "model_code"
                }
              ],
              "select": {
                "exist": [
                  "model_code"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              },
              "parts": [
                "v1",
                "prediction",
                "model",
                "{model_code}"
              ]
            },
            {
              "args": {
                "params": [
                  {
                    "kind": "param",
                    "name": "model_code",
                    "orig": "model_code",
                    "reqd": true,
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
              "method": "POST",
              "orig": "/v2/prediction/model/{model_code}",
              "segments": [
                {
                  "lit": "v2"
                },
                {
                  "lit": "prediction"
                },
                {
                  "lit": "model"
                },
                {
                  "var": "model_code"
                }
              ],
              "select": {
                "exist": [
                  "model_code"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              },
              "parts": [
                "v2",
                "prediction",
                "model",
                "{model_code}"
              ]
            }
          ]
        }
      },
      "relations": {
        "ancestors": [
          [
            "model"
          ]
        ]
      }
    }
  }
}


const config = new Config()

export {
  config,
  FEATURE_PLUGINS,
}

