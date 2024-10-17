import { DocumentClient } from './dynamodb';
import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

export const getPayment = async (paymentId: string): Promise<Payment | null> => {
	const result = await DocumentClient.send(
		new GetCommand({
			TableName: 'Payments',
			Key: { paymentId },
		})
	);

	return (result.Item as Payment) || null;
};

export const listPayments = async (currency: string): Promise<Payment[]> => {
	const scanCommand: {
		TableName: string;
		FilterExpression?: string;
		ExpressionAttributeValues?: { [key: string]: any };
	} = {
		TableName: 'Payments',
	};

	if (currency) {
		scanCommand.FilterExpression = 'currency = :currency';
		scanCommand.ExpressionAttributeValues = {
			':currency': currency,
		};
	}

	const result = await DocumentClient.send(new ScanCommand(scanCommand));

	return (result.Items as Payment[]) || [];
};

export const createPayment = async (payment: Payment) => {
	await DocumentClient.send(
		new PutCommand({
			TableName: 'Payments',
			Item: payment,
		})
	);
};

export type Payment = {
	id: string;
	amount: number;
	currency: string;
};
