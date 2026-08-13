# GraphiteNote SDK utility: make_context

from projectname_sdk.core.context import GraphiteNoteContext


def make_context_util(ctxmap, basectx):
    return GraphiteNoteContext(ctxmap, basectx)
