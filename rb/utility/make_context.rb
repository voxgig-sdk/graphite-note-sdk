# GraphiteNote SDK utility: make_context
require_relative '../core/context'
module GraphiteNoteUtilities
  MakeContext = ->(ctxmap, basectx) {
    GraphiteNoteContext.new(ctxmap, basectx)
  }
end
