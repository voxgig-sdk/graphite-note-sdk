
import { BaseFeature } from './feature/base/BaseFeature'
import { TestFeature } from './feature/test/TestFeature'



const FEATURE_CLASS: Record<string, typeof BaseFeature> = {
   test: TestFeature,

}


class Config {

  makeFeature(this: any, fn: string) {
    const fc = FEATURE_CLASS[fn]
    const fi = new fc()
    // TODO: errors etc
    return fi
  }


  main = {
    name: 'GraphiteNote',
  }


  feature = {
     test:     {
      "options": {
        "active": false
      }
    },

  }


  options = {
    base: 'https://app.graphite-note.com/api',

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
          "type": "`$INTEGER`"
        },
        {
          "name": "datasetcode",
          "type": "`$STRING`"
        },
        {
          "name": "name",
          "req": true,
          "type": "`$STRING`"
        },
        {
          "name": "tablename",
          "type": "`$STRING`"
        },
        {
          "name": "usercode",
          "req": true,
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
              "parts": [
                "dataset-create"
              ],
              "select": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
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
          "req": true,
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
          "type": "`$STRING`"
        },
        {
          "name": "status",
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
              "parts": [
                "dataset-complete"
              ],
              "select": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              }
            },
            {
              "args": {},
              "kind": "http",
              "method": "POST",
              "orig": "/dataset-fill",
              "parts": [
                "dataset-fill"
              ],
              "select": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
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
          "type": "`$STRING`"
        },
        {
          "name": "created_at",
          "type": "`$STRING`"
        },
        {
          "name": "dataset_code",
          "type": "`$STRING`"
        },
        {
          "name": "model_name",
          "type": "`$STRING`"
        },
        {
          "name": "name",
          "type": "`$STRING`"
        },
        {
          "name": "properties",
          "type": "`$OBJECT`"
        },
        {
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
              "parts": [
                "model",
                "fetch-model-info",
                "{model_code}"
              ],
              "select": {
                "exist": [
                  "model_code"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              }
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
          "type": "`$INTEGER`"
        },
        {
          "name": "pagesize",
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
              "parts": [
                "model",
                "fetch-result",
                "{model_code}"
              ],
              "select": {
                "exist": [
                  "model_code"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              }
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
              "parts": [
                "v1",
                "prediction",
                "model",
                "{model_code}"
              ],
              "select": {
                "exist": [
                  "model_code"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              }
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
              "parts": [
                "v2",
                "prediction",
                "model",
                "{model_code}"
              ],
              "select": {
                "exist": [
                  "model_code"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              }
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
  config
}

