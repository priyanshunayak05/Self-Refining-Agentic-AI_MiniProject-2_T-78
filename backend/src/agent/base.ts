export interface AgentInput {
	requestId?: string;
	userId?: string;
	workflowId?: string;
	executionId?: string;
	metadata?: Record<string, unknown>;
}

export interface AgentOutput {
	success: boolean;
	data: unknown;
	error?: string;
	metadata?: Record<string, unknown>;
}

export interface IAgent<TInput extends AgentInput, TOutput extends AgentOutput> {
	execute(input: TInput): Promise<TOutput>;
	getNodeDefinition(): Record<string, unknown>;
}