import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse, parseInput } from './lib/apigateway';
import { createPayment, Payment } from './lib/payments';
import { randomUUID } from 'crypto';


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const payment = parseInput(event.body || '{}') as Payment;
    payment.id = await randomUUID();

    await createPayment(payment);
    return buildResponse(201, { result: payment.id });
};
