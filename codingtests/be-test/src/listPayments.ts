import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse } from './lib/apigateway';
import { listPayments } from './lib/payments';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const currency = event.pathParameters?.currency as string;
	const payments = await listPayments(currency);
	return buildResponse(200, { data: payments });
};
