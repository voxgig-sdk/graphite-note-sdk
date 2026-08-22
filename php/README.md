# GraphiteNote PHP SDK



The PHP SDK for the GraphiteNote API — an entity-oriented client using PHP conventions.

The SDK exposes the API as capitalised, semantic **Entities** — for example `$client->Dataset()` — with named operations (`load`/`create`) instead of raw URL paths and query strings. Working with resources and verbs keeps call sites self-describing and reduces cognitive load.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to Packagist. Install it from the
GitHub release tag (`php/vX.Y.Z`):

- Releases: [https://github.com/voxgig-sdk/graphite-note-sdk/releases](https://github.com/voxgig-sdk/graphite-note-sdk/releases)


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```php
<?php
require_once 'graphitenote_sdk.php';

$client = new GraphiteNoteSDK([
    "apikey" => getenv("GRAPHITE_NOTE_APIKEY"),
]);
```

### 3. Load a modelinfo

ModelInfo is nested under model_code, so provide the `model_code`.

```php
try {
    // load() returns the ENTITY — call data_get() for the ModelInfo record (throws on error).
    $modelinfo = $client->ModelInfo()->load(["model_code" => "example_model_code"]);
    print_r($modelinfo);
} catch (\Throwable $err) {
    echo "Error: " . $err->getMessage();
}
```

### 4. Create, update, and remove

```php
// create() returns the ENTITY — call data_get() for the created Dataset record.
$created = $client->Dataset()->create(["name" => "example_name", "usercode" => "example_usercode"]);

```


## Error handling

Entity operations throw a `\Throwable` on failure, so wrap them in
`try` / `catch`:

```php
try {
    $modelinfo = $client->ModelInfo()->load(["model_code" => "example"]);
} catch (\Throwable $err) {
    echo "Error: " . $err->getMessage();
}
```

`direct()` does **not** throw — it returns the result array. Branch on
`ok`; on failure `status` holds the HTTP status (for error responses) and
`err` holds a transport error, so read both defensively:

```php
$result = $client->direct([
    "path" => "/api/resource/{id}",
    "method" => "GET",
    "params" => ["id" => "example_id"],
]);

if (! $result["ok"]) {
    $err = $result["err"] ?? null;
    echo "request failed: " . ($err ? $err->getMessage() : "HTTP " . $result["status"]);
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```php
// direct() is the raw-HTTP escape hatch: it returns a result array
// (it does not throw). Branch on $result["ok"].
$result = $client->direct([
    "path" => "/api/resource/{id}",
    "method" => "GET",
    "params" => ["id" => "example"],
]);

if ($result["ok"]) {
    echo $result["status"];  // 200
    print_r($result["data"]);  // response body
} else {
    // On an HTTP error status there is no err (only a transport failure sets
    // it), so fall back to the status code.
    $err = $result["err"] ?? null;
    echo "Error: " . ($err ? $err->getMessage() : "HTTP " . $result["status"]);
}
```

### Prepare a request without sending it

```php
// prepare() throws on error and returns the fetch definition.
$fetchdef = $client->prepare([
    "path" => "/api/resource/{id}",
    "method" => "DELETE",
    "params" => ["id" => "example"],
]);

echo $fetchdef["url"];
echo $fetchdef["method"];
print_r($fetchdef["headers"]);
```

### Use test mode

Create a mock client for unit testing — no server required:

```php
$client = GraphiteNoteSDK::test();

// Entity ops return the ENTITY (throws on error);
// call data_get() for the mock record.
$modelinfo = $client->ModelInfo()->load(["model_code" => "example"]);
print_r($modelinfo);
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```php
$mock_fetch = function ($url, $init) {
    return [
        [
            "status" => 200,
            "statusText" => "OK",
            "headers" => [],
            "json" => function () { return ["id" => "mock01"]; },
        ],
        null,
    ];
};

$client = new GraphiteNoteSDK([
    "base" => "http://localhost:8080",
    "system" => [
        "fetch" => $mock_fetch,
    ],
]);
```

### Run live tests

Create a `.env.local` file at the project root:

```
GRAPHITE_NOTE_TEST_LIVE=TRUE
GRAPHITE_NOTE_APIKEY=<your-key>
```

Then run:

```bash
cd php && ./vendor/bin/phpunit test/
```


## Reference

### GraphiteNoteSDK

```php
require_once 'graphitenote_sdk.php';
$client = new GraphiteNoteSDK($options);
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `string` | API key for authentication. |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `array` | Feature activation flags. |
| `extend` | `array` | Additional Feature instances to load. |
| `system` | `array` | System overrides (e.g. custom `fetch` callable). |

### test

```php
$client = GraphiteNoteSDK::test($testopts, $sdkopts);
```

Creates a test-mode client with mock transport. Both arguments may be `null`.

### GraphiteNoteSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `(): array` | Deep copy of current SDK options. |
| `get_utility` | `(): Utility` | Copy of the SDK utility object. |
| `prepare` | `(array $fetchargs): array` | Build an HTTP request definition without sending. |
| `direct` | `(array $fetchargs): array` | Build and send an HTTP request. |
| `Dataset` | `($data): DatasetEntity` | Create a Dataset entity instance. |
| `DatasetFill` | `($data): DatasetFillEntity` | Create a DatasetFill entity instance. |
| `ModelInfo` | `($data): ModelInfoEntity` | Create a ModelInfo entity instance. |
| `ModelResult` | `($data): ModelResultEntity` | Create a ModelResult entity instance. |
| `Prediction` | `($data): PredictionEntity` | Create a Prediction entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `($reqmatch, $ctrl): array` | Load a single entity by match criteria. |
| `create` | `($reqdata, $ctrl): array` | Create a new entity. |
| `data_get` | `(): array` | Get entity data. |
| `data_set` | `($data): void` | Set entity data. |
| `match_get` | `(): array` | Get entity match criteria. |
| `match_set` | `($match): void` | Set entity match criteria. |
| `make` | `(): Entity` | Create a new instance with the same options. |
| `get_name` | `(): string` | Return the entity name. |

### Result shape

Entity operations return the ENTITY (call data_get() for the record) (an `array` for single-entity
ops, a `list` for `list`) and throw on error. Wrap calls in
`try`/`catch` to handle failures.

The `direct()` escape hatch never throws — it returns a result `array`
you branch on via `$result["ok"]`:

| Key | Type | Description |
| --- | --- | --- |
| `ok` | `bool` | `true` if the HTTP status is 2xx. |
| `status` | `int` | HTTP status code. |
| `headers` | `array` | Response headers. |
| `data` | `mixed` | Parsed JSON response body. |

On error, `ok` is `false` and `$err` contains the error value.

### Entities

#### Dataset

| Field | Description |
| --- | --- |
| `columns` | Number of columns created. |
| `datasetcode` | Unique code assigned to the created dataset. |
| `name` | Human-readable dataset name. |
| `tablename` | Backing table name, e.g. |
| `usercode` | Unique code identifying the user. |

Operations: Create.

API path: `/dataset-create`

#### DatasetFill

| Field | Description |
| --- | --- |
| `append` | True to append to existing rows; false to truncate the dataset first. |
| `columns` |  |
| `compressed` | True when insert-data is gzip+base64; false when it is a JSON-escaped string. |
| `datasetcode` |  |
| `details` |  |
| `insertdata` | The rows to insert, as a STRING: a JSON-escaped array-of-arrays when compressed is false, or gzipped-then-base64 when compressed is true. |
| `status` | 'success' on success. |
| `usercode` |  |

Operations: Create.

API path: `/dataset-complete`

#### ModelInfo

| Field | Description |
| --- | --- |
| `code` | Model code (Settings tab, ID section). |
| `created_at` |  |
| `dataset_code` | Code of the dataset the model is trained on. |
| `model_name` | Model type name, e.g. |
| `name` | User-given model name. |
| `properties` | Full model configuration and structured metadata (excluding bulky training artifacts); shape differs by model type (RFM, CLV, ABC, ...). |
| `updated_at` |  |

Operations: Load.

API path: `/model/fetch-model-info/{model_code}`

#### ModelResult

| Field | Description |
| --- | --- |
| `data` |  |
| `page` | Page number for paginated results. |
| `pagesize` | Rows per page. |

Operations: Create.

API path: `/model/fetch-result/{model_code}`

#### Prediction

| Field | Description |
| --- | --- |
| `columns` | Column names associated with each prediction row. |
| `data` |  |

Operations: Create.

API path: `/v1/prediction/model/{model_code}`



## Entities


### Dataset

Create an instance: `$dataset = $client->Dataset();`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `columns` | `int` | Number of columns created. |
| `datasetcode` | `string` | Unique code assigned to the created dataset. |
| `name` | `string` | Human-readable dataset name. |
| `tablename` | `string` | Backing table name, e.g. |
| `usercode` | `string` | Unique code identifying the user. |

#### Example: Create

```php
$dataset = $client->Dataset()->create([
    "name" => null, // string
    "usercode" => null, // string
]);
```


### DatasetFill

Create an instance: `$dataset_fill = $client->DatasetFill();`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `append` | `bool` | True to append to existing rows; false to truncate the dataset first. |
| `columns` | `array` |  |
| `compressed` | `bool` | True when insert-data is gzip+base64; false when it is a JSON-escaped string. |
| `datasetcode` | `string` |  |
| `details` | `array` |  |
| `insertdata` | `string` | The rows to insert, as a STRING: a JSON-escaped array-of-arrays when compressed is false, or gzipped-then-base64 when compressed is true. |
| `status` | `string` | 'success' on success. |
| `usercode` | `string` |  |

#### Example: Create

```php
$dataset_fill = $client->DatasetFill()->create([
    "append" => null, // bool
    "columns" => null, // array
    "compressed" => null, // bool
    "datasetcode" => null, // string
    "insertdata" => null, // string
    "usercode" => null, // string
]);
```


### ModelInfo

Create an instance: `$model_info = $client->ModelInfo();`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `code` | `string` | Model code (Settings tab, ID section). |
| `created_at` | `string` |  |
| `dataset_code` | `string` | Code of the dataset the model is trained on. |
| `model_name` | `string` | Model type name, e.g. |
| `name` | `string` | User-given model name. |
| `properties` | `array` | Full model configuration and structured metadata (excluding bulky training artifacts); shape differs by model type (RFM, CLV, ABC, ...). |
| `updated_at` | `string` |  |

#### Example: Load

```php
// load() returns the ENTITY — call data_get() for the ModelInfo record (throws on error).
$model_info = $client->ModelInfo()->load(["model_code" => "model_code"]);
```


### ModelResult

Create an instance: `$model_result = $client->ModelResult();`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `data` | `array` |  |
| `page` | `int` | Page number for paginated results. |
| `pagesize` | `int` | Rows per page. |

#### Example: Create

```php
$model_result = $client->ModelResult()->create([
    "model_code" => null, // string
]);
```


### Prediction

Create an instance: `$prediction = $client->Prediction();`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `columns` | `array` | Column names associated with each prediction row. |
| `data` | `array` |  |

#### Example: Create

```php
$prediction = $client->Prediction()->create([
    "model_code" => null, // string
]);
```


## Advanced

> The sections above cover everyday use. The material below explains the
> SDK's internals — useful when extending it with custom features, but not
> needed for normal use.

### The operation pipeline

Every entity operation follows a six-stage pipeline. Each stage fires a
feature hook before executing:

```
PrePoint → PreSpec → PreRequest → PreResponse → PreResult → PreDone
```

- **PrePoint**: Resolves which API endpoint to call based on the
  operation name and entity configuration.
- **PreSpec**: Builds the HTTP spec — URL, method, headers, body —
  from the resolved point and the caller's parameters.
- **PreRequest**: Sends the HTTP request. Features can intercept here
  to replace the transport (as TestFeature does with mocks).
- **PreResponse**: Parses the raw HTTP response.
- **PreResult**: Extracts the business data from the parsed response.
- **PreDone**: Final stage before returning to the caller. Entity
  state (match, data) is updated here.

If any stage errors, the pipeline short-circuits and the error surfaces
to the caller — see [Error handling](#error-handling) for how that looks
in this language.

### Features and hooks

Features are the extension mechanism. A feature is a PHP class
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **TestFeature**: In-memory mock transport for testing without a live server

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as arrays

The PHP SDK uses plain PHP associative arrays throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `Helpers::to_map()` to safely validate that a value is an array.

### Directory structure

```
php/
├── graphitenote_sdk.php          -- Main SDK class
├── config.php                     -- Configuration
├── features.php                   -- Feature factory
├── core/                          -- Core types and context
├── entity/                        -- Entity implementations
├── feature/                       -- Built-in features (Base, Test, Log)
├── utility/                       -- Utility functions and struct library
└── test/                          -- Test suites
```

The main class (`graphitenote_sdk.php`) exports the SDK class
and test helper. Import entity or utility modules directly only
when needed.

### Entity state

Entity instances are stateful. After a successful `load`, the entity
stores the returned data and match criteria internally.

```php
$modelinfo = $client->ModelInfo();
$modelinfo->load(["model_code" => "example"]);

// $modelinfo->data_get() now returns the modelinfo data from the last load
// $modelinfo->match_get() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`direct()` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `prepare()` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
