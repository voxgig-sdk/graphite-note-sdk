# GraphiteNote TypeScript SDK



The TypeScript SDK for the GraphiteNote API — a type-safe, entity-oriented client with full async/await support.

The API is exposed as capitalised, semantic **Entities** — e.g.
`client.Dataset()` — each with a small set of operations (`load`, `create`)
instead of raw URL paths and query parameters. This keeps the surface
predictable and low-friction for both humans and AI agents.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to npm. Install it from the GitHub
release tag (`ts/vX.Y.Z`):

- Releases: [https://github.com/voxgig-sdk/graphite-note-sdk/releases](https://github.com/voxgig-sdk/graphite-note-sdk/releases)


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```ts
import { GraphiteNoteSDK } from '@voxgig-sdk/graphite-note'

const client = new GraphiteNoteSDK({
  apikey: process.env.GRAPHITE_NOTE_APIKEY,
})
```

### 3. Load a modelinfo

ModelInfo is nested under model_code, so provide the `model_code`.
`load()` returns the entity directly and throws on failure:

```ts
try {
  const modelinfo = await client.ModelInfo().load({
    model_code: 'example_model_code',
  })
  console.log(modelinfo)
} catch (err) {
  console.error('load failed:', err)
}
```

### 4. Create, update, and remove

```ts
// Create — returns the created Dataset ENTITY (.data() for the record)
const created = await client.Dataset().create({
  name: 'example_name',
  usercode: 'example_usercode',
})

```


## Error handling

Entity operations reject on failure, so wrap them in `try` / `catch`:

```ts
try {
  const modelinfo = await client.ModelInfo().load({ model_code: "example" })
  console.log(modelinfo)
} catch (err) {
  console.error('load failed:', err)
}
```

The low-level `direct()` method does **not** throw — it returns the
value or an `Error`, so check the result before using it:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example_id' },
})

if (result instanceof Error) {
  throw result
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})

if (result instanceof Error) {
  throw result
}
if (result.ok) {
  console.log(result.status)  // 200
  console.log(result.data)    // response body
}
```

### Prepare a request without sending it

```ts
const fetchdef = await client.prepare({
  path: '/api/resource/{id}',
  method: 'DELETE',
  params: { id: 'example' },
})

// Inspect before sending
console.log(fetchdef.url)
console.log(fetchdef.method)
console.log(fetchdef.headers)
```

### Use test mode

Create a mock client for unit testing — no server required:

```ts
const client = GraphiteNoteSDK.test()

const modelinfo = await client.ModelInfo().load({ model_code: 'example_model_code' })
// modelinfo is the entity, populated with mock response data
// — call modelinfo.data() for the record itself
console.log(modelinfo)
```

You can also use the instance method:

```ts
const client = new GraphiteNoteSDK({ apikey: '...' })
const testClient = client.tester()
```

### Retain entity state across calls

Entity instances remember their last match and data:

```ts
const entity = client.ModelInfo()

// First call runs the operation and stores its result
await entity.load({ model_code: 'example_model_code' })

// Subsequent calls reuse the stored state
const data = entity.data()
console.log(data)
```

### Add custom middleware

Pass features via the `extend` option:

```ts
const logger = {
  hooks: {
    PreRequest: (ctx: any) => {
      console.log('Requesting:', ctx.spec.method, ctx.spec.path)
    },
    PreResponse: (ctx: any) => {
      console.log('Status:', ctx.out.request?.status)
    },
  },
}

const client = new GraphiteNoteSDK({
  apikey: '...',
  extend: [logger],
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
cd ts && npm test
```


## Reference

### GraphiteNoteSDK

#### Constructor

```ts
new GraphiteNoteSDK(options?: {
  apikey?: string
  base?: string
  prefix?: string
  suffix?: string
  feature?: Record<string, { active: boolean }>
  extend?: Feature[]
})
```

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `string` | API key for authentication. |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `object` | Feature activation flags (e.g. `{ test: { active: true } }`). |
| `extend` | `Feature[]` | Additional feature instances to load. |

#### Methods

| Method | Returns | Description |
| --- | --- | --- |
| `options()` | `object` | Deep copy of current SDK options. |
| `utility()` | `Utility` | Deep copy of the SDK utility object. |
| `prepare(fetchargs?)` | `Promise<FetchDef>` | Build an HTTP request definition without sending it. |
| `direct(fetchargs?)` | `Promise<DirectResult>` | Build and send an HTTP request. |
| `Dataset(data?)` | `DatasetEntity` | Create a Dataset entity instance. |
| `DatasetFill(data?)` | `DatasetFillEntity` | Create a DatasetFill entity instance. |
| `ModelInfo(data?)` | `ModelInfoEntity` | Create a ModelInfo entity instance. |
| `ModelResult(data?)` | `ModelResultEntity` | Create a ModelResult entity instance. |
| `Prediction(data?)` | `PredictionEntity` | Create a Prediction entity instance. |
| `tester(testopts?, sdkopts?)` | `GraphiteNoteSDK` | Create a test-mode client instance. |

#### Static methods

| Method | Returns | Description |
| --- | --- | --- |
| `GraphiteNoteSDK.test(testopts?, sdkopts?)` | `GraphiteNoteSDK` | Create a test-mode client. |

### Entity interface

All entities share the same interface.

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `load(reqmatch?, ctrl?): Promise<Entity>` | Load a single entity by match criteria. |
| `create` | `create(reqdata?, ctrl?): Promise<Entity>` | Create a new entity. |
| `data` | `data(data?: Partial<Entity>): Entity` | Get or set entity data. |
| `match` | `match(match?: Partial<Entity>): Partial<Entity>` | Get or set entity match criteria. |
| `make` | `make(): Entity` | Create a new instance with the same options. |
| `client` | `client(): GraphiteNoteSDK` | Return the parent SDK client. |
| `entopts` | `entopts(): object` | Return a copy of the entity options. |

#### Return values

Entity operations resolve to the entity data directly — there is no
result envelope:

- `load` and `create` resolve to a single entity object.

On a failed request these methods **throw**, so wrap calls in
`try`/`catch` to handle errors. Only `direct()` returns the result
envelope described below.

### DirectResult shape

The `direct()` method returns:

```ts
{
  ok: boolean
  status: number
  headers: object
  data: any
}
```

On error, `ok` is `false` and an `err` property contains the error.

### FetchDef shape

The `prepare()` method returns:

```ts
{
  url: string
  method: string
  headers: Record<string, string>
  body?: any
}
```

### Entities

#### Dataset

| Field | Description |
| --- | --- |
| `columns` |  |
| `datasetcode` |  |
| `name` |  |
| `tablename` |  |
| `usercode` |  |

Operations: create.

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

Operations: create.

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

Operations: load.

API path: `/model/fetch-model-info/{model_code}`

#### ModelResult

| Field | Description |
| --- | --- |
| `data` |  |
| `page` |  |
| `pagesize` |  |

Operations: create.

API path: `/model/fetch-result/{model_code}`

#### Prediction

| Field | Description |
| --- | --- |
| `columns` |  |
| `data` |  |

Operations: create.

API path: `/v1/prediction/model/{model_code}`



## Entities


### Dataset

Create an instance: `const dataset = client.Dataset()`

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

```ts
const dataset = await client.Dataset().create({
  name: 'example_name',
  usercode: 'example_usercode',
})
```


### DatasetFill

Create an instance: `const dataset_fill = client.DatasetFill()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `append` | `boolean` |  |
| `columns` | `any[]` |  |
| `compressed` | `boolean` |  |
| `datasetcode` | `string` |  |
| `details` | `Record<string, any>` |  |
| `insertdata` | `string` |  |
| `status` | `string` |  |
| `usercode` | `string` |  |

#### Example: Create

```ts
const dataset_fill = await client.DatasetFill().create({
  append: true,
  columns: [],
  compressed: true,
  datasetcode: 'example_datasetcode',
  insertdata: 'example_insertdata',
  usercode: 'example_usercode',
})
```


### ModelInfo

Create an instance: `const model_info = client.ModelInfo()`

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
| `properties` | `Record<string, any>` |  |
| `updated_at` | `string` |  |

#### Example: Load

```ts
const model_info = await client.ModelInfo().load({ model_code: 'model_code' })
```


### ModelResult

Create an instance: `const model_result = client.ModelResult()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `data` | `any[]` |  |
| `page` | `number` |  |
| `pagesize` | `number` |  |

#### Example: Create

```ts
const model_result = await client.ModelResult().create({
  model_code: 'example_model_code',
})
```


### Prediction

Create an instance: `const prediction = client.Prediction()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `columns` | `any[]` |  |
| `data` | `any[]` |  |

#### Example: Create

```ts
const prediction = await client.Prediction().create({
  model_code: 'example_model_code',
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

Features are the extension mechanism. A feature is an object with a
`hooks` map. Each hook key is a pipeline stage name, and the value is
a function that receives the context.

The SDK ships with built-in features:

- **TestFeature**: In-memory mock transport for testing without a live server

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Module structure

```
graphite-note/
├── src/
│   ├── GraphiteNoteSDK.ts        # Main SDK class
│   ├── entity/             # Entity implementations
│   ├── feature/            # Built-in features (Base, Test, Log)
│   └── utility/            # Utility functions
├── test/                   # Test suites
└── dist/                   # Compiled output
```

Import the SDK from the package root:

```ts
import { GraphiteNoteSDK } from '@voxgig-sdk/graphite-note'
```

### Entity state

Entity instances are stateful. After a successful `load`, the entity
stores the returned data and match criteria internally. Subsequent
calls on the same instance can rely on this state.

```ts
const modelinfo = client.ModelInfo()
await modelinfo.load({ model_code: "example" })

// modelinfo.data() now returns the modelinfo data from the last `load`
// modelinfo.match() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

The `direct` method gives full control over the HTTP request. Use it
for non-standard endpoints, bulk operations, or any path not modelled
as an entity. The `prepare` method is useful for debugging — it
shows exactly what `direct` would send.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
