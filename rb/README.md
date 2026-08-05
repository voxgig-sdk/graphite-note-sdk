# GraphiteNote Ruby SDK



The Ruby SDK for the GraphiteNote API — an entity-oriented client using idiomatic Ruby conventions.

The SDK exposes the API as capitalised, semantic **Entities** — for example `client.Dataset` — with named operations (`load`/`create`) instead of raw URL paths and query strings. Working with resources and verbs keeps call sites self-describing and reduces cognitive load.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to RubyGems. Install it from the
GitHub release tag (`rb/vX.Y.Z`):

- Releases: [https://github.com/voxgig-sdk/graphite-note-sdk/releases](https://github.com/voxgig-sdk/graphite-note-sdk/releases)


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```ruby
require_relative "GraphiteNote_sdk"

client = GraphiteNoteSDK.new({
  "apikey" => ENV["GRAPHITE_NOTE_APIKEY"],
})
```

### 3. Load a modelinfo

ModelInfo is nested under model_code, so provide the `model_code`.

```ruby
begin
  # load returns the bare ModelInfo record (raises on error).
  modelinfo = client.ModelInfo.load({ "model_code" => "example_model_code" })
  puts modelinfo
rescue => err
  warn "load failed: #{err}"
end
```

### 4. Create, update, and remove

```ruby
# create returns the bare created Dataset record.
created = client.Dataset.create({ "name" => "example_name", "user_code" => "example_user_code" })

```


## Error handling

Entity operations raise on failure, so rescue them:

```ruby
begin
  modelinfo = client.ModelInfo.load({ "model_code" => "example" })
rescue => err
  warn "load failed: #{err}"
end
```

`direct` does **not** raise — it returns the result hash. Branch on
`ok`; on failure `status` holds the HTTP status (for error responses) and
`err` holds a transport error, so read both defensively:

```ruby
result = client.direct({
  "path" => "/api/resource/{id}",
  "method" => "GET",
  "params" => { "id" => "example_id" },
})

warn "request failed: #{result["err"] || "HTTP #{result["status"]}"}" unless result["ok"]
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ruby
result = client.direct({
  "path" => "/api/resource/{id}",
  "method" => "GET",
  "params" => { "id" => "example" },
})

if result["ok"]
  puts result["status"]  # 200
  puts result["data"]    # response body
else
  # On an HTTP error status there is no err (only a transport failure sets
  # it), so fall back to the status code.
  warn(result["err"] || "HTTP #{result["status"]}")
end
```

### Prepare a request without sending it

```ruby
begin
  fetchdef = client.prepare({
    "path" => "/api/resource/{id}",
    "method" => "DELETE",
    "params" => { "id" => "example" },
  })
  puts fetchdef["url"]
  puts fetchdef["method"]
  puts fetchdef["headers"]
rescue => err
  warn "prepare failed: #{err}"
end
```

### Use test mode

Create a mock client for unit testing — no server required:

```ruby
client = GraphiteNoteSDK.test

# Entity ops return the bare mock record (raises on error).
modelinfo = client.ModelInfo.load({ "model_code" => "example" })
puts modelinfo
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```ruby
mock_fetch = ->(url, init) {
  return {
    "status" => 200,
    "statusText" => "OK",
    "headers" => {},
    "json" => ->() { { "id" => "mock01" } },
  }, nil
}

client = GraphiteNoteSDK.new({
  "base" => "http://localhost:8080",
  "system" => {
    "fetch" => mock_fetch,
  },
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
GRAPHITE_NOTE_TEST_LIVE=TRUE
GRAPHITE_NOTE_APIKEY=<your-key>
```

Then run:

```bash
cd rb && ruby -Itest -e "Dir['test/*_test.rb'].each { |f| require_relative f }"
```


## Reference

### GraphiteNoteSDK

```ruby
require_relative "GraphiteNote_sdk"
client = GraphiteNoteSDK.new(options)
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `String` | API key for authentication. |
| `base` | `String` | Base URL of the API server. |
| `prefix` | `String` | URL path prefix prepended to all requests. |
| `suffix` | `String` | URL path suffix appended to all requests. |
| `feature` | `Hash` | Feature activation flags. |
| `extend` | `Hash` | Additional Feature instances to load. |
| `system` | `Hash` | System overrides (e.g. custom `fetch` lambda). |

### test

```ruby
client = GraphiteNoteSDK.test(testopts, sdkopts)
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### GraphiteNoteSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `() -> Hash` | Deep copy of current SDK options. |
| `get_utility` | `() -> Utility` | Copy of the SDK utility object. |
| `prepare` | `(fetchargs) -> Hash` | Build an HTTP request definition without sending. Raises on error. |
| `direct` | `(fetchargs) -> Hash` | Build and send an HTTP request. Returns a result hash (`result["ok"]`); does not raise. |
| `Dataset` | `(data) -> DatasetEntity` | Create a Dataset entity instance. |
| `DatasetFill` | `(data) -> DatasetFillEntity` | Create a DatasetFill entity instance. |
| `ModelInfo` | `(data) -> ModelInfoEntity` | Create a ModelInfo entity instance. |
| `ModelResult` | `(data) -> ModelResultEntity` | Create a ModelResult entity instance. |
| `Prediction` | `(data) -> PredictionEntity` | Create a Prediction entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `(reqmatch, ctrl) -> any` | Load a single entity by match criteria. Raises on error. |
| `create` | `(reqdata, ctrl) -> any` | Create a new entity. Raises on error. |
| `data_get` | `() -> Hash` | Get entity data. |
| `data_set` | `(data)` | Set entity data. |
| `match_get` | `() -> Hash` | Get entity match criteria. |
| `match_set` | `(match)` | Set entity match criteria. |
| `make` | `() -> Entity` | Create a new instance with the same options. |
| `get_name` | `() -> String` | Return the entity name. |

### Result shape

Entity operations return the result data directly. On failure they
raise a `GraphiteNoteError` (a `StandardError` subclass), so wrap
calls in `begin`/`rescue` where you need to handle errors.

The `direct` escape hatch is the exception: it never raises and instead
returns a result `Hash` with these keys:

| Key | Type | Description |
| --- | --- | --- |
| `ok` | `Boolean` | `true` if the HTTP status is 2xx. |
| `status` | `Integer` | HTTP status code. |
| `headers` | `Hash` | Response headers. |
| `data` | `any` | Parsed JSON response body. |
| `err` | `Error` | Present when `ok` is `false`. |

### Entities

#### Dataset

| Field | Description |
| --- | --- |
| `column` |  |
| `dataset_code` |  |
| `name` |  |
| `table_name` |  |
| `user_code` |  |

Operations: Create.

API path: `/dataset-create`

#### DatasetFill

| Field | Description |
| --- | --- |
| `append` |  |
| `column` |  |
| `compressed` |  |
| `dataset_code` |  |
| `detail` |  |
| `insert_data` |  |
| `status` |  |
| `user_code` |  |

Operations: Create.

API path: `/dataset-complete`

#### ModelInfo

| Field | Description |
| --- | --- |
| `code` |  |
| `created_at` |  |
| `dataset_code` |  |
| `model_name` |  |
| `name` |  |
| `property` |  |
| `updated_at` |  |

Operations: Load.

API path: `/model/fetch-model-info/{model_code}`

#### ModelResult

| Field | Description |
| --- | --- |
| `data` |  |
| `page` |  |
| `page_size` |  |

Operations: Create.

API path: `/model/fetch-result/{model_code}`

#### Prediction

| Field | Description |
| --- | --- |
| `column` |  |
| `data` |  |

Operations: Create.

API path: `/v1/prediction/model/{model_code}`



## Entities


### Dataset

Create an instance: `dataset = client.Dataset`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `column` | `Integer` |  |
| `dataset_code` | `String` |  |
| `name` | `String` |  |
| `table_name` | `String` |  |
| `user_code` | `String` |  |

#### Example: Create

```ruby
dataset = client.Dataset.create({
  "name" => "example_name", # String
  "user_code" => "example_user_code", # String
})
```


### DatasetFill

Create an instance: `dataset_fill = client.DatasetFill`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `append` | `Boolean` |  |
| `column` | `Array` |  |
| `compressed` | `Boolean` |  |
| `dataset_code` | `String` |  |
| `detail` | `Hash` |  |
| `insert_data` | `String` |  |
| `status` | `String` |  |
| `user_code` | `String` |  |

#### Example: Create

```ruby
dataset_fill = client.DatasetFill.create({
  "append" => true, # Boolean
  "column" => [], # Array
  "compressed" => true, # Boolean
  "dataset_code" => "example_dataset_code", # String
  "insert_data" => "example_insert_data", # String
  "user_code" => "example_user_code", # String
})
```


### ModelInfo

Create an instance: `model_info = client.ModelInfo`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `code` | `String` |  |
| `created_at` | `String` |  |
| `dataset_code` | `String` |  |
| `model_name` | `String` |  |
| `name` | `String` |  |
| `property` | `Hash` |  |
| `updated_at` | `String` |  |

#### Example: Load

```ruby
# load returns the bare ModelInfo record (raises on error).
model_info = client.ModelInfo.load({ "model_code" => "model_code" })
```


### ModelResult

Create an instance: `model_result = client.ModelResult`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `data` | `Array` |  |
| `page` | `Integer` |  |
| `page_size` | `Integer` |  |

#### Example: Create

```ruby
model_result = client.ModelResult.create({
  "model_code" => "example_model_code", # String
})
```


### Prediction

Create an instance: `prediction = client.Prediction`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `column` | `Array` |  |
| `data` | `Array` |  |

#### Example: Create

```ruby
prediction = client.Prediction.create({
  "model_code" => "example_model_code", # String
})
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

Features are the extension mechanism. A feature is a Ruby class
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **TestFeature**: In-memory mock transport for testing without a live server

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as hashes

The Ruby SDK uses plain Ruby hashes throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `Helpers.to_map()` to safely validate that a value is a hash.

### Module structure

```
rb/
├── GraphiteNote_sdk.rb       -- Main SDK module
├── config.rb                  -- Configuration
├── features.rb                -- Feature factory
├── core/                      -- Core types and context
├── entity/                    -- Entity implementations
├── feature/                   -- Built-in features (Base, Test, Log)
├── utility/                   -- Utility functions and struct library
└── test/                      -- Test suites
```

The main module (`GraphiteNote_sdk`) exports the SDK class
and test helper. Import entity or utility modules directly only
when needed.

### Entity state

Entity instances are stateful. After a successful `load`, the entity
stores the returned data and match criteria internally.

```ruby
modelinfo = client.ModelInfo
modelinfo.load({ "model_code" => "example" })

# modelinfo.data_get now returns the modelinfo data from the last load
# modelinfo.match_get returns the last match criteria
```

Call `make` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`direct` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `prepare` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
