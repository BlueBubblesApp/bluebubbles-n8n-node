import { ICredentialType, NodePropertyTypes } from 'n8n-workflow';

export class BlueBubblesCredentials implements ICredentialType {
    name = 'BlueBubblesCredentials';
    displayName = 'BlueBubbles Credentials';
    properties = [
        {
            displayName: 'BlueBubbles Server URL',
            name: 'server_url',
            type: 'string' as NodePropertyTypes,
            default: '',
        },
        {
            displayName: 'Password',
            name: 'password',
            type: 'string' as NodePropertyTypes,
            default: '',
            typeOptions: {
                password: true,
            },
        },
    ];
}
