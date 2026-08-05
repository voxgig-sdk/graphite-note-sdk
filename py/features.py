# GraphiteNote SDK feature factory

from feature.base_feature import GraphiteNoteBaseFeature
from feature.test_feature import GraphiteNoteTestFeature


def _make_feature(name):
    features = {
        "base": lambda: GraphiteNoteBaseFeature(),
        "test": lambda: GraphiteNoteTestFeature(),
    }
    factory = features.get(name)
    if factory is not None:
        return factory()
    return features["base"]()
