import * as payments from '../src/lib/payments';
import { randomUUID } from 'crypto';
// import path from 'path';
import { handler } from '../src/createPayment';
import { APIGatewayProxyEvent } from 'aws-lambda';

jest.mock('crypto');

describe('When the user creates a payment', () => {
	const mockPayment = {
		currency: 'AUD',
		amount: 2000,
	};
	const createPaymentMock = jest.spyOn(payments, 'createPayment');
	it('Generates a UUID and Returns the paymentId.', async () => {
		const mockUUIDValue = 'mockUUID';
		createPaymentMock.mockResolvedValueOnce();
		(randomUUID as jest.Mock).mockResolvedValueOnce(mockUUIDValue);

		const result = await handler({
			body: JSON.stringify(mockPayment),
		} as unknown as APIGatewayProxyEvent);

		expect(randomUUID).toHaveBeenCalled();
		expect(createPaymentMock).toHaveBeenCalledWith({
			...mockPayment,
			id: mockUUIDValue,
		});

		expect(result.statusCode).toBe(201);
		expect(result.body).toBe(JSON.stringify({ result: mockUUIDValue }));
	});

	describe('When the user adds a new value to the event', () => {
		it('Returns a 422 error.', async () => {
			const invalidPayment = { ...mockPayment, newValue: 'test' };

			const result = await handler({
				body: JSON.stringify(invalidPayment),
			} as unknown as APIGatewayProxyEvent);
			expect(result.statusCode).toBe(422);
			expect(createPaymentMock).not.toHaveBeenCalled();
		});
	});

	describe('When user enters a invalidType in the amount attribute', () => {
		it('Returns a 422 error.', async () => {
			const invalidPayment = { ...mockPayment, amount: 'invalidType' };

			const result = await handler({
				body: JSON.stringify(invalidPayment),
			} as unknown as APIGatewayProxyEvent);
			expect(result.statusCode).toBe(422);
			expect(createPaymentMock).not.toHaveBeenCalled();
		});
	});

	describe('When user enters a invalidType in the currency attribute', () => {
		it('Returns a 422 error.', async () => {
			const invalidPayment = { ...mockPayment, currency: 1000.0 };

			const result = await handler({
				body: JSON.stringify(invalidPayment),
			} as unknown as APIGatewayProxyEvent);
			expect(result.statusCode).toBe(422);
			expect(createPaymentMock).not.toHaveBeenCalled();
		});
	});
});

afterEach(() => {
	jest.resetAllMocks();
});
