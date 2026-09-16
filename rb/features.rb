# GraphiteNote SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/debug_feature'
require_relative 'feature/idempotency_feature'
require_relative 'feature/metrics_feature'
require_relative 'feature/paging_feature'
require_relative 'feature/ratelimit_feature'
require_relative 'feature/retry_feature'
require_relative 'feature/test_feature'
require_relative 'feature/timeout_feature'


module GraphiteNoteFeatures
  def self.make_feature(name)
    case name
    when "base"
      GraphiteNoteBaseFeature.new
    when "debug"
      GraphiteNoteDebugFeature.new
    when "idempotency"
      GraphiteNoteIdempotencyFeature.new
    when "metrics"
      GraphiteNoteMetricsFeature.new
    when "paging"
      GraphiteNotePagingFeature.new
    when "ratelimit"
      GraphiteNoteRatelimitFeature.new
    when "retry"
      GraphiteNoteRetryFeature.new
    when "test"
      GraphiteNoteTestFeature.new
    when "timeout"
      GraphiteNoteTimeoutFeature.new
    else
      GraphiteNoteBaseFeature.new
    end
  end
end
