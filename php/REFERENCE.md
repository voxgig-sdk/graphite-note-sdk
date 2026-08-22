# GraphiteNote PHP SDK Reference

Complete API reference for the GraphiteNote PHP SDK.


## GraphiteNoteSDK

### Constructor

```php
require_once __DIR__ . '/graphitenote_sdk.php';

$client = new GraphiteNoteSDK($options);
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `$options` | `array` | SDK configuration options. |
| `$options["apikey"]` | `string` | API key for authentication. |
| `$options["base"]` | `string` | Base URL for API requests. |
| `$options["prefix"]` | `string` | URL prefix appended after base. |
| `$options["suffix"]` | `string` | URL suffix appended after path. |
| `$options["headers"]` | `array` | Custom headers for all requests. |
| `$options["feature"]` | `array` | Feature configuration. |
| `$options["system"]` | `array` | System overrides (e.g. custom fetch). |


### Static Methods

#### `GraphiteNoteSDK::test($testopts = null, $sdkopts = null)`

Create a test client with mock features active. Both arguments may be `null`.

```php
$client = GraphiteNoteSDK::test();
```


### Instance Methods

#### `Dataset($data = null)`

Create a new `DatasetEntity` instance. Pass `null` for no initial data.

#### `DatasetFill($data = null)`

Create a new `DatasetFillEntity` instance. Pass `null` for no initial data.

#### `ModelInfo($data = null)`

Create a new `ModelInfoEntity` instance. Pass `null` for no initial data.

#### `ModelResult($data = null)`

Create a new `ModelResultEntity` instance. Pass `null` for no initial data.

#### `Prediction($data = null)`

Create a new `PredictionEntity` instance. Pass `null` for no initial data.

#### `options_map(): array`

Return a deep copy of the current SDK options.

#### `get_utility(): GraphiteNoteUtility`

Return a copy of the SDK utility object.

#### `direct(array $fetchargs = []): array`

Make a direct HTTP request to any API endpoint. This is the raw-HTTP escape
hatch: it does **not** throw. It returns a result array
`["ok" => bool, "status" => int, "headers" => array, "data" => mixed]`, or
`["ok" => false, "err" => \Exception]` on failure. Branch on `$result["ok"]`.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `$fetchargs["path"]` | `string` | URL path with optional `{param}` placeholders. |
| `$fetchargs["method"]` | `string` | HTTP method (default: `"GET"`). |
| `$fetchargs["params"]` | `array` | Path parameter values for `{param}` substitution. |
| `$fetchargs["query"]` | `array` | Query string parameters. |
| `$fetchargs["headers"]` | `array` | Request headers (merged with defaults). |
| `$fetchargs["body"]` | `mixed` | Request body (arrays are JSON-serialized). |
| `$fetchargs["ctrl"]` | `array` | Control options. |

**Returns:** `array` — the result dict (see above); never throws.

#### `prepare(array $fetchargs = []): mixed`

Prepare a fetch definition without sending the request. Returns the
`$fetchdef` array. Throws on error.


---

## DatasetEntity

```php
$dataset = $client->Dataset();
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `columns` | `int` | No | Number of columns created. |
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

#### `create(array $reqdata, ?array $ctrl = null): mixed`

Create a new entity with the given data. Throws on error.

```php
$result = $client->Dataset()->create([
  "name" => null, // string
  "usercode" => null, // string
]);
```

### Common Methods

#### `data_get(): array`

Get the entity data. Returns a copy of the current data.

#### `data_set($data): void`

Set the entity data.

#### `match_get(): array`

Get the entity match criteria.

#### `match_set($match): void`

Set the entity match criteria.

#### `make(): DatasetEntity`

Create a new `DatasetEntity` instance with the same client and
options.

#### `get_name(): string`

Return the entity name.


---

## DatasetFillEntity

```php
$dataset_fill = $client->DatasetFill();
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `append` | `bool` | Yes | True to append to existing rows; false to truncate the dataset first. |
| `columns` | `array` | Yes |  |
| `compressed` | `bool` | Yes | True when insert-data is gzip+base64; false when it is a JSON-escaped string. |
| `datasetcode` | `string` | Yes |  |
| `details` | `array` | No |  |
| `insertdata` | `string` | Yes | The rows to insert, as a STRING: a JSON-escaped array-of-arrays when compressed is false, or gzipped-then-base64 when compressed is true. |
| `status` | `string` | No | 'success' on success. |
| `usercode` | `string` | Yes |  |

### Operations

#### `create(array $reqdata, ?array $ctrl = null): mixed`

Create a new entity with the given data. Throws on error.

```php
$result = $client->DatasetFill()->create([
  "append" => null, // bool
  "columns" => null, // array
  "compressed" => null, // bool
  "datasetcode" => null, // string
  "insertdata" => null, // string
  "usercode" => null, // string
]);
```

### Common Methods

#### `data_get(): array`

Get the entity data. Returns a copy of the current data.

#### `data_set($data): void`

Set the entity data.

#### `match_get(): array`

Get the entity match criteria.

#### `match_set($match): void`

Set the entity match criteria.

#### `make(): DatasetFillEntity`

Create a new `DatasetFillEntity` instance with the same client and
options.

#### `get_name(): string`

Return the entity name.


---

## ModelInfoEntity

```php
$model_info = $client->ModelInfo();
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | `string` | No | Model code (Settings tab, ID section). |
| `created_at` | `string` | No |  |
| `dataset_code` | `string` | No | Code of the dataset the model is trained on. |
| `model_name` | `string` | No | Model type name, e.g. |
| `name` | `string` | No | User-given model name. |
| `properties` | `array` | No | Full model configuration and structured metadata (excluding bulky training artifacts); shape differs by model type (RFM, CLV, ABC, ...). |
| `updated_at` | `string` | No |  |

### Operations

#### `load(array $reqmatch, ?array $ctrl = null): mixed`

Load a single entity matching the given criteria. Throws on error.

```php
$result = $client->ModelInfo()->load(["model_code" => "model_code"]);
```

### Common Methods

#### `data_get(): array`

Get the entity data. Returns a copy of the current data.

#### `data_set($data): void`

Set the entity data.

#### `match_get(): array`

Get the entity match criteria.

#### `match_set($match): void`

Set the entity match criteria.

#### `make(): ModelInfoEntity`

Create a new `ModelInfoEntity` instance with the same client and
options.

#### `get_name(): string`

Return the entity name.


---

## ModelResultEntity

```php
$model_result = $client->ModelResult();
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | `array` | No |  |
| `page` | `int` | No | Page number for paginated results. |
| `pagesize` | `int` | No | Rows per page. |

### Operations

#### `create(array $reqdata, ?array $ctrl = null): mixed`

Create a new entity with the given data. Throws on error.

```php
$result = $client->ModelResult()->create([
  "model_code" => null, // string
]);
```

### Common Methods

#### `data_get(): array`

Get the entity data. Returns a copy of the current data.

#### `data_set($data): void`

Set the entity data.

#### `match_get(): array`

Get the entity match criteria.

#### `match_set($match): void`

Set the entity match criteria.

#### `make(): ModelResultEntity`

Create a new `ModelResultEntity` instance with the same client and
options.

#### `get_name(): string`

Return the entity name.


---

## PredictionEntity

```php
$prediction = $client->Prediction();
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `columns` | `array` | No | Column names associated with each prediction row. |
| `data` | `array` | No |  |

### Field Usage by Operation

| Field | create |
| --- | --- |
| `columns` | - |
| `data` | Yes |

### Operations

#### `create(array $reqdata, ?array $ctrl = null): mixed`

Create a new entity with the given data. Throws on error.

```php
$result = $client->Prediction()->create([
  "model_code" => null, // string
]);
```

### Common Methods

#### `data_get(): array`

Get the entity data. Returns a copy of the current data.

#### `data_set($data): void`

Set the entity data.

#### `match_get(): array`

Get the entity match criteria.

#### `match_set($match): void`

Set the entity match criteria.

#### `make(): PredictionEntity`

Create a new `PredictionEntity` instance with the same client and
options.

#### `get_name(): string`

Return the entity name.


---

## Features

| Feature | Version | Description |
| --- | --- | --- |
| `test` | 0.0.1 | In-memory mock transport for testing without a live server |


Features are activated via the `feature` option:

```php
$client = new GraphiteNoteSDK([
  "feature" => [
    "test" => ["active" => true],
  ],
]);
```

