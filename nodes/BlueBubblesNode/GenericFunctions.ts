import { OptionsWithUri } from 'request';
import { BlueBubblesRequestParams, GenericDictionary } from './Types';
import { sanitizeHost } from './AuthenticationFunctions';

export const ApiVersion = 1;

export function parseDate(date: string) {
    const opts: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'UTC',
        hour12: false,
    };
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString('en-US', opts);
}

export async function bluebubblesRequest({
    ctx,
    method = 'GET',
    endpoint,
    params = {},
    headers = {},
    body = {},
    formData = {},
    strictSSL = false,
    timeout = 300000, // 5 minutes in ms
    json = true,
}: BlueBubblesRequestParams): Promise<any> {
    // Try and get the auth data correctly
    const credentials = ctx.getCredentials('BlueBubblesCredentials');
    if (credentials === undefined) {
        throw new Error('No credentials got returned!');
    }

    const apiUrl = sanitizeHost(credentials.server_url as string);
    const password = credentials.password;
    if (!Object.keys(params).includes('password')) {
        params.password = password;
    }

    // If there is no content type, add a default
    if (!Object.keys(headers).includes('Content-Type') && method.toUpperCase() === 'POST')
        headers['Content-Type'] = 'application/json';
    if (!Object.keys(headers).includes('Accept') && method.toUpperCase() !== 'DELETE')
        headers['Accept'] = 'application/json';

    // Validate the endpooint a bit
    if (endpoint.startsWith('/')) endpoint = endpoint.substring(1, endpoint.length);

    // Build the request options
    let options: OptionsWithUri = {
        headers,
        method,
        qs: params,
        body,
        json,
        uri: `${apiUrl}/${endpoint}`,
        timeout,
        strictSSL,
        formData,
    };

    // Remove the body if there is nothing there
    if (!body || Object.keys(body).length === 0) {
        delete options.body;
    }

    // Remove the body if there is nothing there
    if (!formData || Object.keys(formData).length === 0) {
        delete options.formData;
    }

    try {
        // Execute the request
        console.dir(options);
        return await ctx.helpers.request!(options);
    } catch (error) {
        const err = error as any;
        if (err.statusCode === 400) {
            throw new Error(
                `Validation Error: ${err?.response.body?.error?.message ?? err?.response.body?.message ?? 'Unknown'}`
            );
        } else if (err.statusCode === 401) {
            throw new Error('Authentication Error: The BlueBubbles credentials are not valid!');
        } else if (err.statusCode === 403) {
            throw new Error('Permissions Error: Credentials are not authorized to access this resource!');
        }

        // If that data does not exist for some reason return the actual error
        throw new Error('BlueBubbles Error: ' + err.message);
    }
}

export function isNullOrEmpty(value: string | Array<any> | null) {
    return !value || value.length === 0;
}

export function parseErrors(data: GenericDictionary): string[] {
    let errs: string[] = [];

    if (data?.errors && Array.isArray(data?.errors)) return data.errors;

    let errors: GenericDictionary = {};
    if (data?.errors) {
        errors = data.errors;
    } else {
        errors = data?.data?.errors;
    }

    for (let key in errors ?? {}) {
        errs = [...errs, ...errors[key]];
    }

    if (isNullOrEmpty(errs)) errs = ['An unknown error has occurred'];
    return errs;
}

export function normalize(value: string): string {
    if (!value) return value;

    // Make everything lowercase
    value = value.toLowerCase();

    // Replace all spaces or underscores
    value = value.replace(/ /gi, '').replace(/_/gi, '');

    // Return the trimmed string
    return value.trim();
}

export function nameValuePairsToObject(pairs: GenericDictionary[]) {
    const output: GenericDictionary = {};

    for (const i of pairs) {
        output[i.name] = i.value;
    }

    return output;
}

export function normalizeApiEndpoint(endpoint: string) {
    // Strip the first slash
    if (endpoint.startsWith('/')) {
        endpoint = endpoint.substring(1, endpoint.length);
    }

    // Strip the last slash
    if (endpoint.startsWith('/')) {
        endpoint = endpoint.substring(0, endpoint.length - 1);
    }

    return endpoint;
}
