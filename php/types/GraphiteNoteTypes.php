<?php
declare(strict_types=1);

// Typed models for the GraphiteNote SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
//
// These are documentation-grade value objects (PHP 8 typed properties),
// registered on the composer classmap autoload. The SDK boundary exchanges
// assoc-arrays; these classes name the shapes for tooling and typed callers.

/** Dataset entity data model. */
class Dataset
{
    public ?int $column = null;
    public ?string $dataset_code = null;
    public string $name;
    public ?string $table_name = null;
    public string $user_code;
}

/** Request payload for Dataset#create. */
class DatasetCreateData
{
    public ?int $column = null;
    public ?string $dataset_code = null;
    public string $name;
    public ?string $table_name = null;
    public string $user_code;
}

/** DatasetFill entity data model. */
class DatasetFill
{
    public bool $append;
    public array $column;
    public bool $compressed;
    public string $dataset_code;
    public ?array $detail = null;
    public string $insert_data;
    public ?string $status = null;
    public string $user_code;
}

/** Request payload for DatasetFill#create. */
class DatasetFillCreateData
{
    public bool $append;
    public array $column;
    public bool $compressed;
    public string $dataset_code;
    public ?array $detail = null;
    public string $insert_data;
    public ?string $status = null;
    public string $user_code;
}

/** ModelInfo entity data model. */
class ModelInfo
{
    public ?string $code = null;
    public ?string $created_at = null;
    public ?string $dataset_code = null;
    public ?string $model_name = null;
    public ?string $name = null;
    public ?array $property = null;
    public ?string $updated_at = null;
}

/** Request payload for ModelInfo#load. */
class ModelInfoLoadMatch
{
    public string $model_code;
}

/** ModelResult entity data model. */
class ModelResult
{
    public ?array $data = null;
    public ?int $page = null;
    public ?int $page_size = null;
}

/** Request payload for ModelResult#create. */
class ModelResultCreateData
{
    public string $model_code;
    public ?array $data = null;
    public ?int $page = null;
    public ?int $page_size = null;
}

/** Prediction entity data model. */
class Prediction
{
    public ?array $column = null;
    public ?array $data = null;
}

/** Request payload for Prediction#create. */
class PredictionCreateData
{
    public string $model_code;
    public ?array $column = null;
    public ?array $data = null;
}

