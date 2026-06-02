const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const connectDB = require("../config/db");
const User = require("../models/User");

describe("API auth integration", () => {
  beforeAll(async () => {
    process.env.MONGODB_URI =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mevn-test";
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  test("GET /api/auth/me retourne l'utilisateur attaché", async () => {
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hash",
      role: "admin",
    });

    const res = await request(app)
      .get("/api/auth/me")
      .set("x-user-id", user._id.toString());

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toEqual({
      id: user._id.toString(),
      name: "Test User",
      email: "test@example.com",
      role: "admin",
    });
  });

  test("GET /api/auth/me sans utilisateur renvoie 401", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Pas authentifié");
  });
});
