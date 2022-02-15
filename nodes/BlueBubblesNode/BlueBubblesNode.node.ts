// n8n-specific imports
import { IExecuteFunctions } from 'n8n-core';
import { IDataObject, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';

// Relative imports
import { dispatchRawRequest, dispatchSendText } from './ActionDispatcher';

/**
 * A class to define the BlueBubbles Node for n8n
 */
export class BlueBubblesNode implements INodeType {
    /**
     * The configuration options/definition for the node,
     * including its' properties and its' actions
     */
    description: INodeTypeDescription = {
        displayName: 'BlueBubbles',
        name: 'bluebubbles',
        icon: 'file:logo.png',
        group: ['output'],
        version: 1,
        description: 'The BlueBubbles node allows you to automate perform automation over iMessage',
        defaults: {
            name: 'BlueBubbles',
            color: '#772244',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'BlueBubblesCredentials',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Action',
                name: 'action',
                type: 'options',
                options: [
                    {
                        name: 'Send Raw Request',
                        value: 'raw_request',
                        description: `Send a raw HTTP request to BlueBubbles`,
                    },
                    {
                        name: 'Send Message',
                        value: 'send_text',
                        description: `Send a text to someone`,
                    },
                ],
                default: 'raw_request',
                description: 'Select an action to execute against BlueBubbles',
            },
            {
                displayName: 'Text Message',
                name: 'text',
                type: 'string',
                displayOptions: {
                    show: {
                        action: ['send_text'],
                    },
                },
                default: '',
                description: 'Enter a message to send',
                required: true,
            },
            {
                displayName: 'Recipient / Chat GUID',
                name: 'recipient',
                type: 'string',
                displayOptions: {
                    show: {
                        action: ['send_text'],
                    },
                },
                default: '',
                description: 'Enter a recipient address or Chat GUID',
                required: true,
            },
            {
                displayName: 'Send Method',
                name: 'send_method',
                type: 'options',
                displayOptions: {
                    show: {
                        action: ['send_text'],
                    },
                },
                options: [
                    {
                        name: 'AppleScript',
                        value: 'apple-script',
                        default: true,
                    },
                    {
                        name: 'Private API',
                        value: 'private-api',
                        description: 'To use this option, you must have the Private API features setup and enabled!',
                    },
                ],
                default: 'apple-script',
                description: 'Select the method for how you want to send the text message',
                required: true,
            },
            {
                displayName: 'Method',
                name: 'request_method',
                type: 'options',
                displayOptions: {
                    show: {
                        action: ['raw_request'],
                    },
                },
                options: [
                    {
                        name: 'GET',
                        value: 'GET',
                    },
                    {
                        name: 'POST',
                        value: 'POST',
                    },
                    {
                        name: 'PUT',
                        value: 'PUT',
                    },
                    {
                        name: 'PATCH',
                        value: 'PATCH',
                    },
                    {
                        name: 'DELETE',
                        value: 'DELETE',
                    },
                ],
                default: 'GET',
                description: 'Select the HTTP method you would like to use for this request',
                required: true,
            },
            {
                displayName: 'Endpoint',
                name: 'raw_endpoint',
                type: 'string',
                displayOptions: {
                    show: {
                        action: ['raw_request'],
                    },
                },
                default: '',
                description: 'Enter the endpoint you want to request',
                required: true,
            },
            {
                displayName: 'Headers',
                name: 'headers_ui',
                type: 'fixedCollection',
                typeOptions: {
                    multipleValues: true,
                    multipleValueButtonText: 'Add Header',
                },
                displayOptions: {
                    show: {
                        action: ['raw_request'],
                    },
                },
                default: {},
                description: 'Headers to add to the request',
                placeholder: 'Add Header',
                options: [
                    {
                        name: 'header_values',
                        displayName: 'Header',
                        values: [
                            {
                                displayName: 'Name',
                                name: 'name',
                                type: 'string',
                                default: '',
                            },
                            {
                                displayName: 'Value',
                                name: 'value',
                                type: 'string',
                                default: '',
                            },
                        ],
                    },
                ],
            },
            {
                displayName: 'URL Parameters',
                name: 'parameters_ui',
                type: 'fixedCollection',
                typeOptions: {
                    multipleValues: true,
                    multipleValueButtonText: 'Add Parameter',
                },
                displayOptions: {
                    show: {
                        action: ['raw_request'],
                    },
                },
                default: {},
                description: 'Parameters to add to the request',
                placeholder: 'Add Parameter',
                options: [
                    {
                        name: 'parameter_values',
                        displayName: 'Parameter',
                        values: [
                            {
                                displayName: 'Name',
                                name: 'name',
                                type: 'string',
                                default: '',
                            },
                            {
                                displayName: 'Value',
                                name: 'value',
                                type: 'string',
                                default: '',
                            },
                        ],
                    },
                ],
            },
            {
                displayName: 'JSON Body',
                name: 'json_body',
                type: 'json',
                displayOptions: {
                    show: {
                        action: ['raw_request'],
                    },
                },
                default: '',
                description: 'Enter a JSON body for your HTTP request',
                required: false,
            },
        ],
    };

    /**
     * Executes a node action
     *
     * @param this The current context
     * @returns Action results
     */
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const length = items.length as unknown as number;

        // Read the parameters and execute the action accordingly
        let returnData: IDataObject[] = [];
        const action = this.getNodeParameter('action', 0) as string;
        for (let i = 0; i < length; i++) {
            // Dispatch the action and get the response
            if (action === 'raw_request') {
                returnData = await dispatchRawRequest.call(this, i);
            } else if (action === 'send_text') {
                returnData = await dispatchSendText.call(this, i);
            }
        }

        return [this.helpers.returnJsonArray(returnData)];
    }
}
