import {
	NodeOperationError,
	type IExecuteFunctions,
	type IHttpRequestOptions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';

type HarnessMode = 'reasoning' | 'code' | 'anti-deception' | 'memory';

interface HarnessResponseItem {
	[key: string]: string | undefined;
}

export class Ejentum implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ejentum',
		name: 'ejentum',
		icon: 'file:ejentum.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description:
			'Pull a task-matched cognitive scaffold from the Ejentum Reasoning Harness before an LLM step. Four harnesses cover reasoning, code, anti-deception, and memory.',
		defaults: {
			name: 'Ejentum',
		},
		inputs: ['main'],
		outputs: ['main'],
		usableAsTool: true,
		credentials: [
			{
				name: 'ejentumApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Anti-Deception Harness',
						value: 'anti-deception',
						action: 'Get an anti deception scaffold',
						description:
							'Use when a prompt pressures the model to validate, certify, or soften an honest assessment. The scaffold blocks sycophantic capitulation and hallucinated agreement before the response is written.',
					},
					{
						name: 'Code Harness',
						value: 'code',
						action: 'Get a code scaffold',
						description:
							'Use before generating, reviewing, refactoring, or debugging code. The scaffold names the typical failure pattern, gives an engineering procedure, and lists suppression vectors for the most common LLM coding mistakes.',
					},
					{
						name: 'Memory Harness',
						value: 'memory',
						action: 'Get a memory scaffold',
						description:
							'Use only after you have already noticed something about cross-turn drift, contradiction, or accumulated context. The scaffold sharpens an observation you already formed; it does not replace observation.',
					},
					{
						name: 'Reasoning Harness',
						value: 'reasoning',
						action: 'Get a reasoning scaffold',
						description:
							'Use before analytical, diagnostic, planning, or multi-step tasks. The scaffold returns a named failure pattern, an executable procedure, a target pattern, suppression vectors, and a falsification test.',
					},
				],
				default: 'reasoning',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				required: true,
				placeholder: 'Describe the task you are about to perform',
				description:
					'A short description of the task you are about to perform. The harness uses this to retrieve the best-matched cognitive scaffold. Example: "diagnose intermittent 503s under load".',
			},
			{
				displayName: 'Output Format',
				name: 'outputFormat',
				type: 'options',
				options: [
					{
						name: 'Scaffold String',
						value: 'scaffold',
						description: 'Return only the scaffold text, on a "scaffold" output key. Best for piping directly into an LLM prompt.',
					},
					{
						name: 'Full Response',
						value: 'full',
						description: 'Return the full JSON response from the API. Use when you need the raw payload.',
					},
				],
				default: 'scaffold',
				description: 'How to shape the data returned by this node',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('ejentumApi');
		const baseUrl = ((credentials.baseUrl as string) ?? '').trim() ||
			'https://ejentum-main-ab125c3.zuplo.app/logicv1/';

		for (let i = 0; i < items.length; i++) {
			try {
				const mode = this.getNodeParameter('operation', i) as HarnessMode;
				const rawQuery = this.getNodeParameter('query', i, '') as string;
				const outputFormat = this.getNodeParameter('outputFormat', i, 'scaffold') as
					| 'scaffold'
					| 'full';

				const query = (rawQuery ?? '').trim();
				if (!query) {
					throw new NodeOperationError(
						this.getNode(),
						'The "Query" field is required and cannot be empty or whitespace-only.',
						{ itemIndex: i },
					);
				}

				const requestOptions: IHttpRequestOptions = {
					method: 'POST',
					url: baseUrl,
					body: { query, mode },
					json: true,
				};

				const response = (await this.helpers.httpRequestWithAuthentication.call(
					this,
					'ejentumApi',
					requestOptions,
				)) as HarnessResponseItem[] | HarnessResponseItem | unknown;

				if (outputFormat === 'full') {
					returnData.push({
						json: { mode, query, response: response as object },
						pairedItem: { item: i },
					});
					continue;
				}

				let scaffold: string | undefined;
				if (Array.isArray(response) && response.length > 0 && typeof response[0] === 'object') {
					scaffold = (response[0] as HarnessResponseItem)[mode];
				}

				if (!scaffold) {
					throw new NodeOperationError(
						this.getNode(),
						`Ejentum API returned an unexpected response shape for mode "${mode}". Expected [{ "${mode}": "..." }]; got ${JSON.stringify(response).slice(0, 240)}`,
						{ itemIndex: i },
					);
				}

				returnData.push({
					json: { mode, query, scaffold },
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					const message = error instanceof Error ? error.message : String(error);
					returnData.push({
						json: { error: message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
