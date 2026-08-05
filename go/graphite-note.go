package voxgiggraphitenotesdk

import (
	"github.com/voxgig-sdk/graphite-note-sdk/go/core"
	"github.com/voxgig-sdk/graphite-note-sdk/go/entity"
	"github.com/voxgig-sdk/graphite-note-sdk/go/feature"
	_ "github.com/voxgig-sdk/graphite-note-sdk/go/utility"
)

// Type aliases preserve external API.
type GraphiteNoteSDK = core.GraphiteNoteSDK
type Context = core.Context
type Utility = core.Utility
type Feature = core.Feature
type Entity = core.Entity
type GraphiteNoteEntity = core.GraphiteNoteEntity
type FetcherFunc = core.FetcherFunc
type Spec = core.Spec
type Result = core.Result
type Response = core.Response
type Operation = core.Operation
type Control = core.Control
type GraphiteNoteError = core.GraphiteNoteError

// BaseFeature from feature package.
type BaseFeature = feature.BaseFeature

func init() {
	core.NewBaseFeatureFunc = func() core.Feature {
		return feature.NewBaseFeature()
	}
	core.NewTestFeatureFunc = func() core.Feature {
		return feature.NewTestFeature()
	}
	core.NewDatasetEntityFunc = func(client *core.GraphiteNoteSDK, entopts map[string]any) core.GraphiteNoteEntity {
		return entity.NewDatasetEntity(client, entopts)
	}
	core.NewDatasetFillEntityFunc = func(client *core.GraphiteNoteSDK, entopts map[string]any) core.GraphiteNoteEntity {
		return entity.NewDatasetFillEntity(client, entopts)
	}
	core.NewModelInfoEntityFunc = func(client *core.GraphiteNoteSDK, entopts map[string]any) core.GraphiteNoteEntity {
		return entity.NewModelInfoEntity(client, entopts)
	}
	core.NewModelResultEntityFunc = func(client *core.GraphiteNoteSDK, entopts map[string]any) core.GraphiteNoteEntity {
		return entity.NewModelResultEntity(client, entopts)
	}
	core.NewPredictionEntityFunc = func(client *core.GraphiteNoteSDK, entopts map[string]any) core.GraphiteNoteEntity {
		return entity.NewPredictionEntity(client, entopts)
	}
}

// Constructor re-exports.
var NewGraphiteNoteSDK = core.NewGraphiteNoteSDK
var TestSDK = core.TestSDK
var NewContext = core.NewContext
var NewSpec = core.NewSpec
var NewResult = core.NewResult
var NewResponse = core.NewResponse
var NewOperation = core.NewOperation
var MakeConfig = core.MakeConfig

// No-arg convenience constructors. Go has no default-argument syntax,
// so these aliases let callers write `sdk.New()` / `sdk.Test()`
// instead of `sdk.NewGraphiteNoteSDK(nil)` / `sdk.TestSDK(nil, nil)`
// for the common no-options case.
func New() *GraphiteNoteSDK  { return NewGraphiteNoteSDK(nil) }
func Test() *GraphiteNoteSDK { return TestSDK(nil, nil) }
var NewBaseFeature = feature.NewBaseFeature
var NewTestFeature = feature.NewTestFeature
