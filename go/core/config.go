package core

func MakeConfig() map[string]any {
	return map[string]any{
		"main": map[string]any{
			"name": "GraphiteNote",
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
						"active": true,
						"name": "column",
						"op": map[string]any{
							"create": map[string]any{
								"req": true,
								"type": "`$ARRAY`",
							},
						},
						"req": false,
						"type": "`$INTEGER`",
						"index$": 0,
					},
					map[string]any{
						"active": true,
						"name": "dataset_code",
						"req": false,
						"type": "`$STRING`",
						"index$": 1,
					},
					map[string]any{
						"active": true,
						"name": "name",
						"req": true,
						"type": "`$STRING`",
						"index$": 2,
					},
					map[string]any{
						"active": true,
						"name": "table_name",
						"req": false,
						"type": "`$STRING`",
						"index$": 3,
					},
					map[string]any{
						"active": true,
						"name": "user_code",
						"req": true,
						"type": "`$STRING`",
						"index$": 4,
					},
				},
				"name": "dataset",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"active": true,
								"args": map[string]any{},
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
								"index$": 0,
							},
						},
						"key$": "create",
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"dataset_fill": map[string]any{
				"fields": []any{
					map[string]any{
						"active": true,
						"name": "append",
						"req": true,
						"type": "`$BOOLEAN`",
						"index$": 0,
					},
					map[string]any{
						"active": true,
						"name": "column",
						"req": true,
						"type": "`$ARRAY`",
						"index$": 1,
					},
					map[string]any{
						"active": true,
						"name": "compressed",
						"req": true,
						"type": "`$BOOLEAN`",
						"index$": 2,
					},
					map[string]any{
						"active": true,
						"name": "dataset_code",
						"req": true,
						"type": "`$STRING`",
						"index$": 3,
					},
					map[string]any{
						"active": true,
						"name": "detail",
						"req": false,
						"type": "`$OBJECT`",
						"index$": 4,
					},
					map[string]any{
						"active": true,
						"name": "insert_data",
						"req": true,
						"type": "`$STRING`",
						"index$": 5,
					},
					map[string]any{
						"active": true,
						"name": "status",
						"req": false,
						"type": "`$STRING`",
						"index$": 6,
					},
					map[string]any{
						"active": true,
						"name": "user_code",
						"req": true,
						"type": "`$STRING`",
						"index$": 7,
					},
				},
				"name": "dataset_fill",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"active": true,
								"args": map[string]any{},
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
								"index$": 0,
							},
							map[string]any{
								"active": true,
								"args": map[string]any{},
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
								"index$": 1,
							},
						},
						"key$": "create",
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"model_info": map[string]any{
				"fields": []any{
					map[string]any{
						"active": true,
						"name": "code",
						"req": false,
						"type": "`$STRING`",
						"index$": 0,
					},
					map[string]any{
						"active": true,
						"name": "created_at",
						"req": false,
						"type": "`$STRING`",
						"index$": 1,
					},
					map[string]any{
						"active": true,
						"name": "dataset_code",
						"req": false,
						"type": "`$STRING`",
						"index$": 2,
					},
					map[string]any{
						"active": true,
						"name": "model_name",
						"req": false,
						"type": "`$STRING`",
						"index$": 3,
					},
					map[string]any{
						"active": true,
						"name": "name",
						"req": false,
						"type": "`$STRING`",
						"index$": 4,
					},
					map[string]any{
						"active": true,
						"name": "property",
						"req": false,
						"type": "`$OBJECT`",
						"index$": 5,
					},
					map[string]any{
						"active": true,
						"name": "updated_at",
						"req": false,
						"type": "`$STRING`",
						"index$": 6,
					},
				},
				"name": "model_info",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"active": true,
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"active": true,
											"kind": "param",
											"name": "model_code",
											"orig": "model_code",
											"reqd": true,
											"type": "`$STRING`",
											"index$": 0,
										},
									},
								},
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
								"index$": 0,
							},
						},
						"key$": "load",
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
						"active": true,
						"name": "data",
						"req": false,
						"type": "`$ARRAY`",
						"index$": 0,
					},
					map[string]any{
						"active": true,
						"name": "page",
						"req": false,
						"type": "`$INTEGER`",
						"index$": 1,
					},
					map[string]any{
						"active": true,
						"name": "page_size",
						"req": false,
						"type": "`$INTEGER`",
						"index$": 2,
					},
				},
				"name": "model_result",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"active": true,
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"active": true,
											"kind": "param",
											"name": "model_code",
											"orig": "model_code",
											"reqd": true,
											"type": "`$STRING`",
											"index$": 0,
										},
									},
								},
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
								"index$": 0,
							},
						},
						"key$": "create",
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
						"active": true,
						"name": "column",
						"req": false,
						"type": "`$ARRAY`",
						"index$": 0,
					},
					map[string]any{
						"active": true,
						"name": "data",
						"op": map[string]any{
							"create": map[string]any{
								"req": true,
								"type": "`$OBJECT`",
							},
						},
						"req": false,
						"type": "`$ARRAY`",
						"index$": 1,
					},
				},
				"name": "prediction",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"active": true,
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"active": true,
											"kind": "param",
											"name": "model_code",
											"orig": "model_code",
											"reqd": true,
											"type": "`$STRING`",
											"index$": 0,
										},
									},
								},
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
								"index$": 0,
							},
							map[string]any{
								"active": true,
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"active": true,
											"kind": "param",
											"name": "model_code",
											"orig": "model_code",
											"reqd": true,
											"type": "`$STRING`",
											"index$": 0,
										},
									},
								},
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
								"index$": 1,
							},
						},
						"key$": "create",
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
