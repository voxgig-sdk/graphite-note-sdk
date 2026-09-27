"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphiteNoteError = void 0;
class GraphiteNoteError extends Error {
    isGraphiteNoteError = true;
    sdk = 'GraphiteNote';
    code;
    ctx;
    status = -1;
    // `err.notFound` rather than a magic number at every call site.
    get notFound() { return 404 === this.status; }
    constructor(code, msg, ctx) {
        super(msg);
        this.code = code;
        this.ctx = ctx;
    }
}
exports.GraphiteNoteError = GraphiteNoteError;
//# sourceMappingURL=GraphiteNoteError.js.map