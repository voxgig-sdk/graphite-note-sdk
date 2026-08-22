import { DatasetEntity } from './entity/DatasetEntity';
import { DatasetFillEntity } from './entity/DatasetFillEntity';
import { ModelInfoEntity } from './entity/ModelInfoEntity';
import { ModelResultEntity } from './entity/ModelResultEntity';
import { PredictionEntity } from './entity/PredictionEntity';
export type * from './GraphiteNoteTypes';
import { inspect } from 'node:util';
import type { Context, Feature } from './types';
import { config } from './Config';
import { GraphiteNoteEntityBase } from './GraphiteNoteEntityBase';
import { Utility } from './utility/Utility';
import { BaseFeature } from './feature/base/BaseFeature';
declare const stdutil: Utility;
declare class GraphiteNoteSDK {
    _mode: string;
    _options: any;
    _utility: Utility;
    _features: Feature[];
    _rootctx: Context;
    constructor(options?: any);
    options(): any;
    utility(): any;
    prepare(fetchargs?: any): Promise<any>;
    direct(fetchargs?: any): Promise<Error | {
        ok: boolean;
        status: number;
        headers: any;
        data: any;
        err?: undefined;
    } | {
        ok: boolean;
        err: any;
        status?: undefined;
        headers?: undefined;
        data?: undefined;
    }>;
    _rawRequest(fetchargs?: any): Promise<Error | {
        ok: boolean;
        status: number;
        headers: any;
        data: any;
        err?: undefined;
    } | {
        ok: boolean;
        err: any;
        status?: undefined;
        headers?: undefined;
        data?: undefined;
    }>;
    graphql(query: string, variables?: any, ctrl?: any): Promise<any>;
    Dataset(entopts?: Record<string, any>): DatasetEntity;
    DatasetFill(entopts?: Record<string, any>): DatasetFillEntity;
    ModelInfo(entopts?: Record<string, any>): ModelInfoEntity;
    ModelResult(entopts?: Record<string, any>): ModelResultEntity;
    Prediction(entopts?: Record<string, any>): PredictionEntity;
    static test(testoptsarg?: any, sdkoptsarg?: any): GraphiteNoteSDK;
    tester(testopts?: any, sdkopts?: any): GraphiteNoteSDK;
    toJSON(): {
        name: string;
    };
    toString(): string;
    [inspect.custom](): string;
}
declare const SDK: typeof GraphiteNoteSDK;
export { stdutil, config, BaseFeature, GraphiteNoteEntityBase, GraphiteNoteSDK, SDK, };
