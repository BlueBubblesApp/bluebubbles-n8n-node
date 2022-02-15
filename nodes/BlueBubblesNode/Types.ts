import { IExecuteFunctions, IExecuteSingleFunctions, IHookFunctions, ILoadOptionsFunctions } from 'n8n-core';
import { IDataObject } from 'n8n-workflow/dist/src/Interfaces';

export type WorkflowContext = IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions;
export type GenericDictionary = { [key: string]: any };

export type BlueBubblesRequestParams = {
    ctx: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions;
    method?: string;
    endpoint: string;
    params?: IDataObject;
    headers?: IDataObject;
    body?: any;
    strictSSL?: boolean;
    timeout?: number;
    json?: boolean;
    formData?: IDataObject;
};
