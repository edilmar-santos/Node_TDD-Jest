// package para simular requisições
const request = require("supertest");

const truncate = require("../utils/truncate");
const app = require("../../src/app");
const factory = require("../factories");

describe("Authentication", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should be able to authenticate with valid credentials", async () => {
    const user = await factory.create("User", {
      password: "123456"
    });

    const response = await request(app)
      .post("/sessions")
      .send({
        email: user.email,
        password: "123456"
      });

    expect(response.status).toBe(200);
  });

  it("should not be able to authenticate with invalid credentials", async () => {
    const user = await factory.create("User", {
      password: "123456"
    });

    const response = await request(app)
      .post("/sessions")
      .send({
        email: user.email,
        password: "12345"
      });

    expect(response.status).toBe(401);
  });

  it("should return a jwt token when authenticated", async () => {
    const user = await factory.create("User", {
      password: "123456"
    });

    const response = await request(app)
      .post("/sessions")
      .send({
        email: user.email,
        password: "123456"
      });

    expect(response.body).toHaveProperty("token");
  });

  it("should be able to access private routes when authenticated", async () => {
    const user = await factory.create("User");

    const response = await request(app)
      .get("/dashboard")
      .set("Authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it("should not be able to access private routes when token not provided", async () => {
    const response = await request(app).get("/dashboard");

    expect(response.status).toBe(401);
  });

  it("should not be able to access private routes when not authenticated with valid token", async () => {
    const response = await request(app)
      .get("/dashboard")
      .set("Authorization", `Bearer 123456`);

    expect(response.status).toBe(401);
  });
});
