-- GraphiteNote SDK feature factory

local BaseFeature = require("feature.base_feature")
local DebugFeature = require("feature.debug_feature")
local IdempotencyFeature = require("feature.idempotency_feature")
local MetricsFeature = require("feature.metrics_feature")
local PagingFeature = require("feature.paging_feature")
local RatelimitFeature = require("feature.ratelimit_feature")
local RetryFeature = require("feature.retry_feature")
local TestFeature = require("feature.test_feature")
local TimeoutFeature = require("feature.timeout_feature")


local features = {}

features.base = function()
  return BaseFeature.new()
end

features["debug"] = function()
  return DebugFeature.new()
end

features["idempotency"] = function()
  return IdempotencyFeature.new()
end

features["metrics"] = function()
  return MetricsFeature.new()
end

features["paging"] = function()
  return PagingFeature.new()
end

features["ratelimit"] = function()
  return RatelimitFeature.new()
end

features["retry"] = function()
  return RetryFeature.new()
end

features["test"] = function()
  return TestFeature.new()
end

features["timeout"] = function()
  return TimeoutFeature.new()
end


return features
