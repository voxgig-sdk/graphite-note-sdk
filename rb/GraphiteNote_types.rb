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
# @!attribute [rw] columns
#   @return [Integer, nil]
#
# @!attribute [rw] datasetcode
#   @return [String, nil]
#
# @!attribute [rw] name
#   @return [String]
#
# @!attribute [rw] tablename
#   @return [String, nil]
#
# @!attribute [rw] usercode
#   @return [String]
Dataset = Struct.new(
  :columns,
  :datasetcode,
  :name,
  :tablename,
  :usercode,
  keyword_init: true
)

# Request payload for Dataset#create.
#
# @!attribute [rw] columns
#   @return [Integer, nil]
#
# @!attribute [rw] datasetcode
#   @return [String, nil]
#
# @!attribute [rw] name
#   @return [String]
#
# @!attribute [rw] tablename
#   @return [String, nil]
#
# @!attribute [rw] usercode
#   @return [String]
DatasetCreateData = Struct.new(
  :columns,
  :datasetcode,
  :name,
  :tablename,
  :usercode,
  keyword_init: true
)

# DatasetFill entity data model.
#
# @!attribute [rw] append
#   @return [Boolean]
#
# @!attribute [rw] columns
#   @return [Array]
#
# @!attribute [rw] compressed
#   @return [Boolean]
#
# @!attribute [rw] datasetcode
#   @return [String]
#
# @!attribute [rw] details
#   @return [Hash, nil]
#
# @!attribute [rw] insertdata
#   @return [String]
#
# @!attribute [rw] status
#   @return [String, nil]
#
# @!attribute [rw] usercode
#   @return [String]
DatasetFill = Struct.new(
  :append,
  :columns,
  :compressed,
  :datasetcode,
  :details,
  :insertdata,
  :status,
  :usercode,
  keyword_init: true
)

# Request payload for DatasetFill#create.
#
# @!attribute [rw] append
#   @return [Boolean]
#
# @!attribute [rw] columns
#   @return [Array]
#
# @!attribute [rw] compressed
#   @return [Boolean]
#
# @!attribute [rw] datasetcode
#   @return [String]
#
# @!attribute [rw] details
#   @return [Hash, nil]
#
# @!attribute [rw] insertdata
#   @return [String]
#
# @!attribute [rw] status
#   @return [String, nil]
#
# @!attribute [rw] usercode
#   @return [String]
DatasetFillCreateData = Struct.new(
  :append,
  :columns,
  :compressed,
  :datasetcode,
  :details,
  :insertdata,
  :status,
  :usercode,
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
# @!attribute [rw] properties
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
  :properties,
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
# @!attribute [rw] pagesize
#   @return [Integer, nil]
ModelResult = Struct.new(
  :data,
  :page,
  :pagesize,
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
# @!attribute [rw] pagesize
#   @return [Integer, nil]
ModelResultCreateData = Struct.new(
  :model_code,
  :data,
  :page,
  :pagesize,
  keyword_init: true
)

# Prediction entity data model.
#
# @!attribute [rw] columns
#   @return [Array, nil]
#
# @!attribute [rw] data
#   @return [Array, nil]
Prediction = Struct.new(
  :columns,
  :data,
  keyword_init: true
)

# Request payload for Prediction#create.
#
# @!attribute [rw] model_code
#   @return [String]
#
# @!attribute [rw] columns
#   @return [Array, nil]
#
# @!attribute [rw] data
#   @return [Array, nil]
PredictionCreateData = Struct.new(
  :model_code,
  :columns,
  :data,
  keyword_init: true
)

