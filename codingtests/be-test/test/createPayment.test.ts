import * as payments from "../src/lib/payments";
import { randomUUID } from "crypto";
// import path from 'path';
import { handler } from "../src/createPayment";
import { APIGatewayProxyEvent } from "aws-lambda";

jest.mock("crypto");

describe("When the user creates a payment", () => {
  it("Generates a UUID and Returns the paymentId.", async () => {
    const mockPayment ={
        id: "abd123",
        currency: "AUD",
        amount: 2000,
      }
    const mockUUIDValue = "mockUUID";
    const createPaymentMock = jest.spyOn(payments, "createPayment").mockResolvedValue();
    (randomUUID as jest.Mock).mockResolvedValue(mockUUIDValue);

    const result = await handler({
      body: JSON.stringify(mockPayment),
    } as unknown as APIGatewayProxyEvent);

    expect(randomUUID).toHaveBeenCalled();
    expect(createPaymentMock).toHaveBeenCalledWith({...mockPayment, id: mockUUIDValue});

    expect(result.statusCode).toBe(201);
    expect(result.body).toBe(JSON.stringify({ result: mockUUIDValue }));
  });
});

afterEach(() => {
  jest.resetAllMocks();
});
