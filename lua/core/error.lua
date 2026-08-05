-- GraphiteNote SDK error

local GraphiteNoteError = {}
GraphiteNoteError.__index = GraphiteNoteError


function GraphiteNoteError.new(code, msg, ctx)
  local self = setmetatable({}, GraphiteNoteError)
  self.is_sdk_error = true
  self.sdk = "GraphiteNote"
  self.code = code or ""
  self.msg = msg or ""
  self.ctx = ctx
  self.result = nil
  self.spec = nil
  return self
end


function GraphiteNoteError:error()
  return self.msg
end


function GraphiteNoteError:__tostring()
  return self.msg
end


return GraphiteNoteError
