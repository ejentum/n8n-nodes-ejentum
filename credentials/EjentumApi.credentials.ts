import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class EjentumApi implements ICredentialType {
	name = 'ejentumApi';

	displayName = 'Ejentum API';

	documentationUrl = 'https://ejentum.com/docs/api_reference';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Your Ejentum API key. Get one free (100 calls, no card required) at https://ejentum.com/pricing.',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://ejentum-main-ab125c3.zuplo.app/logicv1/',
			description:
				'Override only if you are self-hosting the Ejentum Logic API gateway. Leave the default for the managed service.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '',
			method: 'POST',
			body: {
				query: 'credential test',
				mode: 'reasoning',
			},
			headers: {
				'Content-Type': 'application/json',
			},
		},
	};
}
