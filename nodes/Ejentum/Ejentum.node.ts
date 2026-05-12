import {
	NodeOperationError,
	type IExecuteFunctions,
	type IHttpRequestOptions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';

type HarnessMode = 'reasoning' | 'code' | 'anti-deception' | 'memory';

export class Ejentum implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ejentum',
		name: 'ejentum',
		icon: 'file:ejentum.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description:
			'Retrieve a task-matched cognitive operation from the Ejentum Reasoning Harness and inject it into the next LLM step. Each operation is engineered in two layers: a natural-language procedure plus an executable reasoning topology (graph DAG with gates, parallel branches, and meta-cognitive exits). Hardens reasoning against decay on complex tasks and long sessions. Four harnesses: reasoning, code, anti-deception, memory.',
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
						action: 'Get anti deception harness',
						description:
							'Use when a prompt pressures the model to validate, certify, or soften an honest assessment. Blocks sycophantic capitulation and hallucinated agreement before the response is written.',
					},
					{
						name: 'Code Harness',
						value: 'code',
						action: 'Get code harness',
						description:
							'Use before generating, reviewing, refactoring, or debugging code. Names the typical failure pattern, gives an engineering procedure, and lists suppression vectors for the most common LLM coding mistakes.',
					},
					{
						name: 'Memory Harness',
						value: 'memory',
						action: 'Get memory harness',
						description:
							'Use after you have already noticed something about cross-turn drift, contradiction, or accumulated context in the perception layer. Sharpens an existing observation; does not generate one.',
					},
					{
						name: 'Reasoning Harness',
						value: 'reasoning',
						action: 'Get reasoning harness',
						description: 'Use before analytical, diagnostic, planning, or multi-step tasks across abstraction, time, causality, simulation, spatial, and metacognition',
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

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'ejentumApi',
					requestOptions,
				);

				returnData.push({
					json: { mode, query, response: response as object },
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
