# frozen_string_literal: true

# Typed models for the GraphiteNote SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
# params (op.<name>.points[].args.params[]). Member types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Ruby types are unenforced; these YARD
# annotations document the shapes. Do not edit by hand.

# Dataset entity data model.
#
# @!attribute [rw] column
#   @return [Integer, nil]
#
# @!attribute [rw] dataset_code
#   @return [String, nil]
#
# @!attribute [rw] name
#   @return [String]
#
# @!attribute [rw] table_name
#   @return [String, nil]
#
# @!attribute [rw] user_code
#   @return [String]
Dataset = Struct.new(
  :column,
  :dataset_code,
  :name,
  :table_name,
  :user_code,
  keyword_init: true
)

# Request payload for Dataset#create.
#
# @!attribute [rw] column
#   @return [Integer, nil]
#
# @!attribute [rw] dataset_code
#   @return [String, nil]
#
# @!attribute [rw] name
#   @return [String]
#
# @!attribute [rw] table_name
#   @return [String, nil]
#
# @!attribute [rw] user_code
#   @return [String]
DatasetCreateData = Struct.new(
  :column,
  :dataset_code,
  :name,
  :table_name,
  :user_code,
  keyword_init: true
)

# DatasetFill entity data model.
#
# @!attribute [rw] append
#   @return [Boolean]
#
# @!attribute [rw] column
#   @return [Array]
#
# @!attribute [rw] compressed
#   @return [Boolean]
#
# @!attribute [rw] dataset_code
#   @return [String]
#
# @!attribute [rw] detail
#   @return [Hash, nil]
#
# @!attribute [rw] insert_data
#   @return [String]
#
# @!attribute [rw] status
#   @return [String, nil]
#
# @!attribute [rw] user_code
#   @return [String]
DatasetFill = Struct.new(
  :append,
  :column,
  :compressed,
  :dataset_code,
  :detail,
  :insert_data,
  :status,
  :user_code,
  keyword_init: true
)

# Request payload for DatasetFill#create.
#
# @!attribute [rw] append
#   @return [Boolean]
#
# @!attribute [rw] column
#   @return [Array]
#
# @!attribute [rw] compressed
#   @return [Boolean]
#
# @!attribute [rw] dataset_code
#   @return [String]
#
# @!attribute [rw] detail
#   @return [Hash, nil]
#
# @!attribute [rw] insert_data
#   @return [String]
#
# @!attribute [rw] status
#   @return [String, nil]
#
# @!attribute [rw] user_code
#   @return [String]
DatasetFillCreateData = Struct.new(
  :append,
  :column,
  :compressed,
  :dataset_code,
  :detail,
  :insert_data,
  :status,
  :user_code,
  keyword_init: true
)

# ModelInfo entity data model.
#
# @!attribute [rw] code
#   @return [String, nil]
#
# @!attribute [rw] created_at
#   @return [String, nil]
#
# @!attribute [rw] dataset_code
#   @return [String, nil]
#
# @!attribute [rw] model_name
#   @return [String, nil]
#
# @!attribute [rw] name
#   @return [String, nil]
#
# @!attribute [rw] property
#   @return [Hash, nil]
#
# @!attribute [rw] updated_at
#   @return [String, nil]
ModelInfo = Struct.new(
  :code,
  :created_at,
  :dataset_code,
  :model_name,
  :name,
  :property,
  :updated_at,
  keyword_init: true
)

# Request payload for ModelInfo#load.
#
# @!attribute [rw] model_code
#   @return [String]
ModelInfoLoadMatch = Struct.new(
  :model_code,
  keyword_init: true
)

# ModelResult entity data model.
#
# @!attribute [rw] data
#   @return [Array, nil]
#
# @!attribute [rw] page
#   @return [Integer, nil]
#
# @!attribute [rw] page_size
#   @return [Integer, nil]
ModelResult = Struct.new(
  :data,
  :page,
  :page_size,
  keyword_init: true
)

# Request payload for ModelResult#create.
#
# @!attribute [rw] model_code
#   @return [String]
#
# @!attribute [rw] data
#   @return [Array, nil]
#
# @!attribute [rw] page
#   @return [Integer, nil]
#
# @!attribute [rw] page_size
#   @return [Integer, nil]
ModelResultCreateData = Struct.new(
  :model_code,
  :data,
  :page,
  :page_size,
  keyword_init: true
)

# Prediction entity data model.
#
# @!attribute [rw] column
#   @return [Array, nil]
#
# @!attribute [rw] data
#   @return [Array, nil]
Prediction = Struct.new(
  :column,
  :data,
  keyword_init: true
)

# Request payload for Prediction#create.
#
# @!attribute [rw] model_code
#   @return [String]
#
# @!attribute [rw] column
#   @return [Array, nil]
#
# @!attribute [rw] data
#   @return [Array, nil]
PredictionCreateData = Struct.new(
  :model_code,
  :column,
  :data,
  keyword_init: true
)

