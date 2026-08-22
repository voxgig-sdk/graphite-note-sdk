# GraphiteNote Lua SDK Reference

Complete API reference for the GraphiteNote Lua SDK.


## GraphiteNoteSDK

### Constructor

```lua
local sdk = require("graphite-note_sdk")
local client = sdk.new(options)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `table` | SDK configuration options. |
| `options.apikey` | `string` | API key for authentication. |
| `options.base` | `string` | Base URL for API requests. |
| `options.prefix` | `string` | URL prefix appended after base. |
| `options.suffix` | `string` | URL suffix appended after path. |
| `options.headers` | `table` | Custom headers for all requests. |
| `options.feature` | `table` | Feature configuration. |
| `options.system` | `table` | System overrides (e.g. custom fetch). |


### Static Methods

#### `sdk.test(testopts?, sdkopts?)`

Create a test client with mock features active. Both arguments are optional.

```lua
local client = sdk.test()
```


### Instance Methods

#### `Dataset(data)`

Create a new `Dataset` entity instance. Pass `nil` for no initial data.

#### `DatasetFill(data)`

Create a new `DatasetFill` entity instance. Pass `nil` for no initial data.

#### `ModelInfo(data)`

Create a new `ModelInfo` entity instance. Pass `nil` for no initial data.

#### `ModelResult(data)`

Create a new `ModelResult` entity instance. Pass `nil` for no initial data.

#### `Prediction(data)`

Create a new `Prediction` entity instance. Pass `nil` for no initial data.

#### `options_map() -> table`

Return a deep copy of the current SDK options.

#### `get_utility() -> Utility`

Return a copy of the SDK utility object.

#### `direct(fetchargs) -> table, err`

Make a direct HTTP request to any API endpoint.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs.path` | `string` | URL path with optional `{param}` placeholders. |
| `fetchargs.method` | `string` | HTTP method (default: `"GET"`). |
| `fetchargs.params` | `table` | Path parameter values for `{param}` substitution. |
| `fetchargs.query` | `table` | Query string parameters. |
| `fetchargs.headers` | `table` | Request headers (merged with defaults). |
| `fetchargs.body` | `any` | Request body (tables are JSON-serialized). |
| `fetchargs.ctrl` | `table` | Control options (e.g. `{ explain = true }`). |

**Returns:** `table, err`

#### `prepare(fetchargs) -> table, err`

Prepare a fetch definition without sending the request. Accepts the
same parameters as `direct()`.

**Returns:** `table, err`


---

## DatasetEntity

```lua
local dataset = client:Dataset(nil)
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `columns` | `number` | No | Number of columns created. |
| `datasetcode` | `string` | No | Unique code assigned to the created dataset. |
| `name` | `string` | Yes | Human-readable dataset name. |
| `tablename` | `string` | No | Backing table name, e.g. |
| `usercode` | `string` | Yes | Unique code identifying the user. |

### Field Usage by Operation

| Field | create |
| --- | --- |
| `columns` | Yes |
| `datasetcode` | - |
| `name` | - |
| `tablename` | - |
| `usercode` | - |

### Operations

#### `create(reqdata, ctrl) -> any, err`

Create a new entity with the given data.

```lua
local result, err = client:Dataset():create({
  name = --[[ string ]],
  usercode = --[[ string ]],
})
```

### Common Methods

#### `data_get() -> table`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> table`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `DatasetEntity` instance with the same client and
options.

#### `get_name() -> string`

Return the entity name.


---

## DatasetFillEntity

```lua
local dataset_fill = client:DatasetFill(nil)
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `append` | `boolean` | Yes | True to append to existing rows; false to truncate the dataset first. |
| `columns` | `table` | Yes |  |
| `compressed` | `boolean` | Yes | True when insert-data is gzip+base64; false when it is a JSON-escaped string. |
| `datasetcode` | `string` | Yes |  |
| `details` | `table` | No |  |
| `insertdata` | `string` | Yes | The rows to insert, as a STRING: a JSON-escaped array-of-arrays when compressed is false, or gzipped-then-base64 when compressed is true. |
| `status` | `string` | No | 'success' on success. |
| `usercode` | `string` | Yes |  |

### Operations

#### `create(reqdata, ctrl) -> any, err`

Create a new entity with the given data.

```lua
local result, err = client:DatasetFill():create({
  append = --[[ boolean ]],
  columns = --[[ table ]],
  compressed = --[[ boolean ]],
  datasetcode = --[[ string ]],
  insertdata = --[[ string ]],
  usercode = --[[ string ]],
})
```

### Common Methods

#### `data_get() -> table`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> table`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `DatasetFillEntity` instance with the same client and
options.

#### `get_name() -> string`

Return the entity name.


---

## ModelInfoEntity

```lua
local model_info = client:ModelInfo(nil)
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | `string` | No | Model code (Settings tab, ID section). |
| `created_at` | `string` | No |  |
| `dataset_code` | `string` | No | Code of the dataset the model is trained on. |
| `model_name` | `string` | No | Model type name, e.g. |
| `name` | `string` | No | User-given model name. |
| `properties` | `table` | No | Full model configuration and structured metadata (excluding bulky training artifacts); shape differs by model type (RFM, CLV, ABC, ...). |
| `updated_at` | `string` | No |  |

### Operations

#### `load(reqmatch, ctrl) -> any, err`

Load a single entity matching the given criteria.

```lua
local result, err = client:ModelInfo():load({ model_code = "model_code" })
```

### Common Methods

#### `data_get() -> table`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> table`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `ModelInfoEntity` instance with the same client and
options.

#### `get_name() -> string`

Return the entity name.


---

## ModelResultEntity

```lua
local model_result = client:ModelResult(nil)
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | `table` | No |  |
| `page` | `number` | No | Page number for paginated results. |
| `pagesize` | `number` | No | Rows per page. |

### Operations

#### `create(reqdata, ctrl) -> any, err`

Create a new entity with the given data.

```lua
local result, err = client:ModelResult():create({
  model_code = --[[ string ]],
})
```

### Common Methods

#### `data_get() -> table`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> table`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `ModelResultEntity` instance with the same client and
options.

#### `get_name() -> string`

Return the entity name.


---

## PredictionEntity

```lua
local prediction = client:Prediction(nil)
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `columns` | `table` | No | Column names associated with each prediction row. |
| `data` | `table` | No |  |

### Field Usage by Operation

| Field | create |
| --- | --- |
| `columns` | - |
| `data` | Yes |

### Operations

#### `create(reqdata, ctrl) -> any, err`

Create a new entity with the given data.

```lua
local result, err = client:Prediction():create({
  model_code = --[[ string ]],
})
```

### Common Methods

#### `data_get() -> table`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> table`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `PredictionEntity` instance with the same client and
options.

#### `get_name() -> string`

Return the entity name.


---

## Features

| Feature | Version | Description |
| --- | --- | --- |
| `test` | 0.0.1 | In-memory mock transport for testing without a live server |


Features are activated via the `feature` option:

```lua
local client = sdk.new({
  feature = {
    test = { active = true },
  },
})
```

