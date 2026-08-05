-- Typed models for the GraphiteNote SDK (LuaLS annotations).
--
-- GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
-- params (op.<name>.points[].args.params[]). Field/param types come from the
-- canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
-- @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
-- edit by hand.

---@class Dataset
---@field column? number
---@field dataset_code? string
---@field name string
---@field table_name? string
---@field user_code string

---@class DatasetCreateData
---@field column? number
---@field dataset_code? string
---@field name string
---@field table_name? string
---@field user_code string

---@class DatasetFill
---@field append boolean
---@field column table
---@field compressed boolean
---@field dataset_code string
---@field detail? table
---@field insert_data string
---@field status? string
---@field user_code string

---@class DatasetFillCreateData
---@field append boolean
---@field column table
---@field compressed boolean
---@field dataset_code string
---@field detail? table
---@field insert_data string
---@field status? string
---@field user_code string

---@class ModelInfo
---@field code? string
---@field created_at? string
---@field dataset_code? string
---@field model_name? string
---@field name? string
---@field property? table
---@field updated_at? string

---@class ModelInfoLoadMatch
---@field model_code string

---@class ModelResult
---@field data? table
---@field page? number
---@field page_size? number

---@class ModelResultCreateData
---@field model_code string
---@field data? table
---@field page? number
---@field page_size? number

---@class Prediction
---@field column? table
---@field data? table

---@class PredictionCreateData
---@field model_code string
---@field column? table
---@field data? table

local M = {}

return M
