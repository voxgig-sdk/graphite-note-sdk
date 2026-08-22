import { GraphiteNoteEntityBase } from '../GraphiteNoteEntityBase';
import type { GraphiteNoteSDK } from '../GraphiteNoteSDK';
import type { Control } from '../types';
import type { ModelResult, ModelResultCreateData } from '../GraphiteNoteTypes';
declare class ModelResultEntity extends GraphiteNoteEntityBase<ModelResult> {
    constructor(client: GraphiteNoteSDK, entopts: any);
    make(this: ModelResultEntity): ModelResultEntity;
    create(this: any, reqdata?: ModelResultCreateData, ctrl?: Control): Promise<ModelResultEntity>;
}
export { ModelResultEntity };
