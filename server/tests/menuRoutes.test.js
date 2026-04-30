const express = require("express");
const request = require("supertest");
const menuRoutes = require("../routes/menuRoutes");

const app = express();
app.use(express.json());
app.use("/menu", menuRoutes);

describe("Menu Routes", () => {
    it("should return the list of menu items", async () => {
        const res = await request(app).get("/menu");
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty("id");
        expect(res.body[0]).toHaveProperty("name");
        expect(res.body[0]).toHaveProperty("price");
    });
});
