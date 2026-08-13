# GraphiteNote Lua SDK



The Lua SDK for the GraphiteNote API — an entity-oriented client using Lua conventions.

It exposes the API as capitalised, semantic **Entities** — e.g. `client:Dataset()` — each with the same small set of operations (`load`, `create`) instead of raw URL paths and query strings. You call meaning, not endpoints, which keeps the cognitive load low.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to LuaRocks. Install it from the
GitHub release tag (`lua/vX.Y.Z`, see [Releases](https://github.com/voxgig-sdk/graphite-note-sdk/releases)),
or add the source directory to your `LUA_PATH`:

```bash
export LUA_PATH="path/to/lua/?.lua;path/to/lua/?/init.lua;;"
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```lua
local sdk = require("graphite-note_sdk")

local client = sdk.new({
  apikey = os.getenv("GRAPHITE_NOTE_APIKEY"),
})
```

### 3. Load a modelinfo

ModelInfo is nested under model_code, so provide the `model_code`.

```lua
local modelinfo, err = client:ModelInfo():load({ model_code = "example_model_code" })
if err then error(err) end
print(modelinfo)
```

### 4. Create, update, and remove

```lua
-- Create
local created, err = client:Dataset():create({ name = "example_name", usercode = "example_usercode" })
if err then error(err) end

```


## Error handling

Entity operations return `(value, err)`. Check `err` before using
the value:

```lua
local modelinfo, err = client:ModelInfo():load({ model_code = "example" })
if err then error(err) end
```

`direct` follows the same `(value, err)` convention:

```lua
local result, err = client:direct({
  path = "/api/resource/{id}",
  method = "GET",
  params = { id = "example_id" },
})
if err then error(err) end
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```lua
local result, err = client:direct({
  path = "/api/resource/{id}",
  method = "GET",
  params = { id = "example" },
})
if err then error(err) end

if result["ok"] then
  print(result["status"])  -- 200
  print(result["data"])    -- response body
end
```

### Prepare a request without sending it

```lua
local fetchdef, err = client:prepare({
  path = "/api/resource/{id}",
  method = "DELETE",
  params = { id = "example" },
})
if err then error(err) end

print(fetchdef["url"])
print(fetchdef["method"])
print(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```lua
local client = sdk.test()

local result, err = client:ModelInfo():load({ model_code = "example" })
-- result is the returned data; err is set on failure
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```lua
local function mock_fetch(url, init)
  return {
    status = 200,
    statusText = "OK",
    headers = {},
    json = function()
      return { id = "mock01" }
    end,
  }, nil
end

local client = sdk.new({
  base = "http://localhost:8080",
  system = {
    fetch = mock_fetch,
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
cd lua && busted test/
```


## Reference

### GraphiteNoteSDK

```lua
local sdk = require("graphite-note_sdk")
local client = sdk.new(options)
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `string` | API key for authentication. |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `table` | Feature activation flags. |
| `extend` | `table` | Additional Feature instances to load. |
| `system` | `table` | System overrides (e.g. custom `fetch` function). |

### test

```lua
local client = sdk.test(testopts, sdkopts)
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### GraphiteNoteSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `() -> table` | Deep copy of current SDK options. |
| `get_utility` | `() -> Utility` | Copy of the SDK utility object. |
| `prepare` | `(fetchargs) -> table, err` | Build an HTTP request definition without sending. |
| `direct` | `(fetchargs) -> table, err` | Build and send an HTTP request. |
| `Dataset` | `(data) -> DatasetEntity` | Create a Dataset entity instance. |
| `DatasetFill` | `(data) -> DatasetFillEntity` | Create a DatasetFill entity instance. |
| `ModelInfo` | `(data) -> ModelInfoEntity` | Create a ModelInfo entity instance. |
| `ModelResult` | `(data) -> ModelResultEntity` | Create a ModelResult entity instance. |
| `Prediction` | `(data) -> PredictionEntity` | Create a Prediction entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `(reqmatch, ctrl) -> any, err` | Load a single entity by match criteria. |
| `create` | `(reqdata, ctrl) -> any, err` | Create a new entity. |
| `data_get` | `() -> table` | Get entity data. |
| `data_set` | `(data)` | Set entity data. |
| `match_get` | `() -> table` | Get entity match criteria. |
| `match_set` | `(match)` | Set entity match criteria. |
| `make` | `() -> Entity` | Create a new instance with the same options. |
| `get_name` | `() -> string` | Return the entity name. |

### Result shape

Entity operations return `(value, err)`. The `value` is the operation's
data **directly** — there is no wrapper:

| Operation | `value` |
| --- | --- |
| `load` / `create` | the entity record (a `table`) |

Check `err` first (it is non-`nil` on failure), then use `value`:

    local model_info, err = client:ModelInfo():load()
    if err then error(err) end
    -- model_info is the loaded record

Only `direct()` returns a response envelope — a `table` with `ok`,
`status`, `headers`, and `data` keys.

### Entities

#### Dataset

| Field | Description |
| --- | --- |
| `columns` |  |
| `datasetcode` |  |
| `name` |  |
| `tablename` |  |
| `usercode` |  |

Operations: Create.

API path: `/dataset-create`

#### DatasetFill

| Field | Description |
| --- | --- |
| `append` |  |
| `columns` |  |
| `compressed` |  |
| `datasetcode` |  |
| `details` |  |
| `insertdata` |  |
| `status` |  |
| `usercode` |  |

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
| `properties` |  |
| `updated_at` |  |

Operations: Load.

API path: `/model/fetch-model-info/{model_code}`

#### ModelResult

| Field | Description |
| --- | --- |
| `data` |  |
| `page` |  |
| `pagesize` |  |

Operations: Create.

API path: `/model/fetch-result/{model_code}`

#### Prediction

| Field | Description |
| --- | --- |
| `columns` |  |
| `data` |  |

Operations: Create.

API path: `/v1/prediction/model/{model_code}`



## Entities


### Dataset

Create an instance: `local dataset = client:Dataset(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `columns` | `number` |  |
| `datasetcode` | `string` |  |
| `name` | `string` |  |
| `tablename` | `string` |  |
| `usercode` | `string` |  |

#### Example: Create

```lua
local dataset, err = client:Dataset():create({
  name = "example_name", -- string
  usercode = "example_usercode", -- string
})
```


### DatasetFill

Create an instance: `local dataset_fill = client:DatasetFill(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `append` | `boolean` |  |
| `columns` | `table` |  |
| `compressed` | `boolean` |  |
| `datasetcode` | `string` |  |
| `details` | `table` |  |
| `insertdata` | `string` |  |
| `status` | `string` |  |
| `usercode` | `string` |  |

#### Example: Create

```lua
local dataset_fill, err = client:DatasetFill():create({
  append = true, -- boolean
  columns = {}, -- table
  compressed = true, -- boolean
  datasetcode = "example_datasetcode", -- string
  insertdata = "example_insertdata", -- string
  usercode = "example_usercode", -- string
})
```


### ModelInfo

Create an instance: `local model_info = client:ModelInfo(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `code` | `string` |  |
| `created_at` | `string` |  |
| `dataset_code` | `string` |  |
| `model_name` | `string` |  |
| `name` | `string` |  |
| `properties` | `table` |  |
| `updated_at` | `string` |  |

#### Example: Load

```lua
local model_info, err = client:ModelInfo():load({ model_code = "model_code" })
```


### ModelResult

Create an instance: `local model_result = client:ModelResult(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `data` | `table` |  |
| `page` | `number` |  |
| `pagesize` | `number` |  |

#### Example: Create

```lua
local model_result, err = client:ModelResult():create({
  model_code = "example_model_code", -- string
})
```


### Prediction

Create an instance: `local prediction = client:Prediction(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `columns` | `table` |  |
| `data` | `table` |  |

#### Example: Create

```lua
local prediction, err = client:Prediction():create({
  model_code = "example_model_code", -- string
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

Features are the extension mechanism. A feature is a Lua table
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **TestFeature**: In-memory mock transport for testing without a live server

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as tables

The Lua SDK uses plain Lua tables throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `helpers.to_map()` to safely validate that a value is a table.

### Module structure

```
lua/
├── graphite-note_sdk.lua    -- Main SDK module
├── config.lua               -- Configuration
├── features.lua             -- Feature factory
├── core/                    -- Core types and context
├── entity/                  -- Entity implementations
├── feature/                 -- Built-in features (Base, Test, Log)
├── utility/                 -- Utility functions and struct library
└── test/                    -- Test suites
```

The main module (`graphite-note_sdk`) exports the SDK constructor
and test helper. Import entity or utility modules directly only
when needed.

### Entity state

Entity instances are stateful. After a successful `load`, the entity
stores the returned data and match criteria internally.

```lua
local modelinfo = client:ModelInfo()
modelinfo:load({ model_code = "example" })

-- modelinfo:data_get() now returns the modelinfo data from the last load
-- modelinfo:match_get() returns the last match criteria
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
