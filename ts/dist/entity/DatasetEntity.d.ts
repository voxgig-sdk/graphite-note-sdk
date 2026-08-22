import { GraphiteNoteEntityBase } from '../GraphiteNoteEntityBase';
import type { GraphiteNoteSDK } from '../GraphiteNoteSDK';
import type { Control } from '../types';
import type { Dataset, DatasetCreateData } from '../GraphiteNoteTypes';
declare class DatasetEntity extends GraphiteNoteEntityBase<Dataset> {
    constructor(client: GraphiteNoteSDK, entopts: any);
    make(this: DatasetEntity): DatasetEntity;
    create(this: any, reqdata?: DatasetCreateData, ctrl?: Control): Promise<DatasetEntity>;
}
export { DatasetEntity };
