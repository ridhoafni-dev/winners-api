import supertest from "supertest";
import App from "../app";
import prisma from "../prisma";

const app = new App().app;

describe("TEST AUTH", () => {
  beforeEach(() => {
    // menyiapkan program yg ingin dijalankan terlebih dahulu sebelum running test});
  });

  beforeAll(async () => {
    // menyiapkan program yg sekali dijalankan sebelum test dijalankan
    await prisma.$connect;
  });

  afterEach(() => {});

  afterAll(async () => {
    await prisma.$disconnect;
  });
  it("POST /auth/regis", async () => {
    const regisResult = await supertest(app).post("/auth/regis").send({
      username: "vicilo3730",
      email: "vicilo3730@konican.com",
      password: "vicilo3730",
    });

    expect(regisResult.status).toBe(201);
    expect(regisResult.body.success).toBeTruthy();
  });
});
