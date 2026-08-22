package core

import (
	"sync"
)

// MakeConfig builds a fresh, fully materialised config map. Every call
// rebuilds the whole structure, so prefer SharedConfig unless you need a
// private copy you intend to mutate.
func MakeConfig() map[string]any {
	return map[string]any{
		"main": map[string]any{
			"name": "GraphiteNote",
			"slug": "graphite-note",
			"version": "0.0.1",
			"target": "go",
		},
		"feature": map[string]any{
			"test": map[string]any{
				"options": map[string]any{
					"active": false,
				},
			},
		},
		"options": map[string]any{
			"base": "https://app.graphite-note.com/api",
			"auth": map[string]any{
				"prefix": "Bearer",
			},
			"headers": map[string]any{
				"content-type": "application/json",
			},
			"entity": map[string]any{
				"dataset": map[string]any{},
				"dataset_fill": map[string]any{},
				"model_info": map[string]any{},
				"model_result": map[string]any{},
				"prediction": map[string]any{},
			},
		},
		"entity": map[string]any{
			"dataset": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "columns",
						"op": map[string]any{
							"create": map[string]any{
								"req": true,
								"type": "`$ARRAY`",
							},
						},
						"short": "Number of columns created.",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "datasetcode",
						"short": "Unique code assigned to the created dataset.",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "name",
						"req": true,
						"short": "Human-readable dataset name.",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "tablename",
						"short": "Backing table name, e.g.",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "usercode",
						"req": true,
						"short": "Unique code identifying the user.",
						"type": "`$STRING`",
					},
				},
				"name": "dataset",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"args": map[string]any{},
								"kind": "http",
								"method": "POST",
								"orig": "/dataset-create",
								"parts": []any{
									"dataset-create",
								},
								"select": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"dataset_fill": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "append",
						"req": true,
						"short": "True to append to existing rows; false to truncate the dataset first.",
						"type": "`$BOOLEAN`",
					},
					map[string]any{
						"name": "columns",
						"req": true,
						"type": "`$ARRAY`",
					},
					map[string]any{
						"name": "compressed",
						"req": true,
						"short": "True when insert-data is gzip+base64; false when it is a JSON-escaped string.",
						"type": "`$BOOLEAN`",
					},
					map[string]any{
						"name": "datasetcode",
						"req": true,
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "details",
						"type": "`$OBJECT`",
					},
					map[string]any{
						"name": "insertdata",
						"req": true,
						"short": "The rows to insert, as a STRING: a JSON-escaped array-of-arrays when compressed is false, or gzipped-then-base64 when compressed is true.",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "status",
						"short": "'success' on success.",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "usercode",
						"req": true,
						"type": "`$STRING`",
					},
				},
				"name": "dataset_fill",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"args": map[string]any{},
								"kind": "http",
								"method": "POST",
								"orig": "/dataset-complete",
								"parts": []any{
									"dataset-complete",
								},
								"select": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
							},
							map[string]any{
								"args": map[string]any{},
								"kind": "http",
								"method": "POST",
								"orig": "/dataset-fill",
								"parts": []any{
									"dataset-fill",
								},
								"select": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"model_info": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "code",
						"short": "Model code (Settings tab, ID section).",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "created_at",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "dataset_code",
						"short": "Code of the dataset the model is trained on.",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "model_name",
						"short": "Model type name, e.g.",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "name",
						"short": "User-given model name.",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "properties",
						"short": "Full model configuration and structured metadata (excluding bulky training artifacts); shape differs by model type (RFM, CLV, ABC, ...).",
						"type": "`$OBJECT`",
					},
					map[string]any{
						"name": "updated_at",
						"type": "`$STRING`",
					},
				},
				"name": "model_info",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"kind": "param",
											"name": "model_code",
											"orig": "model_code",
											"reqd": true,
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "GET",
								"orig": "/model/fetch-model-info/{model_code}",
								"parts": []any{
									"model",
									"fetch-model-info",
									"{model_code}",
								},
								"select": map[string]any{
									"exist": []any{
										"model_code",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{
						[]any{
							"fetch_model_info",
						},
					},
				},
			},
			"model_result": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "data",
						"type": "`$ARRAY`",
					},
					map[string]any{
						"name": "page",
						"short": "Page number for paginated results.",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "pagesize",
						"short": "Rows per page.",
						"type": "`$INTEGER`",
					},
				},
				"name": "model_result",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"kind": "param",
											"name": "model_code",
											"orig": "model_code",
											"reqd": true,
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "POST",
								"orig": "/model/fetch-result/{model_code}",
								"parts": []any{
									"model",
									"fetch-result",
									"{model_code}",
								},
								"select": map[string]any{
									"exist": []any{
										"model_code",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{
						[]any{
							"fetch_result",
						},
					},
				},
			},
			"prediction": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "columns",
						"short": "Column names associated with each prediction row.",
						"type": "`$ARRAY`",
					},
					map[string]any{
						"name": "data",
						"op": map[string]any{
							"create": map[string]any{
								"req": true,
								"type": "`$OBJECT`",
							},
						},
						"type": "`$ARRAY`",
					},
				},
				"name": "prediction",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"kind": "param",
											"name": "model_code",
											"orig": "model_code",
											"reqd": true,
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "POST",
								"orig": "/v1/prediction/model/{model_code}",
								"parts": []any{
									"v1",
									"prediction",
									"model",
									"{model_code}",
								},
								"select": map[string]any{
									"exist": []any{
										"model_code",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
							},
							map[string]any{
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"kind": "param",
											"name": "model_code",
											"orig": "model_code",
											"reqd": true,
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "POST",
								"orig": "/v2/prediction/model/{model_code}",
								"parts": []any{
									"v2",
									"prediction",
									"model",
									"{model_code}",
								},
								"select": map[string]any{
									"exist": []any{
										"model_code",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{
						[]any{
							"model",
						},
					},
				},
			},
		},
	}
}

var (
	sharedConfigOnce sync.Once
	sharedConfigVal  map[string]any
)

// SharedConfig returns the process-wide config, built once on first use.
// The SDK reads the config on every request and never writes to it, so one
// instance is shared by every client rather than rebuilt per client.
//
// The returned map is shared: treat it as read-only. Callers that need to
// mutate should use MakeConfig, which always returns a fresh copy.
func SharedConfig() map[string]any {
	sharedConfigOnce.Do(func() {
		sharedConfigVal = MakeConfig()
	})
	return sharedConfigVal
}

func makeFeature(name string) Feature {
	switch name {
	case "test":
		if NewTestFeatureFunc != nil {
			return NewTestFeatureFunc()
		}
	default:
		if NewBaseFeatureFunc != nil {
			return NewBaseFeatureFunc()
		}
	}
	return nil
}
