# GraphiteNote SDK utility: make_context

from core.context import GraphiteNoteContext


def make_context_util(ctxmap, basectx):
    return GraphiteNoteContext(ctxmap, basectx)
