# GraphiteNote SDK exists test

require "minitest/autorun"
require_relative "../GraphiteNote_sdk"

class ExistsTest < Minitest::Test
  def test_create_test_sdk
    testsdk = GraphiteNoteSDK.test(nil, nil)
    assert !testsdk.nil?
  end
end
