# GraphiteNote TypeScript SDK Reference

Complete API reference for the GraphiteNote TypeScript SDK.


## GraphiteNoteSDK

### Constructor

```ts
new GraphiteNoteSDK(options?: object)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `object` | SDK configuration options. |
| `options.apikey` | `string` | API key for authentication. |
| `options.base` | `string` | Base URL for API requests. |
| `options.prefix` | `string` | URL prefix appended after base. |
| `options.suffix` | `string` | URL suffix appended after path. |
| `options.headers` | `object` | Custom headers for all requests. |
| `options.feature` | `object` | Feature configuration. |
| `options.system` | `object` | System overrides (e.g. custom fetch). |


### Static Methods

#### `GraphiteNoteSDK.test(testopts?, sdkopts?)`

Create a test client with mock features active.

```ts
const client = GraphiteNoteSDK.test()
```

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `testopts` | `object` | Test feature options. |
| `sdkopts` | `object` | Additional SDK options merged with test defaults. |

**Returns:** `GraphiteNoteSDK` instance in test mode.


### Instance Methods

#### `Dataset(data?: object)`

Create a new `Dataset` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `DatasetEntity` instance.

#### `DatasetFill(data?: object)`

Create a new `DatasetFill` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `DatasetFillEntity` instance.

#### `ModelInfo(data?: object)`

Create a new `ModelInfo` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `ModelInfoEntity` instance.

#### `ModelResult(data?: object)`

Create a new `ModelResult` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `ModelResultEntity` instance.

#### `Prediction(data?: object)`

Create a new `Prediction` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `PredictionEntity` instance.

#### `options()`

Return a deep copy of the current SDK options.

**Returns:** `object`

#### `utility()`

Return a copy of the SDK utility object.

**Returns:** `object`

#### `direct(fetchargs?: object)`

Make a direct HTTP request to any API endpoint.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs.path` | `string` | URL path with optional `{param}` placeholders. |
| `fetchargs.method` | `string` | HTTP method (default: `GET`). |
| `fetchargs.params` | `object` | Path parameter values for `{param}` substitution. |
| `fetchargs.query` | `object` | Query string parameters. |
| `fetchargs.headers` | `object` | Request headers (merged with defaults). |
| `fetchargs.body` | `any` | Request body (objects are JSON-serialized). |
| `fetchargs.ctrl` | `object` | Control options (e.g. `{ explain: true }`). |

**Returns:** `Promise<{ ok, status, headers, data } | Error>`

#### `prepare(fetchargs?: object)`

Prepare a fetch definition without sending the request. Accepts the
same parameters as `direct()`.

**Returns:** `Promise<{ url, method, headers, body } | Error>`

#### `tester(testopts?, sdkopts?)`

Alias for `GraphiteNoteSDK.test()`.

**Returns:** `GraphiteNoteSDK` instance in test mode.


---

## DatasetEntity

```ts
const dataset = client.Dataset()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `column` | `number` | No |  |
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

#### `create(data: object, ctrl?: object)`

Create a new entity with the given data.

```ts
const result = await client.Dataset().create({
  name: 'example_name',
  user_code: 'example_user_code',
})
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `DatasetEntity` instance with the same client and
options.

#### `client()`

Return the parent `GraphiteNoteSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## DatasetFillEntity

```ts
const dataset_fill = client.DatasetFill()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `append` | `boolean` | Yes |  |
| `column` | `any[]` | Yes |  |
| `compressed` | `boolean` | Yes |  |
| `dataset_code` | `string` | Yes |  |
| `detail` | `Record<string, any>` | No |  |
| `insert_data` | `string` | Yes |  |
| `status` | `string` | No |  |
| `user_code` | `string` | Yes |  |

### Operations

#### `create(data: object, ctrl?: object)`

Create a new entity with the given data.

```ts
const result = await client.DatasetFill().create({
  append: true,
  column: [],
  compressed: true,
  dataset_code: 'example_dataset_code',
  insert_data: 'example_insert_data',
  user_code: 'example_user_code',
})
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `DatasetFillEntity` instance with the same client and
options.

#### `client()`

Return the parent `GraphiteNoteSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## ModelInfoEntity

```ts
const model_info = client.ModelInfo()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | `string` | No |  |
| `created_at` | `string` | No |  |
| `dataset_code` | `string` | No |  |
| `model_name` | `string` | No |  |
| `name` | `string` | No |  |
| `property` | `Record<string, any>` | No |  |
| `updated_at` | `string` | No |  |

### Operations

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria.

```ts
const result = await client.ModelInfo().load({ model_code: 'model_code' })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `ModelInfoEntity` instance with the same client and
options.

#### `client()`

Return the parent `GraphiteNoteSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## ModelResultEntity

```ts
const model_result = client.ModelResult()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | `any[]` | No |  |
| `page` | `number` | No |  |
| `page_size` | `number` | No |  |

### Operations

#### `create(data: object, ctrl?: object)`

Create a new entity with the given data.

```ts
const result = await client.ModelResult().create({
  model_code: 'example_model_code',
})
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `ModelResultEntity` instance with the same client and
options.

#### `client()`

Return the parent `GraphiteNoteSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## PredictionEntity

```ts
const prediction = client.Prediction()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `column` | `any[]` | No |  |
| `data` | `any[]` | No |  |

### Field Usage by Operation

| Field | create |
| --- | --- |
| `column` | - |
| `data` | Yes |

### Operations

#### `create(data: object, ctrl?: object)`

Create a new entity with the given data.

```ts
const result = await client.Prediction().create({
  model_code: 'example_model_code',
})
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `PredictionEntity` instance with the same client and
options.

#### `client()`

Return the parent `GraphiteNoteSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## Features

| Feature | Version | Description |
| --- | --- | --- |
| `test` | 0.0.1 | In-memory mock transport for testing without a live server |


Features are activated via the `feature` option:

```ts
const client = new GraphiteNoteSDK({
  feature: {
    test: { active: true },
  }
})
```

