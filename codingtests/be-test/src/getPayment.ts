import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getPayment } from './lib/payments';
import { buildResponse } from './lib/apigateway';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const paymentId = event.pathParameters?.id as string;
    const payment = await getPayment(paymentId);
    return buildResponse(200, payment || {});
};
