// Typed models for the GraphiteNote SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
package entity

import (
	"encoding/json"

	"github.com/voxgig-sdk/graphite-note-sdk/go/core"
)

// Dataset is the typed data model for the dataset entity.
type Dataset struct {
	Columns *int `json:"columns,omitempty"`
	Datasetcode *string `json:"datasetcode,omitempty"`
	Name string `json:"name"`
	Tablename *string `json:"tablename,omitempty"`
	Usercode string `json:"usercode"`
}

// DatasetCreateData is the typed request payload for Dataset.CreateTyped.
type DatasetCreateData struct {
	Columns *int `json:"columns,omitempty"`
	Datasetcode *string `json:"datasetcode,omitempty"`
	Name string `json:"name"`
	Tablename *string `json:"tablename,omitempty"`
	Usercode string `json:"usercode"`
}

// DatasetFill is the typed data model for the dataset_fill entity.
type DatasetFill struct {
	Append bool `json:"append"`
	Columns []any `json:"columns"`
	Compressed bool `json:"compressed"`
	Datasetcode string `json:"datasetcode"`
	Details *map[string]any `json:"details,omitempty"`
	Insertdata string `json:"insertdata"`
	Status *string `json:"status,omitempty"`
	Usercode string `json:"usercode"`
}

// DatasetFillCreateData is the typed request payload for DatasetFill.CreateTyped.
type DatasetFillCreateData struct {
	Append bool `json:"append"`
	Columns []any `json:"columns"`
	Compressed bool `json:"compressed"`
	Datasetcode string `json:"datasetcode"`
	Details *map[string]any `json:"details,omitempty"`
	Insertdata string `json:"insertdata"`
	Status *string `json:"status,omitempty"`
	Usercode string `json:"usercode"`
}

// ModelInfo is the typed data model for the model_info entity.
type ModelInfo struct {
	Code *string `json:"code,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	DatasetCode *string `json:"dataset_code,omitempty"`
	ModelName *string `json:"model_name,omitempty"`
	Name *string `json:"name,omitempty"`
	Properties *map[string]any `json:"properties,omitempty"`
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
	Pagesize *int `json:"pagesize,omitempty"`
}

// ModelResultCreateData is the typed request payload for ModelResult.CreateTyped.
type ModelResultCreateData struct {
	ModelCode string `json:"model_code"`
	Data *[]any `json:"data,omitempty"`
	Page *int `json:"page,omitempty"`
	Pagesize *int `json:"pagesize,omitempty"`
}

// Prediction is the typed data model for the prediction entity.
type Prediction struct {
	Columns *[]any `json:"columns,omitempty"`
	Data *[]any `json:"data,omitempty"`
}

// PredictionCreateData is the typed request payload for Prediction.CreateTyped.
type PredictionCreateData struct {
	ModelCode string `json:"model_code"`
	Columns *[]any `json:"columns,omitempty"`
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

// entityData unwraps an entity to its data map.
//
// Operations resolve to the ENTITY, not the raw data (see AGENTS.md), and an
// entity's fields are UNEXPORTED — marshalling one directly yields `{}`, so
// every typed accessor would silently hand back a zero-valued struct. The
// typed boundary therefore takes the data hop first.
func entityData(v any) any {
	if ent, ok := v.(core.Entity); ok {
		return ent.Data()
	}
	return v
}

// typedFrom decodes a runtime value (an entity, or the map[string]any the op
// pipeline produced) into a typed model T via a JSON round-trip. On any error
// it returns the zero value of T; the op's own (value, error) tuple carries
// the real error.
func typedFrom[T any](v any) T {
	var out T
	v = entityData(v)
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

// typedSliceFrom decodes a runtime list value into a typed slice []T via a
// JSON round-trip, for list ops. `list` resolves to a slice of ENTITY
// instances, so each element takes the data hop.
func typedSliceFrom[T any](v any) []T {
	var out []T
	if v == nil {
		return out
	}
	if list, ok := v.([]any); ok {
		unwrapped := make([]any, 0, len(list))
		for _, item := range list {
			unwrapped = append(unwrapped, entityData(item))
		}
		v = unwrapped
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}
