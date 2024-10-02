import supertest from "supertest";
import App from "../app";

const app = new App().app;

describe("GET main root API", () => {
  it("Should return welcome message", async () => {
    const response = await supertest(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello World");
  });
});
