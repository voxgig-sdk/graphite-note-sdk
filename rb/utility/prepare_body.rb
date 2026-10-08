# GraphiteNote SDK utility: prepare_body
require_relative 'media'
module GraphiteNoteUtilities
  PrepareBody = ->(ctx) {
    return nil unless ctx.op.input == "data"
    return GraphiteNoteUtilities.raw_body(ctx.reqdata) if GraphiteNoteUtilities.raw_request?(ctx.point)
    ctx.utility.transform_request.call(ctx)
  }
end
