// Typed models for the GraphiteNote SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
package entity

import "encoding/json"

// Dataset is the typed data model for the dataset entity.
type Dataset struct {
	Column *int `json:"column,omitempty"`
	DatasetCode *string `json:"dataset_code,omitempty"`
	Name string `json:"name"`
	TableName *string `json:"table_name,omitempty"`
	UserCode string `json:"user_code"`
}

// DatasetCreateData is the typed request payload for Dataset.CreateTyped.
type DatasetCreateData struct {
	Column *int `json:"column,omitempty"`
	DatasetCode *string `json:"dataset_code,omitempty"`
	Name string `json:"name"`
	TableName *string `json:"table_name,omitempty"`
	UserCode string `json:"user_code"`
}

// DatasetFill is the typed data model for the dataset_fill entity.
type DatasetFill struct {
	Append bool `json:"append"`
	Column []any `json:"column"`
	Compressed bool `json:"compressed"`
	DatasetCode string `json:"dataset_code"`
	Detail *map[string]any `json:"detail,omitempty"`
	InsertData string `json:"insert_data"`
	Status *string `json:"status,omitempty"`
	UserCode string `json:"user_code"`
}

// DatasetFillCreateData is the typed request payload for DatasetFill.CreateTyped.
type DatasetFillCreateData struct {
	Append bool `json:"append"`
	Column []any `json:"column"`
	Compressed bool `json:"compressed"`
	DatasetCode string `json:"dataset_code"`
	Detail *map[string]any `json:"detail,omitempty"`
	InsertData string `json:"insert_data"`
	Status *string `json:"status,omitempty"`
	UserCode string `json:"user_code"`
}

// ModelInfo is the typed data model for the model_info entity.
type ModelInfo struct {
	Code *string `json:"code,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	DatasetCode *string `json:"dataset_code,omitempty"`
	ModelName *string `json:"model_name,omitempty"`
	Name *string `json:"name,omitempty"`
	Property *map[string]any `json:"property,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
}

// ModelInfoLoadMatch is the typed request payload for ModelInfo.LoadTyped.
type ModelInfoLoadMatch struct {
	ModelCode string `json:"model_code"`
}

// ModelResult is the typed data model for the model_result entity.
type ModelResult struct {
	Data *[]any `json:"data,omitempty"`
	Page *int `json:"page,omitempty"`
	PageSize *int `json:"page_size,omitempty"`
}

// ModelResultCreateData is the typed request payload for ModelResult.CreateTyped.
type ModelResultCreateData struct {
	ModelCode string `json:"model_code"`
	Data *[]any `json:"data,omitempty"`
	Page *int `json:"page,omitempty"`
	PageSize *int `json:"page_size,omitempty"`
}

// Prediction is the typed data model for the prediction entity.
type Prediction struct {
	Column *[]any `json:"column,omitempty"`
	Data *[]any `json:"data,omitempty"`
}

// PredictionCreateData is the typed request payload for Prediction.CreateTyped.
type PredictionCreateData struct {
	ModelCode string `json:"model_code"`
	Column *[]any `json:"column,omitempty"`
	Data *[]any `json:"data,omitempty"`
}

// asMap turns a typed request/data struct into the map[string]any the
// runtime op pipeline consumes, honouring the json tags above.
func asMap(v any) map[string]any {
	out := map[string]any{}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// typedFrom decodes a runtime value (a map[string]any produced by the op
// pipeline) into a typed model T via a JSON round-trip. On any error it
// returns the zero value of T; the op's own (value, error) tuple carries the
// real error.
func typedFrom[T any](v any) T {
	var out T
	if v == nil {
		return out
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// typedSliceFrom decodes a runtime list value ([]any of maps) into a typed
// slice []T via a JSON round-trip, for list ops.
func typedSliceFrom[T any](v any) []T {
	var out []T
	if v == nil {
		return out
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}
