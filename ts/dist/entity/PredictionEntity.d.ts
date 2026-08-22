import { GraphiteNoteEntityBase } from '../GraphiteNoteEntityBase';
import type { GraphiteNoteSDK } from '../GraphiteNoteSDK';
import type { Control } from '../types';
import type { Prediction, PredictionCreateData } from '../GraphiteNoteTypes';
declare class PredictionEntity extends GraphiteNoteEntityBase<Prediction> {
    constructor(client: GraphiteNoteSDK, entopts: any);
    make(this: PredictionEntity): PredictionEntity;
    create(this: any, reqdata?: PredictionCreateData, ctrl?: Control): Promise<PredictionEntity>;
}
export { PredictionEntity };
