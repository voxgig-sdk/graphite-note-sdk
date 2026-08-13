# Typed models for the GraphiteNote SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
# params (op.<name>.points[].args.params[]). Field/param types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Do not edit by hand.
#
# These are TypedDicts, not dataclasses: the SDK ops return/accept plain dicts
# at runtime, and a TypedDict IS a dict shape, so the types match the runtime.
# Optional (req:false) keys are modelled as TypedDict key-optionality
# (total=False), split into a required base + total=False subclass when a type
# has both required and optional keys.

from __future__ import annotations

from typing import TypedDict, Any


class DatasetRequired(TypedDict):
    name: str
    usercode: str


class Dataset(DatasetRequired, total=False):
    columns: int
    datasetcode: str
    tablename: str


class DatasetCreateDataRequired(TypedDict):
    name: str
    usercode: str


class DatasetCreateData(DatasetCreateDataRequired, total=False):
    columns: int
    datasetcode: str
    tablename: str


class DatasetFillRequired(TypedDict):
    append: bool
    columns: list
    compressed: bool
    datasetcode: str
    insertdata: str
    usercode: str


class DatasetFill(DatasetFillRequired, total=False):
    details: dict
    status: str


class DatasetFillCreateDataRequired(TypedDict):
    append: bool
    columns: list
    compressed: bool
    datasetcode: str
    insertdata: str
    usercode: str


class DatasetFillCreateData(DatasetFillCreateDataRequired, total=False):
    details: dict
    status: str


class ModelInfo(TypedDict, total=False):
    code: str
    created_at: str
    dataset_code: str
    model_name: str
    name: str
    properties: dict
    updated_at: str


class ModelInfoLoadMatch(TypedDict):
    model_code: str


class ModelResult(TypedDict, total=False):
    data: list
    page: int
    pagesize: int


class ModelResultCreateDataRequired(TypedDict):
    model_code: str


class ModelResultCreateData(ModelResultCreateDataRequired, total=False):
    data: list
    page: int
    pagesize: int


class Prediction(TypedDict, total=False):
    columns: list
    data: list


class PredictionCreateDataRequired(TypedDict):
    model_code: str


class PredictionCreateData(PredictionCreateDataRequired, total=False):
    columns: list
    data: list
