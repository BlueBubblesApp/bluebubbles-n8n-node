// Relative imports
import { bluebubblesRequest } from './GenericFunctions';
import { GenericDictionary, WorkflowContext } from './Types';

/**
 * Executes a raw HTTP request against BlueBubbles
 *
 * @param this The n8n workflow context
 * @param auth The BlueBubbles authentication data
 * @param method The HTTP method to execute
 * @param endpoint The endpoint to hit
 * @param params Any URL params to send with the request
 * @param headers Any headers to send with the request
 * @param data The data to send with a POST/PUT/PATCH request
 * @returns The raw HTTP response
 */
export async function rawRequest(
    this: WorkflowContext,
    method: string,
    endpoint: string,
    params: GenericDictionary,
    headers: GenericDictionary,
    data: GenericDictionary | GenericDictionary[]
): Promise<GenericDictionary | GenericDictionary[]> {
    return (await bluebubblesRequest({
        ctx: this,
        method: method,
        endpoint: endpoint,
        body: data,
        params,
        headers,
    })) as GenericDictionary | GenericDictionary[];
}
