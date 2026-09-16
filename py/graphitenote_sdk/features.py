# GraphiteNote SDK feature factory

from graphitenote_sdk.feature.base_feature import GraphiteNoteBaseFeature
from graphitenote_sdk.feature.debug_feature import GraphiteNoteDebugFeature
from graphitenote_sdk.feature.idempotency_feature import GraphiteNoteIdempotencyFeature
from graphitenote_sdk.feature.metrics_feature import GraphiteNoteMetricsFeature
from graphitenote_sdk.feature.paging_feature import GraphiteNotePagingFeature
from graphitenote_sdk.feature.ratelimit_feature import GraphiteNoteRatelimitFeature
from graphitenote_sdk.feature.retry_feature import GraphiteNoteRetryFeature
from graphitenote_sdk.feature.test_feature import GraphiteNoteTestFeature
from graphitenote_sdk.feature.timeout_feature import GraphiteNoteTimeoutFeature


_FEATURES = {
    "base": lambda: GraphiteNoteBaseFeature(),
    "debug": lambda: GraphiteNoteDebugFeature(),
    "idempotency": lambda: GraphiteNoteIdempotencyFeature(),
    "metrics": lambda: GraphiteNoteMetricsFeature(),
    "paging": lambda: GraphiteNotePagingFeature(),
    "ratelimit": lambda: GraphiteNoteRatelimitFeature(),
    "retry": lambda: GraphiteNoteRetryFeature(),
    "test": lambda: GraphiteNoteTestFeature(),
    "timeout": lambda: GraphiteNoteTimeoutFeature(),
}


def _make_feature(name):
    factory = _FEATURES.get(name)
    if factory is not None:
        return factory()
    return _FEATURES["base"]()


# True when this SDK was generated with the named feature class - the
# constructor's tolerance for extend-carried features reads this (an
# active name with no generated class must not become a BaseFeature
# stray when an extend instance carries it).
def _has_feature(name):
    return name in _FEATURES
