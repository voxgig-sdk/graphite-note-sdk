# GraphiteNote SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/test_feature'


module GraphiteNoteFeatures
  def self.make_feature(name)
    case name
    when "base"
      GraphiteNoteBaseFeature.new
    when "test"
      GraphiteNoteTestFeature.new
    else
      GraphiteNoteBaseFeature.new
    end
  end
end
