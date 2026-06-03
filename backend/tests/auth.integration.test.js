const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const connectDB = require("../config/db");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

describe("API auth integration", () => {
  beforeAll(async () => {
    process.env.MONGODB_URI =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mevn-test";
    await connectDB();
    process.env.JWT_SECRET = "secret";
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

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
    );

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

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
    expect(res.body.message).toBe("Vous n'êtes pas connecté.");
  });
});
