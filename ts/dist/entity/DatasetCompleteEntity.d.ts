import { GraphiteNoteEntityBase } from '../GraphiteNoteEntityBase';
import type { GraphiteNoteSDK } from '../GraphiteNoteSDK';
import type { Control } from '../types';
import type { DatasetComplete, DatasetCompleteCreateData } from '../GraphiteNoteTypes';
declare class DatasetCompleteEntity extends GraphiteNoteEntityBase<DatasetComplete> {
    constructor(client: GraphiteNoteSDK, entopts: any);
    make(this: DatasetCompleteEntity): DatasetCompleteEntity;
    create(this: any, reqdata?: DatasetCompleteCreateData, ctrl?: Control): Promise<DatasetCompleteEntity>;
}
export { DatasetCompleteEntity };
