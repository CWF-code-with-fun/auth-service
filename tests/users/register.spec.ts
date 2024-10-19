import { describe, it } from "node:test";
import app from "../../src/app";
import request from "supertest";
import { expect } from "vitest";

describe("User registration", () => {
    describe("Giver all required fields", () => {
        it("should return 201", async () => {
            // Test code
            // AAA (Arrange, Act, Assert)
            // Arrange
            const user = {
                name: "John Doe",
                email: "example.gmail.com",
                password: "password",
            };
            // Act
            const response = await request(app).post("/users/register").send(user);
            // Assert
            expect(response.status).toBe(201);
            expect(response.body).toEqual(user);
        });
    });
});