// Typed models for the GraphiteNote SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Dataset {
  column?: number
  dataset_code?: string
  name: string
  table_name?: string
  user_code: string
}

export interface DatasetCreateData {
  column?: number
  dataset_code?: string
  name: string
  table_name?: string
  user_code: string
}

export interface DatasetFill {
  append: boolean
  column: any[]
  compressed: boolean
  dataset_code: string
  detail?: Record<string, any>
  insert_data: string
  status?: string
  user_code: string
}

export interface DatasetFillCreateData {
  append: boolean
  column: any[]
  compressed: boolean
  dataset_code: string
  detail?: Record<string, any>
  insert_data: string
  status?: string
  user_code: string
}

export interface ModelInfo {
  code?: string
  created_at?: string
  dataset_code?: string
  model_name?: string
  name?: string
  property?: Record<string, any>
  updated_at?: string
}

export interface ModelInfoLoadMatch {
  model_code: string
}

export interface ModelResult {
  data?: any[]
  page?: number
  page_size?: number
}

export interface ModelResultCreateData {
  model_code: string
  data?: any[]
  page?: number
  page_size?: number
}

export interface Prediction {
  column?: any[]
  data?: any[]
}

export interface PredictionCreateData {
  model_code: string
  column?: any[]
  data?: any[]
}

