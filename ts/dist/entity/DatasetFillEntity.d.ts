import { GraphiteNoteEntityBase } from '../GraphiteNoteEntityBase';
import type { GraphiteNoteSDK } from '../GraphiteNoteSDK';
import type { Control } from '../types';
import type { DatasetFill, DatasetFillCreateData } from '../GraphiteNoteTypes';
declare class DatasetFillEntity extends GraphiteNoteEntityBase<DatasetFill> {
    constructor(client: GraphiteNoteSDK, entopts: any);
    make(this: DatasetFillEntity): DatasetFillEntity;
    create(this: any, reqdata?: DatasetFillCreateData, ctrl?: Control): Promise<DatasetFillEntity>;
}
export { DatasetFillEntity };
