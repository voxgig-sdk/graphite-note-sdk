
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


const FEATURE_PLUGINS: Record<string, any[]> = {
  
}


class Config {

  makeFeature(this: any, fn: string) {
    const fc = FEATURE_CLASS[fn]
    const fi = new fc()
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
    version: "0.1.1",
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
        "now": "`$FUNCTION`",
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
  
        dataset_complete: {
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
          "title": "Columns",
          "type": "`$INTEGER`",
          "op": {
            "create": {
              "req": true,
              "type": "`$ARRAY`"
            }
          },
          "short": "Number of columns created."
        },
        {
          "name": "datasetcode",
          "title": "Datasetcode",
          "type": "`$STRING`",
          "short": "Unique code assigned to the created dataset."
        },
        {
          "name": "name",
          "title": "Name",
          "type": "`$STRING`",
          "req": true,
          "short": "Human-readable dataset name."
        },
        {
          "name": "tablename",
          "title": "Tablename",
          "type": "`$STRING`",
          "short": "Backing table name, e.g."
        },
        {
          "name": "usercode",
          "title": "Usercode",
          "type": "`$STRING`",
          "req": true,
          "short": "Unique code identifying the user."
        }
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
                  "lit": "dataset-create"
                }
              ],
              "parts": [
                "dataset-create"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              },
              "args": {},
              "select": {},
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "dataset_complete": {
      "fields": [
        {
          "name": "datasetcode",
          "title": "Datasetcode",
          "type": "`$STRING`",
          "req": true
        },
        {
          "name": "details",
          "title": "Details",
          "type": "`$OBJECT`"
        },
        {
          "name": "status",
          "title": "Status",
          "type": "`$STRING`",
          "short": "'success' on success."
        },
        {
          "name": "usercode",
          "title": "Usercode",
          "type": "`$STRING`",
          "req": true
        }
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
                  "lit": "dataset-complete"
                }
              ],
              "parts": [
                "dataset-complete"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              },
              "args": {},
              "select": {},
              "response": {
                "kind": "json",
                "media": "application/json"
              }
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
          "title": "Append",
          "type": "`$BOOLEAN`",
          "req": true,
          "short": "True to append to existing rows; false to truncate the dataset first."
        },
        {
          "name": "columns",
          "title": "Columns",
          "type": "`$ARRAY`",
          "req": true
        },
        {
          "name": "compressed",
          "title": "Compressed",
          "type": "`$BOOLEAN`",
          "req": true,
          "short": "True when insert-data is gzip+base64; false when it is a JSON-escaped string."
        },
        {
          "name": "datasetcode",
          "title": "Datasetcode",
          "type": "`$STRING`",
          "req": true
        },
        {
          "name": "details",
          "title": "Details",
          "type": "`$OBJECT`"
        },
        {
          "name": "insertdata",
          "title": "Insertdata",
          "type": "`$STRING`",
          "req": true,
          "short": "The rows to insert, as a STRING: a JSON-escaped array-of-arrays when compressed is false, or gzipped-then-base64 when compressed is true."
        },
        {
          "name": "status",
          "title": "Status",
          "type": "`$STRING`",
          "short": "'success' on success."
        },
        {
          "name": "usercode",
          "title": "Usercode",
          "type": "`$STRING`",
          "req": true
        }
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
                  "lit": "dataset-fill"
                }
              ],
              "parts": [
                "dataset-fill"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              },
              "args": {},
              "select": {},
              "response": {
                "kind": "json",
                "media": "application/json"
              }
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
          "title": "Code",
          "type": "`$STRING`",
          "short": "Model code (Settings tab, ID section)."
        },
        {
          "name": "created_at",
          "title": "Created At",
          "type": "`$STRING`",
          "format": "date-time"
        },
        {
          "name": "dataset_code",
          "title": "Dataset Code",
          "type": "`$STRING`",
          "short": "Code of the dataset the model is trained on."
        },
        {
          "name": "model_name",
          "title": "Model Name",
          "type": "`$STRING`",
          "short": "Model type name, e.g."
        },
        {
          "name": "name",
          "title": "Name",
          "type": "`$STRING`",
          "short": "User-given model name."
        },
        {
          "name": "properties",
          "title": "Properties",
          "type": "`$OBJECT`",
          "short": "Full model configuration and structured metadata (excluding bulky training artifacts); shape differs by model type (RFM, CLV, ABC, ...)."
        },
        {
          "name": "updated_at",
          "title": "Updated At",
          "type": "`$STRING`",
          "format": "date-time"
        }
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
                  "lit": "model"
                },
                {
                  "lit": "fetch-model-info"
                },
                {
                  "var": "model_code"
                }
              ],
              "parts": [
                "model",
                "fetch-model-info",
                "{model_code}"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              },
              "args": {
                "params": [
                  {
                    "name": "model_code",
                    "orig": "model_code",
                    "type": "`$STRING`",
                    "kind": "param",
                    "reqd": true
                  }
                ]
              },
              "select": {
                "exist": [
                  "model_code"
                ]
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "model_result": {
      "fields": [
        {
          "name": "data",
          "title": "Data",
          "type": "`$ARRAY`"
        },
        {
          "name": "page",
          "title": "Page",
          "type": "`$INTEGER`",
          "short": "Page number for paginated results."
        },
        {
          "name": "pagesize",
          "title": "Pagesize",
          "type": "`$INTEGER`",
          "short": "Rows per page."
        }
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
                  "lit": "model"
                },
                {
                  "lit": "fetch-result"
                },
                {
                  "var": "model_code"
                }
              ],
              "parts": [
                "model",
                "fetch-result",
                "{model_code}"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "params": [
                  {
                    "name": "model_code",
                    "orig": "model_code",
                    "type": "`$STRING`",
                    "kind": "param",
                    "reqd": true
                  }
                ]
              },
              "select": {
                "exist": [
                  "model_code"
                ]
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "prediction": {
      "fields": [
        {
          "name": "columns",
          "title": "Columns",
          "type": "`$ARRAY`",
          "short": "Column names associated with each prediction row."
        },
        {
          "name": "data",
          "title": "Data",
          "type": "`$ARRAY`",
          "op": {
            "create": {
              "req": true,
              "type": "`$OBJECT`"
            }
          }
        }
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
              "parts": [
                "v1",
                "prediction",
                "model",
                "{model_code}"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              },
              "args": {
                "params": [
                  {
                    "name": "model_code",
                    "orig": "model_code",
                    "type": "`$STRING`",
                    "kind": "param",
                    "reqd": true
                  }
                ]
              },
              "select": {
                "exist": [
                  "model_code"
                ]
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            },
            {
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
              "parts": [
                "v2",
                "prediction",
                "model",
                "{model_code}"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              },
              "args": {
                "params": [
                  {
                    "name": "model_code",
                    "orig": "model_code",
                    "type": "`$STRING`",
                    "kind": "param",
                    "reqd": true
                  }
                ]
              },
              "select": {
                "exist": [
                  "model_code"
                ]
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    }
  }
}


const config = new Config()

export {
  config,
  FEATURE_PLUGINS,
}

