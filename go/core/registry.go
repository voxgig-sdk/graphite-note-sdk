package core

var UtilityRegistrar func(u *Utility)

var NewBaseFeatureFunc func() Feature

var NewDebugFeatureFunc func() Feature

var NewIdempotencyFeatureFunc func() Feature

var NewMetricsFeatureFunc func() Feature

var NewPagingFeatureFunc func() Feature

var NewRatelimitFeatureFunc func() Feature

var NewRetryFeatureFunc func() Feature

var NewTestFeatureFunc func() Feature

var NewTimeoutFeatureFunc func() Feature

var NewDatasetEntityFunc func(client *GraphiteNoteSDK, entopts map[string]any) GraphiteNoteEntity

var NewDatasetFillEntityFunc func(client *GraphiteNoteSDK, entopts map[string]any) GraphiteNoteEntity

var NewModelInfoEntityFunc func(client *GraphiteNoteSDK, entopts map[string]any) GraphiteNoteEntity

var NewModelResultEntityFunc func(client *GraphiteNoteSDK, entopts map[string]any) GraphiteNoteEntity

var NewPredictionEntityFunc func(client *GraphiteNoteSDK, entopts map[string]any) GraphiteNoteEntity

