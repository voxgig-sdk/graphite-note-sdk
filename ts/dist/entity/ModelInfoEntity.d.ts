import { GraphiteNoteEntityBase } from '../GraphiteNoteEntityBase';
import type { GraphiteNoteSDK } from '../GraphiteNoteSDK';
import type { Control } from '../types';
import type { ModelInfo, ModelInfoLoadMatch } from '../GraphiteNoteTypes';
declare class ModelInfoEntity extends GraphiteNoteEntityBase<ModelInfo> {
    constructor(client: GraphiteNoteSDK, entopts: any);
    make(this: ModelInfoEntity): ModelInfoEntity;
    load(this: any, reqmatch?: ModelInfoLoadMatch, ctrl?: Control): Promise<ModelInfoEntity>;
}
export { ModelInfoEntity };
