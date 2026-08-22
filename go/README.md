# GraphiteNote Golang SDK



The Golang SDK for the GraphiteNote API — an entity-oriented client using standard Go conventions. No generics required; data flows as `map[string]any`.

It exposes the API as capitalised, semantic **Entities** — e.g. `client.Dataset(nil)` — each with the same small set of operations (`Load`, `Create`) instead of raw URL paths and query strings. You call meaning, not endpoints, which keeps the cognitive load low.

> Also generated from this model: `go-cli`, `go-mcp`, `lua`, `php`, `py`, `rb`, `ts` — see
> the [top-level README](../README.md).


## Install
```bash
go get github.com/voxgig-sdk/graphite-note-sdk/go@latest
```

The Go module proxy resolves the version from the `go/vX.Y.Z` GitHub
release tag — see [Releases](https://github.com/voxgig-sdk/graphite-note-sdk/releases) for the available versions.

To vendor from a local checkout instead, clone this repo alongside your
project and add a `replace` directive pointing at the checked-out
`go/` directory:

```bash
go mod edit -replace github.com/voxgig-sdk/graphite-note-sdk/go=../graphite-note-sdk/go
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### Quickstart

A complete program: create a client, then call the entity operations.
Each operation returns `(value, error)` — the value is the data itself
(there is no `{ok, data}` wrapper), so check `err` and use the value
directly.

```go
package main

import (
    "fmt"
    "os"
    sdk "github.com/voxgig-sdk/graphite-note-sdk/go"
)

func main() {
    client := sdk.NewGraphiteNoteSDK(map[string]any{
        "apikey": os.Getenv("GRAPHITE_NOTE_APIKEY"),
    })

    // Create a dataset.
    created, err := client.Dataset(nil).Create(map[string]any{"name": "example_name", "usercode": "example_usercode"}, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println(created)
}
```


## Error handling

Every entity operation returns `(value, error)`. Check `err` before
using the value — there is no exception to catch:

```go
modelinfo, err := client.ModelInfo(nil).Load(map[string]any{"model_code": "example"}, nil)
if err != nil {
    // handle err
    return
}
_ = modelinfo
```

`Direct` follows the same `(value, error)` convention:

```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example_id"},
})
if err != nil {
    // handle err
}
_ = result
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example"},
})
if err != nil {
    panic(err)
}

if result["ok"] == true {
    fmt.Println(result["status"]) // 200
    fmt.Println(result["data"])   // response body
}
```

### Prepare a request without sending it

```go
fetchdef, err := client.Prepare(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "DELETE",
    "params": map[string]any{"id": "example"},
})
if err != nil {
    panic(err)
}

fmt.Println(fetchdef["url"])
fmt.Println(fetchdef["method"])
fmt.Println(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```go
client := sdk.Test()

modelInfo, err := client.ModelInfo(nil).Load(
    map[string]any{"model_code": "example"}, nil,
)
if err != nil {
    panic(err)
}
fmt.Println(modelInfo) // the returned mock data
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```go
mockFetch := func(url string, init map[string]any) (map[string]any, error) {
    return map[string]any{
        "status":     200,
        "statusText": "OK",
        "headers":    map[string]any{},
        "json": (func() any)(func() any {
            return map[string]any{"id": "mock01"}
        }),
    }, nil
}

client := sdk.NewGraphiteNoteSDK(map[string]any{
    "base": "http://localhost:8080",
    "system": map[string]any{
        "fetch": (func(string, map[string]any) (map[string]any, error))(mockFetch),
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
cd go && go test ./test/...
```


## Reference

### NewGraphiteNoteSDK

```go
func NewGraphiteNoteSDK(options map[string]any) *GraphiteNoteSDK
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `"apikey"` | `string` | API key for authentication. |
| `"base"` | `string` | Base URL of the API server. |
| `"prefix"` | `string` | URL path prefix prepended to all requests. |
| `"suffix"` | `string` | URL path suffix appended to all requests. |
| `"feature"` | `map[string]any` | Feature activation flags. |
| `"extend"` | `[]any` | Additional Feature instances to load. |
| `"system"` | `map[string]any` | System overrides (e.g. custom `"fetch"` function). |

### TestSDK

```go
func TestSDK(testopts map[string]any, sdkopts map[string]any) *GraphiteNoteSDK
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### GraphiteNoteSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `OptionsMap` | `() map[string]any` | Deep copy of current SDK options. |
| `GetUtility` | `() *Utility` | Copy of the SDK utility object. |
| `Prepare` | `(fetchargs map[string]any) (map[string]any, error)` | Build an HTTP request definition without sending. |
| `Direct` | `(fetchargs map[string]any) (map[string]any, error)` | Build and send an HTTP request. |
| `Dataset` | `(data map[string]any) GraphiteNoteEntity` | Create a Dataset entity instance. |
| `DatasetFill` | `(data map[string]any) GraphiteNoteEntity` | Create a DatasetFill entity instance. |
| `ModelInfo` | `(data map[string]any) GraphiteNoteEntity` | Create a ModelInfo entity instance. |
| `ModelResult` | `(data map[string]any) GraphiteNoteEntity` | Create a ModelResult entity instance. |
| `Prediction` | `(data map[string]any) GraphiteNoteEntity` | Create a Prediction entity instance. |

### Entity interface (GraphiteNoteEntity)

All entities implement the `GraphiteNoteEntity` interface.

| Method | Signature | Description |
| --- | --- | --- |
| `Load` | `(reqmatch, ctrl map[string]any) (any, error)` | Load a single entity by match criteria. |
| `Create` | `(reqdata, ctrl map[string]any) (any, error)` | Create a new entity. |
| `Data` | `(args ...any) any` | Get or set entity data. |
| `Match` | `(args ...any) any` | Get or set entity match criteria. |
| `Make` | `() Entity` | Create a new instance with the same options. |
| `GetName` | `() string` | Return the entity name. |

### Result shape

Entity operations return `(value, error)`. The `value` is the
operation's data **directly** — there is no wrapper:

| Operation | `value` |
| --- | --- |
| `Load` / `Create` | the entity record (`map[string]any`) |

Check `err` first, then use the value directly (or the typed
`...Typed` variants, which return the entity's model struct and a typed
slice):

    dataset, err := client.Dataset(nil).Create(map[string]any{/* fields */}, nil)
    if err != nil { /* handle */ }
    // dataset is the returned record

Only `Direct()` returns a response envelope — a `map[string]any` with
`"ok"`, `"status"`, `"headers"`, and `"data"` keys.

### Entities

#### Dataset

| Field | Description |
| --- | --- |
| `"columns"` | Number of columns created. |
| `"datasetcode"` | Unique code assigned to the created dataset. |
| `"name"` | Human-readable dataset name. |
| `"tablename"` | Backing table name, e.g. |
| `"usercode"` | Unique code identifying the user. |

Operations: Create.

API path: `/dataset-create`

#### DatasetFill

| Field | Description |
| --- | --- |
| `"append"` | True to append to existing rows; false to truncate the dataset first. |
| `"columns"` |  |
| `"compressed"` | True when insert-data is gzip+base64; false when it is a JSON-escaped string. |
| `"datasetcode"` |  |
| `"details"` |  |
| `"insertdata"` | The rows to insert, as a STRING: a JSON-escaped array-of-arrays when compressed is false, or gzipped-then-base64 when compressed is true. |
| `"status"` | 'success' on success. |
| `"usercode"` |  |

Operations: Create.

API path: `/dataset-complete`

#### ModelInfo

| Field | Description |
| --- | --- |
| `"code"` | Model code (Settings tab, ID section). |
| `"created_at"` |  |
| `"dataset_code"` | Code of the dataset the model is trained on. |
| `"model_name"` | Model type name, e.g. |
| `"name"` | User-given model name. |
| `"properties"` | Full model configuration and structured metadata (excluding bulky training artifacts); shape differs by model type (RFM, CLV, ABC, ...). |
| `"updated_at"` |  |

Operations: Load.

API path: `/model/fetch-model-info/{model_code}`

#### ModelResult

| Field | Description |
| --- | --- |
| `"data"` |  |
| `"page"` | Page number for paginated results. |
| `"pagesize"` | Rows per page. |

Operations: Create.

API path: `/model/fetch-result/{model_code}`

#### Prediction

| Field | Description |
| --- | --- |
| `"columns"` | Column names associated with each prediction row. |
| `"data"` |  |

Operations: Create.

API path: `/v1/prediction/model/{model_code}`



## Entities


### Dataset

Create an instance: `dataset := client.Dataset(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Create(data, ctrl)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `columns` | `int` | Number of columns created. |
| `datasetcode` | `string` | Unique code assigned to the created dataset. |
| `name` | `string` | Human-readable dataset name. |
| `tablename` | `string` | Backing table name, e.g. |
| `usercode` | `string` | Unique code identifying the user. |

#### Example: Create

```go
result, err := client.Dataset(nil).Create(map[string]any{
    "name": "example_name",
    "usercode": "example_usercode",
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result)
```


### DatasetFill

Create an instance: `datasetFill := client.DatasetFill(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Create(data, ctrl)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `append` | `bool` | True to append to existing rows; false to truncate the dataset first. |
| `columns` | `[]any` |  |
| `compressed` | `bool` | True when insert-data is gzip+base64; false when it is a JSON-escaped string. |
| `datasetcode` | `string` |  |
| `details` | `map[string]any` |  |
| `insertdata` | `string` | The rows to insert, as a STRING: a JSON-escaped array-of-arrays when compressed is false, or gzipped-then-base64 when compressed is true. |
| `status` | `string` | 'success' on success. |
| `usercode` | `string` |  |

#### Example: Create

```go
result, err := client.DatasetFill(nil).Create(map[string]any{
    "append": true,
    "columns": []any{},
    "compressed": true,
    "datasetcode": "example_datasetcode",
    "insertdata": "example_insertdata",
    "usercode": "example_usercode",
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result)
```


### ModelInfo

Create an instance: `modelInfo := client.ModelInfo(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Load(match, ctrl)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `code` | `string` | Model code (Settings tab, ID section). |
| `created_at` | `string` |  |
| `dataset_code` | `string` | Code of the dataset the model is trained on. |
| `model_name` | `string` | Model type name, e.g. |
| `name` | `string` | User-given model name. |
| `properties` | `map[string]any` | Full model configuration and structured metadata (excluding bulky training artifacts); shape differs by model type (RFM, CLV, ABC, ...). |
| `updated_at` | `string` |  |

#### Example: Load

```go
modelInfo, err := client.ModelInfo(nil).Load(map[string]any{"model_code": "model_code"}, nil)
if err != nil {
    panic(err)
}
fmt.Println(modelInfo) // the loaded record
```


### ModelResult

Create an instance: `modelResult := client.ModelResult(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Create(data, ctrl)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `data` | `[]any` |  |
| `page` | `int` | Page number for paginated results. |
| `pagesize` | `int` | Rows per page. |

#### Example: Create

```go
result, err := client.ModelResult(nil).Create(map[string]any{
    "model_code": "example_model_code",
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result)
```


### Prediction

Create an instance: `prediction := client.Prediction(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Create(data, ctrl)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `columns` | `[]any` | Column names associated with each prediction row. |
| `data` | `[]any` |  |

#### Example: Create

```go
result, err := client.Prediction(nil).Create(map[string]any{
    "model_code": "example_model_code",
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result)
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

Features are the extension mechanism. A feature implements the
`Feature` interface and provides hooks — functions keyed by pipeline
stage names.

The SDK ships with built-in features:

- **TestFeature**: In-memory mock transport for testing without a live server

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as maps

The Go SDK uses `map[string]any` throughout rather than typed structs.
This mirrors the dynamic nature of the API and keeps the SDK
flexible — no code generation is needed when the API schema changes.

Use `core.ToMapAny()` to safely cast results and nested data.

### Package structure

```
github.com/voxgig-sdk/graphite-note-sdk/go/
├── graphite-note.go        # Root package — type aliases and constructors
├── core/               # SDK core — client, types, pipeline
├── entity/             # Entity implementations
├── feature/            # Built-in features (Base, Test, Log)
├── utility/            # Utility functions and struct library
└── test/               # Test suites
```

The root package (`github.com/voxgig-sdk/graphite-note-sdk/go`) re-exports everything needed
for normal use. Import sub-packages only when you need specific types
like `core.ToMapAny`.

### Entity state

Entity instances are stateful. After a successful `Load`, the entity
stores the returned data and match criteria internally.

```go
modelinfo := client.ModelInfo(nil)
modelinfo.Load(map[string]any{"model_code": "example"}, nil)

// modelinfo.Data() now returns the modelinfo data from the last load
// modelinfo.Match() returns the last match criteria
```

Call `Make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`Direct()` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `Prepare()` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
