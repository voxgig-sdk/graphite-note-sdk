# GraphiteNote Python SDK Reference

Complete API reference for the GraphiteNote Python SDK.


## GraphiteNoteSDK

### Constructor

```python
from graphitenote_sdk import GraphiteNoteSDK

client = GraphiteNoteSDK(options)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `dict` | SDK configuration options. |
| `options["apikey"]` | `str` | API key for authentication. |
| `options["base"]` | `str` | Base URL for API requests. |
| `options["prefix"]` | `str` | URL prefix appended after base. |
| `options["suffix"]` | `str` | URL suffix appended after path. |
| `options["headers"]` | `dict` | Custom headers for all requests. |
| `options["feature"]` | `dict` | Feature configuration. |
| `options["system"]` | `dict` | System overrides (e.g. custom fetch). |


### Static Methods

#### `GraphiteNoteSDK.test(testopts=None, sdkopts=None)`

Create a test client with mock features active. Both arguments may be `None`.

```python
client = GraphiteNoteSDK.test()
```


### Instance Methods

#### `Dataset(data=None)`

Create a new `DatasetEntity` instance. Pass `None` for no initial data.

#### `DatasetFill(data=None)`

Create a new `DatasetFillEntity` instance. Pass `None` for no initial data.

#### `ModelInfo(data=None)`

Create a new `ModelInfoEntity` instance. Pass `None` for no initial data.

#### `ModelResult(data=None)`

Create a new `ModelResultEntity` instance. Pass `None` for no initial data.

#### `Prediction(data=None)`

Create a new `PredictionEntity` instance. Pass `None` for no initial data.

#### `options_map() -> dict`

Return a deep copy of the current SDK options.

#### `get_utility() -> Utility`

Return a copy of the SDK utility object.

#### `direct(fetchargs=None) -> dict`

Make a direct HTTP request to any API endpoint. Returns a result `dict` with `ok`, `status`, `headers`, and `data` (or `err` on failure). This escape hatch never raises — branch on `result["ok"]`.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs["path"]` | `str` | URL path with optional `{param}` placeholders. |
| `fetchargs["method"]` | `str` | HTTP method (default: `"GET"`). |
| `fetchargs["params"]` | `dict` | Path parameter values. |
| `fetchargs["query"]` | `dict` | Query string parameters. |
| `fetchargs["headers"]` | `dict` | Request headers (merged with defaults). |
| `fetchargs["body"]` | `any` | Request body (dicts are JSON-serialized). |

**Returns:** `result_dict`

#### `prepare(fetchargs=None) -> dict`

Prepare a fetch definition without sending. Returns the `fetchdef` and raises on error.


---

## DatasetEntity

```python
dataset = client.Dataset()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `columns` | `int` | No | Number of columns created. |
| `datasetcode` | `str` | No | Unique code assigned to the created dataset. |
| `name` | `str` | Yes | Human-readable dataset name. |
| `tablename` | `str` | No | Backing table name, e.g. |
| `usercode` | `str` | Yes | Unique code identifying the user. |

### Field Usage by Operation

| Field | create |
| --- | --- |
| `columns` | Yes |
| `datasetcode` | - |
| `name` | - |
| `tablename` | - |
| `usercode` | - |

### Operations

#### `create(reqdata, ctrl=None) -> dict`

Create a new entity with the given data. Returns the created entity data and raises on error.

```python
result = client.Dataset().create({
    "name": "example_name",  # str
    "usercode": "example_usercode",  # str
})
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `DatasetEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## DatasetFillEntity

```python
dataset_fill = client.DatasetFill()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `append` | `bool` | Yes | True to append to existing rows; false to truncate the dataset first. |
| `columns` | `list` | Yes |  |
| `compressed` | `bool` | Yes | True when insert-data is gzip+base64; false when it is a JSON-escaped string. |
| `datasetcode` | `str` | Yes |  |
| `details` | `dict` | No |  |
| `insertdata` | `str` | Yes | The rows to insert, as a STRING: a JSON-escaped array-of-arrays when compressed is false, or gzipped-then-base64 when compressed is true. |
| `status` | `str` | No | 'success' on success. |
| `usercode` | `str` | Yes |  |

### Operations

#### `create(reqdata, ctrl=None) -> dict`

Create a new entity with the given data. Returns the created entity data and raises on error.

```python
result = client.DatasetFill().create({
    "append": True,  # bool
    "columns": [],  # list
    "compressed": True,  # bool
    "datasetcode": "example_datasetcode",  # str
    "insertdata": "example_insertdata",  # str
    "usercode": "example_usercode",  # str
})
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `DatasetFillEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## ModelInfoEntity

```python
model_info = client.ModelInfo()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | `str` | No | Model code (Settings tab, ID section). |
| `created_at` | `str` | No |  |
| `dataset_code` | `str` | No | Code of the dataset the model is trained on. |
| `model_name` | `str` | No | Model type name, e.g. |
| `name` | `str` | No | User-given model name. |
| `properties` | `dict` | No | Full model configuration and structured metadata (excluding bulky training artifacts); shape differs by model type (RFM, CLV, ABC, ...). |
| `updated_at` | `str` | No |  |

### Operations

#### `load(reqmatch, ctrl=None) -> dict`

Load a single entity matching the given criteria. Returns the entity data and raises on error.

```python
result = client.ModelInfo().load({"model_code": "model_code"})
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `ModelInfoEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## ModelResultEntity

```python
model_result = client.ModelResult()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | `list` | No |  |
| `page` | `int` | No | Page number for paginated results. |
| `pagesize` | `int` | No | Rows per page. |

### Operations

#### `create(reqdata, ctrl=None) -> dict`

Create a new entity with the given data. Returns the created entity data and raises on error.

```python
result = client.ModelResult().create({
    "model_code": "example_model_code",  # str
})
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `ModelResultEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## PredictionEntity

```python
prediction = client.Prediction()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `columns` | `list` | No | Column names associated with each prediction row. |
| `data` | `list` | No |  |

### Field Usage by Operation

| Field | create |
| --- | --- |
| `columns` | - |
| `data` | Yes |

### Operations

#### `create(reqdata, ctrl=None) -> dict`

Create a new entity with the given data. Returns the created entity data and raises on error.

```python
result = client.Prediction().create({
    "model_code": "example_model_code",  # str
})
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `PredictionEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## Features

| Feature | Version | Description |
| --- | --- | --- |
| `test` | 0.0.1 | In-memory mock transport for testing without a live server |


Features are activated via the `feature` option:

```python
client = GraphiteNoteSDK({
    "feature": {
        "test": {"active": True},
    },
})
```

