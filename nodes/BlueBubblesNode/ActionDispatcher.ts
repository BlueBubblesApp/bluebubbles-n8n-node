// n8n-specific imports
import { IDataObject } from 'n8n-workflow';
import * as Crypto from 'crypto';

// Relative imports
import { bluebubblesRequest, isNullOrEmpty, nameValuePairsToObject, normalizeApiEndpoint } from './GenericFunctions';
import { GenericDictionary, WorkflowContext } from './Types';

/**
 * Dispatches a raw API request based on the user's options
 *
 * @param this The current workflow context
 * @param auth BlueBubbles authentication data
 * @param index The node parameter index to use
 * @returns The raw response
 */
export async function dispatchRawRequest(this: WorkflowContext, index: number): Promise<IDataObject[]> {
    const method = ((this.getNodeParameter('request_method', index) as string) ?? '').trim();
    const endpoint = ((this.getNodeParameter('raw_endpoint', index) as string) ?? '').trim();
    const headers = (this.getNodeParameter('headers_ui', index) as GenericDictionary).header_values;
    const params = (this.getNodeParameter('parameters_ui', index) as GenericDictionary).parameter_values;
    const query = ((this.getNodeParameter('json_body', index) as string) ?? '').trim();

    // If there is a body, parse it and use it
    let body: GenericDictionary | GenericDictionary[] | null = null;
    if (!isNullOrEmpty(query)) {
        body = JSON.parse(query);
    }

    const res = await bluebubblesRequest({
        ctx: this,
        method,
        endpoint: normalizeApiEndpoint(endpoint),
        params: nameValuePairsToObject(params ?? []),
        headers: nameValuePairsToObject(headers ?? []),
        body: body as GenericDictionary | GenericDictionary[],
    });

    // Pull out the corresponding pieces of parsed data
    return [{ raw_response: res }];
}

/**
 * Sends a text to a recipient
 *
 * @param this The current workflow context
 * @param auth BlueBubbles authentication data
 * @param index The node parameter index to use
 * @returns The raw response
 */
export async function dispatchSendText(this: WorkflowContext, index: number): Promise<IDataObject[]> {
    const message = ((this.getNodeParameter('text', index) as string) ?? '').trim();
    const recipient = ((this.getNodeParameter('recipient', index) as string) ?? '').trim();
    const method = ((this.getNodeParameter('send_method', index) as string) ?? '').trim();
    console.log('DISKDSKDMSKDMKSM');
    console.log(method);

    let tempGuid = null;
    if (method === 'apple-script') {
        tempGuid = Crypto.createHash('md5').update(`${message}-${recipient}-${new Date().getTime()}`).digest('hex');
        console.log(tempGuid);
    }

    const res = await bluebubblesRequest({
        ctx: this,
        method: 'POST',
        endpoint: '/api/v1/message/text',
        body: { message, chatGuid: recipient, method, tempGuid },
    });

    // Pull out the corresponding pieces of parsed data
    return [{ raw_response: res }];
}
