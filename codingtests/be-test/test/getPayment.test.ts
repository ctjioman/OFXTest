import * as payments from '../src/lib/payments';
import { randomUUID } from 'crypto';
import { handler } from '../src/getPayment';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('When the user requests the records for a specific payment', () => {
	it('Returns the payment matching their input parameter.', async () => {
		const paymentId = randomUUID();
		const mockPayment = {
			id: paymentId,
			currency: 'AUD',
			amount: 2000,
		};
		const getPaymentMock = jest
			.spyOn(payments, 'getPayment')
			.mockResolvedValueOnce(mockPayment);

		const result = await handler({
			pathParameters: {
				id: paymentId,
			},
		} as unknown as APIGatewayProxyEvent);

		expect(getPaymentMock).toHaveBeenCalledWith(paymentId);
		expect(result.statusCode).toBe(200);
		expect(JSON.parse(result.body)).toEqual(mockPayment);
	});

	describe('When the specific payment does not exist', () => {
		it('Returns a 404 error.', async () => {
			const paymentId = randomUUID();

			const getPaymentMock = jest.spyOn(payments, 'getPayment').mockResolvedValueOnce(null);

			const result = await handler({
				pathParameters: {
					id: paymentId,
				},
			} as unknown as APIGatewayProxyEvent);

			expect(getPaymentMock).toHaveBeenCalledWith(paymentId);
			expect(result.statusCode).toBe(404);
		});
	});
});

afterEach(() => {
	jest.resetAllMocks();
});
