const express = require("express");
const request = require("supertest");
const orderRoutes = require("../routes/orderRoutes");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    // Mock io
    req.io = { emit: jest.fn() };
    next();
});
app.use("/orders", orderRoutes);

describe("Order Routes", () => {
    it("should create a new order when valid data is provided", async () => {
        const payload = {
            items: [{ id: 1, name: "Pizza", price: 200, quantity: 2 }],
            customer: { name: "John Doe", address: "123 Street", phone: "1234567890" }
        };

        const res = await request(app).post("/orders").send(payload);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.status).toEqual("Order Received");
        expect(res.body.customer.name).toEqual("John Doe");
    });

    it("should return 400 when cart is empty", async () => {
        const payload = {
            items: [],
            customer: { name: "John", address: "123 St", phone: "1234" }
        };
        const res = await request(app).post("/orders").send(payload);
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual("Cart cannot be empty");
    });

    it("should return 400 when customer data is incomplete", async () => {
        const payload = {
            items: [{ id: 1, quantity: 1 }],
            customer: { name: "John" }
        };
        const res = await request(app).post("/orders").send(payload);
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual("Complete customer details are required");
    });

    it("should fetch an existing order by ID", async () => {
        // First create
        const payload = {
            items: [{ id: 1, name: "Burger", price: 100, quantity: 1 }],
            customer: { name: "Jane Doe", address: "456 Ave", phone: "0987654321" }
        };
        const createRes = await request(app).post("/orders").send(payload);
        const orderId = createRes.body.id;

        // Then fetch
        const res = await request(app).get(`/orders/${orderId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.id).toEqual(orderId);
    });

    it("should return 404 for a non-existent order", async () => {
        const res = await request(app).get("/orders/999999999");
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual("Order not found");
    });
});
