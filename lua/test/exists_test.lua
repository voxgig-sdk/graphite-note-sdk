-- GraphiteNote SDK exists test

local sdk = require("graphite-note_sdk")

describe("GraphiteNoteSDK", function()
  it("should create test SDK", function()
    local testsdk = sdk.test(nil, nil)
    assert.is_not_nil(testsdk)
  end)
end)
