# GraphiteNote Golang SDK Reference

Complete API reference for the GraphiteNote Golang SDK.


## GraphiteNoteSDK

### Constructor

```go
func NewGraphiteNoteSDK(options map[string]any) *GraphiteNoteSDK
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `map[string]any` | SDK configuration options. |
| `options["apikey"]` | `string` | API key for authentication. |
| `options["base"]` | `string` | Base URL for API requests. |
| `options["prefix"]` | `string` | URL prefix appended after base. |
| `options["suffix"]` | `string` | URL suffix appended after path. |
| `options["headers"]` | `map[string]any` | Custom headers for all requests. |
| `options["feature"]` | `map[string]any` | Feature configuration. |
| `options["system"]` | `map[string]any` | System overrides (e.g. custom fetch). |


### Static Methods

#### `Test() *GraphiteNoteSDK`

No-arg convenience constructor for the common no-options test case.

```go
client := sdk.Test()
```

#### `TestSDK(testopts, sdkopts map[string]any) *GraphiteNoteSDK`

Test client with options. Both arguments may be `nil`.

```go
client := sdk.TestSDK(testopts, sdkopts)
```


### Instance Methods

#### `Dataset(data map[string]any) GraphiteNoteEntity`

Create a new `Dataset` entity instance. Pass `nil` for no initial data.

#### `DatasetFill(data map[string]any) GraphiteNoteEntity`

Create a new `DatasetFill` entity instance. Pass `nil` for no initial data.

#### `ModelInfo(data map[string]any) GraphiteNoteEntity`

Create a new `ModelInfo` entity instance. Pass `nil` for no initial data.

#### `ModelResult(data map[string]any) GraphiteNoteEntity`

Create a new `ModelResult` entity instance. Pass `nil` for no initial data.

#### `Prediction(data map[string]any) GraphiteNoteEntity`

Create a new `Prediction` entity instance. Pass `nil` for no initial data.

#### `OptionsMap() map[string]any`

Return a deep copy of the current SDK options.

#### `GetUtility() *Utility`

Return a copy of the SDK utility object.

#### `Direct(fetchargs map[string]any) (map[string]any, error)`

Make a direct HTTP request to any API endpoint.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs["path"]` | `string` | URL path with optional `{param}` placeholders. |
| `fetchargs["method"]` | `string` | HTTP method (default: `"GET"`). |
| `fetchargs["params"]` | `map[string]any` | Path parameter values for `{param}` substitution. |
| `fetchargs["query"]` | `map[string]any` | Query string parameters. |
| `fetchargs["headers"]` | `map[string]any` | Request headers (merged with defaults). |
| `fetchargs["body"]` | `any` | Request body (maps are JSON-serialized). |
| `fetchargs["ctrl"]` | `map[string]any` | Control options (e.g. `map[string]any{"explain": true}`). |

**Returns:** `(map[string]any, error)`

#### `Prepare(fetchargs map[string]any) (map[string]any, error)`

Prepare a fetch definition without sending the request. Accepts the
same parameters as `Direct()`.

**Returns:** `(map[string]any, error)`


---

## DatasetEntity

```go
dataset := client.Dataset(nil)
fmt.Println(dataset.GetName()) // "dataset"
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `column` | `int` | No |  |
| `dataset_code` | `string` | No |  |
| `name` | `string` | Yes |  |
| `table_name` | `string` | No |  |
| `user_code` | `string` | Yes |  |

### Field Usage by Operation

| Field | create |
| --- | --- |
| `column` | Yes |
| `dataset_code` | - |
| `name` | - |
| `table_name` | - |
| `user_code` | - |

### Operations

#### `Create(reqdata, ctrl map[string]any) (any, error)`

Create a new entity with the given data.

```go
result, err := client.Dataset(nil).Create(map[string]any{
    "name": "example_name",
    "user_code": "example_user_code",
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### Common Methods

#### `Data(args ...any) any`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `Match(args ...any) any`

Get or set the entity match criteria. Works the same as `Data()`.

#### `Make() Entity`

Create a new `DatasetEntity` instance with the same client and
options.

#### `GetName() string`

Return the entity name.


---

## DatasetFillEntity

```go
datasetFill := client.DatasetFill(nil)
fmt.Println(datasetFill.GetName()) // "dataset_fill"
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `append` | `bool` | Yes |  |
| `column` | `[]any` | Yes |  |
| `compressed` | `bool` | Yes |  |
| `dataset_code` | `string` | Yes |  |
| `detail` | `map[string]any` | No |  |
| `insert_data` | `string` | Yes |  |
| `status` | `string` | No |  |
| `user_code` | `string` | Yes |  |

### Operations

#### `Create(reqdata, ctrl map[string]any) (any, error)`

Create a new entity with the given data.

```go
result, err := client.DatasetFill(nil).Create(map[string]any{
    "append": true,
    "column": []any{},
    "compressed": true,
    "dataset_code": "example_dataset_code",
    "insert_data": "example_insert_data",
    "user_code": "example_user_code",
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### Common Methods

#### `Data(args ...any) any`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `Match(args ...any) any`

Get or set the entity match criteria. Works the same as `Data()`.

#### `Make() Entity`

Create a new `DatasetFillEntity` instance with the same client and
options.

#### `GetName() string`

Return the entity name.


---

## ModelInfoEntity

```go
modelInfo := client.ModelInfo(nil)
fmt.Println(modelInfo.GetName()) // "model_info"
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | `string` | No |  |
| `created_at` | `string` | No |  |
| `dataset_code` | `string` | No |  |
| `model_name` | `string` | No |  |
| `name` | `string` | No |  |
| `property` | `map[string]any` | No |  |
| `updated_at` | `string` | No |  |

### Operations

#### `Load(reqmatch, ctrl map[string]any) (any, error)`

Load a single entity matching the given criteria.

```go
result, err := client.ModelInfo(nil).Load(map[string]any{"model_code": "model_code"}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### Common Methods

#### `Data(args ...any) any`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `Match(args ...any) any`

Get or set the entity match criteria. Works the same as `Data()`.

#### `Make() Entity`

Create a new `ModelInfoEntity` instance with the same client and
options.

#### `GetName() string`

Return the entity name.


---

## ModelResultEntity

```go
modelResult := client.ModelResult(nil)
fmt.Println(modelResult.GetName()) // "model_result"
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | `[]any` | No |  |
| `page` | `int` | No |  |
| `page_size` | `int` | No |  |

### Operations

#### `Create(reqdata, ctrl map[string]any) (any, error)`

Create a new entity with the given data.

```go
result, err := client.ModelResult(nil).Create(map[string]any{
    "model_code": "example_model_code",
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### Common Methods

#### `Data(args ...any) any`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `Match(args ...any) any`

Get or set the entity match criteria. Works the same as `Data()`.

#### `Make() Entity`

Create a new `ModelResultEntity` instance with the same client and
options.

#### `GetName() string`

Return the entity name.


---

## PredictionEntity

```go
prediction := client.Prediction(nil)
fmt.Println(prediction.GetName()) // "prediction"
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `column` | `[]any` | No |  |
| `data` | `[]any` | No |  |

### Field Usage by Operation

| Field | create |
| --- | --- |
| `column` | - |
| `data` | Yes |

### Operations

#### `Create(reqdata, ctrl map[string]any) (any, error)`

Create a new entity with the given data.

```go
result, err := client.Prediction(nil).Create(map[string]any{
    "model_code": "example_model_code",
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### Common Methods

#### `Data(args ...any) any`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `Match(args ...any) any`

Get or set the entity match criteria. Works the same as `Data()`.

#### `Make() Entity`

Create a new `PredictionEntity` instance with the same client and
options.

#### `GetName() string`

Return the entity name.


---

## Features

| Feature | Version | Description |
| --- | --- | --- |
| `test` | 0.0.1 | In-memory mock transport for testing without a live server |


Features are activated via the `feature` option:

```go
client := sdk.NewGraphiteNoteSDK(map[string]any{
    "feature": map[string]any{
        "test": map[string]any{"active": true},
    },
})
```

