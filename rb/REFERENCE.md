# GraphiteNote Ruby SDK Reference

Complete API reference for the GraphiteNote Ruby SDK.


## GraphiteNoteSDK

### Constructor

```ruby
require_relative 'GraphiteNote_sdk'

client = GraphiteNoteSDK.new(options)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `Hash` | SDK configuration options. |
| `options["apikey"]` | `String` | API key for authentication. |
| `options["base"]` | `String` | Base URL for API requests. |
| `options["prefix"]` | `String` | URL prefix appended after base. |
| `options["suffix"]` | `String` | URL suffix appended after path. |
| `options["headers"]` | `Hash` | Custom headers for all requests. |
| `options["feature"]` | `Hash` | Feature configuration. |
| `options["system"]` | `Hash` | System overrides (e.g. custom fetch). |


### Static Methods

#### `GraphiteNoteSDK.test(testopts = nil, sdkopts = nil)`

Create a test client with mock features active. Both arguments may be `nil`.

```ruby
client = GraphiteNoteSDK.test
```


### Instance Methods

#### `Dataset(data = nil)`

Create a new `Dataset` entity instance. Pass `nil` for no initial data.

#### `DatasetFill(data = nil)`

Create a new `DatasetFill` entity instance. Pass `nil` for no initial data.

#### `ModelInfo(data = nil)`

Create a new `ModelInfo` entity instance. Pass `nil` for no initial data.

#### `ModelResult(data = nil)`

Create a new `ModelResult` entity instance. Pass `nil` for no initial data.

#### `Prediction(data = nil)`

Create a new `Prediction` entity instance. Pass `nil` for no initial data.

#### `options_map -> Hash`

Return a deep copy of the current SDK options.

#### `get_utility -> Utility`

Return a copy of the SDK utility object.

#### `direct(fetchargs = {}) -> Hash`

Make a direct HTTP request to any API endpoint. Returns a result hash
(`{ "ok" => ..., "status" => ..., "data" => ..., "err" => ... }`); it
does not raise — inspect `result["ok"]`.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs["path"]` | `String` | URL path with optional `{param}` placeholders. |
| `fetchargs["method"]` | `String` | HTTP method (default: `"GET"`). |
| `fetchargs["params"]` | `Hash` | Path parameter values for `{param}` substitution. |
| `fetchargs["query"]` | `Hash` | Query string parameters. |
| `fetchargs["headers"]` | `Hash` | Request headers (merged with defaults). |
| `fetchargs["body"]` | `any` | Request body (hashes are JSON-serialized). |
| `fetchargs["ctrl"]` | `Hash` | Control options (e.g. `{ "explain" => true }`). |

**Returns:** `Hash`

#### `prepare(fetchargs = {}) -> Hash`

Prepare a fetch definition without sending the request. Accepts the
same parameters as `direct()`. Raises on error.

**Returns:** `Hash` (the fetch definition; raises on error)


---

## DatasetEntity

```ruby
dataset = client.Dataset
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `columns` | `Integer` | No | Number of columns created. |
| `datasetcode` | `String` | No | Unique code assigned to the created dataset. |
| `name` | `String` | Yes | Human-readable dataset name. |
| `tablename` | `String` | No | Backing table name, e.g. |
| `usercode` | `String` | Yes | Unique code identifying the user. |

### Field Usage by Operation

| Field | create |
| --- | --- |
| `columns` | Yes |
| `datasetcode` | - |
| `name` | - |
| `tablename` | - |
| `usercode` | - |

### Operations

#### `create(reqdata, ctrl = nil) -> result`

Create a new entity with the given data. Raises on error.

```ruby
result = client.Dataset.create({
  "name" => "example_name", # String
  "usercode" => "example_usercode", # String
})
```

### Common Methods

#### `data_get -> Hash`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get -> Hash`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make -> Entity`

Create a new `DatasetEntity` instance with the same client and
options.

#### `get_name -> String`

Return the entity name.


---

## DatasetFillEntity

```ruby
dataset_fill = client.DatasetFill
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `append` | `Boolean` | Yes | True to append to existing rows; false to truncate the dataset first. |
| `columns` | `Array` | Yes |  |
| `compressed` | `Boolean` | Yes | True when insert-data is gzip+base64; false when it is a JSON-escaped string. |
| `datasetcode` | `String` | Yes |  |
| `details` | `Hash` | No |  |
| `insertdata` | `String` | Yes | The rows to insert, as a STRING: a JSON-escaped array-of-arrays when compressed is false, or gzipped-then-base64 when compressed is true. |
| `status` | `String` | No | 'success' on success. |
| `usercode` | `String` | Yes |  |

### Operations

#### `create(reqdata, ctrl = nil) -> result`

Create a new entity with the given data. Raises on error.

```ruby
result = client.DatasetFill.create({
  "append" => true, # Boolean
  "columns" => [], # Array
  "compressed" => true, # Boolean
  "datasetcode" => "example_datasetcode", # String
  "insertdata" => "example_insertdata", # String
  "usercode" => "example_usercode", # String
})
```

### Common Methods

#### `data_get -> Hash`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get -> Hash`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make -> Entity`

Create a new `DatasetFillEntity` instance with the same client and
options.

#### `get_name -> String`

Return the entity name.


---

## ModelInfoEntity

```ruby
model_info = client.ModelInfo
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | `String` | No | Model code (Settings tab, ID section). |
| `created_at` | `String` | No |  |
| `dataset_code` | `String` | No | Code of the dataset the model is trained on. |
| `model_name` | `String` | No | Model type name, e.g. |
| `name` | `String` | No | User-given model name. |
| `properties` | `Hash` | No | Full model configuration and structured metadata (excluding bulky training artifacts); shape differs by model type (RFM, CLV, ABC, ...). |
| `updated_at` | `String` | No |  |

### Operations

#### `load(reqmatch, ctrl = nil) -> result`

Load a single entity matching the given criteria. Raises on error.

```ruby
result = client.ModelInfo.load({ "model_code" => "model_code" })
```

### Common Methods

#### `data_get -> Hash`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get -> Hash`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make -> Entity`

Create a new `ModelInfoEntity` instance with the same client and
options.

#### `get_name -> String`

Return the entity name.


---

## ModelResultEntity

```ruby
model_result = client.ModelResult
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | `Array` | No |  |
| `page` | `Integer` | No | Page number for paginated results. |
| `pagesize` | `Integer` | No | Rows per page. |

### Operations

#### `create(reqdata, ctrl = nil) -> result`

Create a new entity with the given data. Raises on error.

```ruby
result = client.ModelResult.create({
  "model_code" => "example_model_code", # String
})
```

### Common Methods

#### `data_get -> Hash`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get -> Hash`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make -> Entity`

Create a new `ModelResultEntity` instance with the same client and
options.

#### `get_name -> String`

Return the entity name.


---

## PredictionEntity

```ruby
prediction = client.Prediction
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `columns` | `Array` | No | Column names associated with each prediction row. |
| `data` | `Array` | No |  |

### Field Usage by Operation

| Field | create |
| --- | --- |
| `columns` | - |
| `data` | Yes |

### Operations

#### `create(reqdata, ctrl = nil) -> result`

Create a new entity with the given data. Raises on error.

```ruby
result = client.Prediction.create({
  "model_code" => "example_model_code", # String
})
```

### Common Methods

#### `data_get -> Hash`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get -> Hash`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make -> Entity`

Create a new `PredictionEntity` instance with the same client and
options.

#### `get_name -> String`

Return the entity name.


---

## Features

| Feature | Version | Description |
| --- | --- | --- |
| `test` | 0.0.1 | In-memory mock transport for testing without a live server |


Features are activated via the `feature` option:

```ruby
client = GraphiteNoteSDK.new({
  "feature" => {
    "test" => { "active" => true },
  },
})
```

