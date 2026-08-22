export interface Dataset {
    columns?: number;
    datasetcode?: string;
    name: string;
    tablename?: string;
    usercode: string;
}
export interface DatasetCreateData {
    columns?: number;
    datasetcode?: string;
    name: string;
    tablename?: string;
    usercode: string;
}
export interface DatasetFill {
    append: boolean;
    columns: any[];
    compressed: boolean;
    datasetcode: string;
    details?: Record<string, any>;
    insertdata: string;
    status?: string;
    usercode: string;
}
export interface DatasetFillCreateData {
    append: boolean;
    columns: any[];
    compressed: boolean;
    datasetcode: string;
    details?: Record<string, any>;
    insertdata: string;
    status?: string;
    usercode: string;
}
export interface ModelInfo {
    code?: string;
    created_at?: string;
    dataset_code?: string;
    model_name?: string;
    name?: string;
    properties?: Record<string, any>;
    updated_at?: string;
}
export interface ModelInfoLoadMatch {
    model_code: string;
}
export interface ModelResult {
    data?: any[];
    page?: number;
    pagesize?: number;
}
export interface ModelResultCreateData {
    model_code: string;
    data?: any[];
    page?: number;
    pagesize?: number;
}
export interface Prediction {
    columns?: any[];
    data?: any[];
}
export interface PredictionCreateData {
    model_code: string;
    columns?: any[];
    data?: any[];
}
