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
    public ?int $columns = null;
    public ?string $datasetcode = null;
    public string $name;
    public ?string $tablename = null;
    public string $usercode;
}

/** Request payload for Dataset#create. */
class DatasetCreateData
{
    public ?int $columns = null;
    public ?string $datasetcode = null;
    public string $name;
    public ?string $tablename = null;
    public string $usercode;
}

/** DatasetFill entity data model. */
class DatasetFill
{
    public bool $append;
    public array $columns;
    public bool $compressed;
    public string $datasetcode;
    public ?array $details = null;
    public string $insertdata;
    public ?string $status = null;
    public string $usercode;
}

/** Request payload for DatasetFill#create. */
class DatasetFillCreateData
{
    public bool $append;
    public array $columns;
    public bool $compressed;
    public string $datasetcode;
    public ?array $details = null;
    public string $insertdata;
    public ?string $status = null;
    public string $usercode;
}

/** ModelInfo entity data model. */
class ModelInfo
{
    public ?string $code = null;
    public ?string $created_at = null;
    public ?string $dataset_code = null;
    public ?string $model_name = null;
    public ?string $name = null;
    public ?array $properties = null;
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
    public ?int $pagesize = null;
}

/** Request payload for ModelResult#create. */
class ModelResultCreateData
{
    public string $model_code;
    public ?array $data = null;
    public ?int $page = null;
    public ?int $pagesize = null;
}

/** Prediction entity data model. */
class Prediction
{
    public ?array $columns = null;
    public ?array $data = null;
}

/** Request payload for Prediction#create. */
class PredictionCreateData
{
    public string $model_code;
    public ?array $columns = null;
    public ?array $data = null;
}

