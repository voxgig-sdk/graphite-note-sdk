import { Context } from './Context';
declare class GraphiteNoteError extends Error {
    isGraphiteNoteError: boolean;
    sdk: string;
    code: string;
    ctx: Context;
    status: number;
    get notFound(): boolean;
    constructor(code: string, msg: string, ctx: Context);
}
export { GraphiteNoteError };
