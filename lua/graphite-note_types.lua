-- Typed models for the GraphiteNote SDK (LuaLS annotations).
--
-- GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
-- params (op.<name>.points[].args.params[]). Field/param types come from the
-- canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
-- @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
-- edit by hand.

---@class Dataset
---@field columns? number
---@field datasetcode? string
---@field name string
---@field tablename? string
---@field usercode string

---@class DatasetCreateData
---@field columns? number
---@field datasetcode? string
---@field name string
---@field tablename? string
---@field usercode string

---@class DatasetFill
---@field append boolean
---@field columns table
---@field compressed boolean
---@field datasetcode string
---@field details? table
---@field insertdata string
---@field status? string
---@field usercode string

---@class DatasetFillCreateData
---@field append boolean
---@field columns table
---@field compressed boolean
---@field datasetcode string
---@field details? table
---@field insertdata string
---@field status? string
---@field usercode string

---@class ModelInfo
---@field code? string
---@field created_at? string
---@field dataset_code? string
---@field model_name? string
---@field name? string
---@field properties? table
---@field updated_at? string

---@class ModelInfoLoadMatch
---@field model_code string

---@class ModelResult
---@field data? table
---@field page? number
---@field pagesize? number

---@class ModelResultCreateData
---@field model_code string
---@field data? table
---@field page? number
---@field pagesize? number

---@class Prediction
---@field columns? table
---@field data? table

---@class PredictionCreateData
---@field model_code string
---@field columns? table
---@field data? table

local M = {}

return M
