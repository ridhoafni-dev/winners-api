"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const prisma_1 = __importDefault(require("../prisma"));
const app = new app_1.default().app;
describe("TEST AUTH", () => {
    beforeEach(() => {
        // menyiapkan program yg ingin dijalankan terlebih dahulu sebelum running test});
    });
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // menyiapkan program yg sekali dijalankan sebelum test dijalankan
        yield prisma_1.default.$connect;
    }));
    afterEach(() => { });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma_1.default.$disconnect;
    }));
    it("POST /auth/regis", () => __awaiter(void 0, void 0, void 0, function* () {
        const regisResult = yield (0, supertest_1.default)(app).post("/auth/regis").send({
            username: "vicilo3730",
            email: "vicilo3730@konican.com",
            password: "vicilo3730",
        });
        expect(regisResult.status).toBe(201);
        expect(regisResult.body.success).toBeTruthy();
    }));
});
