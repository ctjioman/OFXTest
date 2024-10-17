import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse, parseInput } from './lib/apigateway';
import { createPayment, Payment } from './lib/payments';
import { randomUUID } from 'crypto';
import { z } from 'zod';

const schema = z
	.object({
		amount: z.number(),
		currency: z.string(),
	})
	.strict();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const eventBody = parseInput(event.body || '{}');

	const schemaResults = schema.safeParse(eventBody);

	if (!schemaResults.success) {
		return buildResponse(422, {});
	}
	const payment = eventBody as Payment;
	payment.id = await randomUUID();

	await createPayment(payment);
	return buildResponse(201, { result: payment.id });
};
