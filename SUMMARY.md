# Graphite Note API

Graphite Note (graphite-note.com) no-code predictive analytics: the Dataset API (create/fill/complete datasets), the Prediction API (v1 alias-based, v2 column-based, and timeseries forecasting), the Model Results API (paginated result tables) and the Model Info API (model metadata for MLOps/auditing). This definition was authored by Voxgig from Graphite Note&#39;s public developer documentation (docs.graphite-note.com, REST API section), no first-party OpenAPI definition is published. Shapes mirror the documented examples exactly; replace with a first-party definition if one becomes available. Rate limits: 10 requests/min per tenant, 200/min global; 429 on excess. Custom 44x business statuses: 441 plan limit, 442 email exists, 443 trial finished, 445 model creation limit.

## Start here

This guide introduces the API, the client libraries, and the companion tools in this repository. Start with the API capabilities, choose a client for your application, and use the linked reference when you need exact request and response details.

The selected API surface contains 5 entities and 7 HTTP routes. There are 6 SDK targets and 2 companion tools.

An entity groups related API operations. An operation can have several routes with different inputs or authentication requirements. The SDK exposes the entity and its operations using the conventions of the selected language.

## What the API provides

### [Dataset](docs/api/dataset.html)

Results: Success.

SDK operations: `create`.

Key fields to recognise:

- `columns`: Number of columns created.
- `datasetcode`: Unique code assigned to the created dataset.
- `name`: Human-readable dataset name.
- `tablename`: Backing table name, for example
- `usercode`: Unique code identifying the user.

### [DatasetFill](docs/api/dataset_fill.html)

Results: Success.

SDK operations: `create`.

Key fields to recognise:

- `append`: True to append to existing rows; false to truncate the dataset first.
- `compressed`: True when insert-data is gzip+base64; false when it is a JSON-escaped string.
- `insertdata`: The rows to insert, as a STRING: a JSON-escaped array-of-arrays when compressed is false, or gzipped-then-base64 when compressed is true.
- `status`: &#39;success&#39; on success.

### [ModelInfo](docs/api/model_info.html)

Results: Success.

SDK operations: `load`.

Key fields to recognise:

- `code`: Model code (Settings tab, ID section).
- `dataset_code`: Code of the dataset the model is trained on.
- `model_name`: Model type name, for example &#39;RFM Customer Segmentation&#39;.
- `name`: User-given model name.
- `properties`: Full model configuration and structured metadata (excluding bulky training artifacts); shape differs by model type (RFM, CLV, ABC, ...).

### [ModelResult](docs/api/model_result.html)

Results: A page of result rows.

SDK operations: `create`.

Key fields to recognise:

- `page`: Page number for paginated results.
- `pagesize`: Rows per page.

### [Prediction](docs/api/prediction.html)

Results: Prediction results. Timeseries models answer &#123;data: [TimeseriesPoint...]&#125; instead.; Success.

SDK operations: `create`.

Key fields to recognise:

- `columns`: Column names associated with each prediction row.

### Route map

Use this map to locate a capability. Consult the entity reference before supplying request data; routes for the same operation can require different fields.

| Entity | SDK operation | HTTP route | Authentication |
| --- | --- | --- | --- |
| [Dataset](docs/api/dataset.html) | `create` | `POST /dataset-create` | Required |
| [DatasetFill](docs/api/dataset_fill.html) | `create` | `POST /dataset-complete` | Required |
| [DatasetFill](docs/api/dataset_fill.html) | `create` | `POST /dataset-fill` | Required |
| [ModelInfo](docs/api/model_info.html) | `load` | `GET /model/fetch-model-info/{model_code}` | Required |
| [ModelResult](docs/api/model_result.html) | `create` | `POST /model/fetch-result/{model_code}` | Required |
| [Prediction](docs/api/prediction.html) | `create` | `POST /v1/prediction/model/{model_code}` | Required |
| [Prediction](docs/api/prediction.html) | `create` | `POST /v2/prediction/model/{model_code}` | Required |

## Connect to the API

- Production. The Bearer tenant token comes from the in-app Account Info page.: `https://app.graphite-note.com/api`

The default credential is sent in the `Authorization` header with the `Bearer` prefix.

Tenant token from the Graphite Note app&#39;s Account Info page.

Check authentication for the route you plan to call. A route that declares no authentication can be used without credentials; this does not change the requirements of other routes. Keep credentials in environment variables or a configured secret provider, and keep them out of source control and logs.

## Make a first request

1. Choose the API server and an operation that matches your task.
2. Check the operation’s required input and authentication. Use values valid for your account and environment.
3. Send one request and inspect the returned data before adding retries, concurrency, or a larger batch.

For an SDK call, install or build the chosen client, create a client instance with its documented configuration, and call the required entity operation. Language references describe the argument shape, asynchronous behaviour, and returned values.

## Choose an SDK

Choose the language already used by your application or service. The clients represent the same API model, while package setup, naming, and return types follow each language. Check the selected client’s reference and tests before integrating it into an existing application.

| Client | Repository directory | Distribution |
| --- | --- | --- |
| [Golang](docs/sdks/go.html) | `go/` | Build from source |
| [Lua](docs/sdks/lua.html) | `lua/` | Build from source |
| [PHP](docs/sdks/php.html) | `php/` | Build from source |
| [Python](docs/sdks/py.html) | `py/` | Build from source |
| [Ruby](docs/sdks/rb.html) | `rb/` | Build from source |
| [TypeScript](docs/sdks/ts.html) | `ts/` | Build from source |

Build-from-source entries are not marked as published in the project model. Follow the build instructions in that target’s README, then consume the resulting package using your language’s local dependency mechanism. Published entries give the installation command recorded for that client.

## Companion tools

These targets provide another way to use the API. Their available commands or tools can cover a smaller set of operations than the client libraries.

### [Go CLI](docs/tools/go-cli.html)

Use the command-line interface for shell-based tasks and scripts.

Repository directory: `go-cli/`. Not published. Build from the go-cli directory.


### [Go MCP server](docs/tools/go-mcp.html)

Use the MCP server to expose supported API operations to an MCP client.

Repository directory: `go-mcp/`. Not published. Build from the go-mcp directory.

- `graphite-note_list`: List records for an entity. No active entity supports this operation.
- `graphite-note_load`: Load one record for an entity. Supported entities: `model_info`.

## Operational features

Features supply behaviour around API calls, such as request handling, diagnostics, or local testing. Inclusion in this project does not mean a feature is enabled at runtime. Check the selected SDK’s supported features and configuration defaults, then enable the behaviour your application needs.

- [`debug`](docs/features/debug.html): Request/response capture ring buffer for debugging
- [`idempotency`](docs/features/idempotency.html): Idempotency keys for safe retries of mutating operations
- [`metrics`](docs/features/metrics.html): Statistics capture: per-operation counters and latency
- [`paging`](docs/features/paging.html): Pagination signals for list operations
- [`ratelimit`](docs/features/ratelimit.html): Client-side rate limiting via a token bucket
- [`retry`](docs/features/retry.html): Automatic retry of transient failures with exponential backoff
- [`test`](docs/features/test.html): In-memory mock transport for testing without a live server
- [`timeout`](docs/features/timeout.html): Per-request timeout with transport abort

Start with the default client configuration. Add request limits and diagnostics as needed, test error paths, and review retry behaviour before using operations that change data. A retry can repeat an operation unless the API provides a suitable guarantee.

## Continue with the documentation

- Follow the [first-call guide](docs/guides/first-call.html) for the setup sequence.
- Read the [authentication guide](docs/guides/authentication.html) before using protected routes.
- Use the [API reference](docs/api/index.html) for request schemas, response formats, and status codes.
- Check the chosen SDK or companion tool reference for its configuration and supported operations.

