# GraphiteNote SDK utility registration
require_relative '../core/utility_type'
require_relative 'clean'
require_relative 'done'
require_relative 'make_error'
require_relative 'feature_add'
require_relative 'feature_hook'
require_relative 'feature_init'
require_relative 'fetcher'
require_relative 'make_fetch_def'
require_relative 'make_context'
require_relative 'make_options'
require_relative 'make_request'
require_relative 'make_response'
require_relative 'make_result'
require_relative 'make_point'
require_relative 'make_spec'
require_relative 'make_url'
require_relative 'param'
require_relative 'prepare_auth'
require_relative 'prepare_body'
require_relative 'prepare_headers'
require_relative 'prepare_method'
require_relative 'prepare_params'
require_relative 'prepare_path'
require_relative 'prepare_query'
require_relative 'graphql'
require_relative 'result_basic'
require_relative 'result_body'
require_relative 'result_headers'
require_relative 'transform_request'
require_relative 'transform_response'

GraphiteNoteUtility.registrar = ->(u) {
  u.clean = GraphiteNoteUtilities::Clean
  u.done = GraphiteNoteUtilities::Done
  u.make_error = GraphiteNoteUtilities::MakeError
  u.feature_add = GraphiteNoteUtilities::FeatureAdd
  u.feature_hook = GraphiteNoteUtilities::FeatureHook
  u.feature_init = GraphiteNoteUtilities::FeatureInit
  u.fetcher = GraphiteNoteUtilities::Fetcher
  u.make_fetch_def = GraphiteNoteUtilities::MakeFetchDef
  u.make_context = GraphiteNoteUtilities::MakeContext
  u.make_options = GraphiteNoteUtilities::MakeOptions
  u.make_request = GraphiteNoteUtilities::MakeRequest
  u.make_response = GraphiteNoteUtilities::MakeResponse
  u.make_result = GraphiteNoteUtilities::MakeResult
  u.make_point = GraphiteNoteUtilities::MakePoint
  u.make_spec = GraphiteNoteUtilities::MakeSpec
  u.make_url = GraphiteNoteUtilities::MakeUrl
  u.param = GraphiteNoteUtilities::Param
  u.prepare_auth = GraphiteNoteUtilities::PrepareAuth
  u.prepare_body = GraphiteNoteUtilities::PrepareBody
  u.prepare_headers = GraphiteNoteUtilities::PrepareHeaders
  u.prepare_method = GraphiteNoteUtilities::PrepareMethod
  u.prepare_params = GraphiteNoteUtilities::PrepareParams
  u.prepare_path = GraphiteNoteUtilities::PreparePath
  u.prepare_query = GraphiteNoteUtilities::PrepareQuery
  u.graphql_body = GraphiteNoteUtilities::GraphqlBody
  u.graphql_errors = GraphiteNoteUtilities::GraphqlErrors
  u.result_basic = GraphiteNoteUtilities::ResultBasic
  u.result_body = GraphiteNoteUtilities::ResultBody
  u.result_headers = GraphiteNoteUtilities::ResultHeaders
  u.transform_request = GraphiteNoteUtilities::TransformRequest
  u.transform_response = GraphiteNoteUtilities::TransformResponse
}
