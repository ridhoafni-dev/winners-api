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
exports.AuthController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const bcrypt_1 = require("bcrypt");
const nodemailer_1 = require("../helpers/nodemailer");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const jsonwebtoken_1 = require("jsonwebtoken");
const redis_1 = require("../helpers/redis");
class AuthController {
    registerUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, role, name, address, nim, stase, startSchoolYear, endSchoolYear, } = req.body;
                const checkUser = yield prisma_1.default.user.findUnique({ where: { email } });
                if (checkUser) {
                    throw new Error("Email is already exist");
                }
                const salt = yield (0, bcrypt_1.genSalt)(10);
                const hashPassword = yield (0, bcrypt_1.hash)(password, salt);
                yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const newUser = yield tx.user.create({
                        data: {
                            email,
                            password: hashPassword,
                            role,
                        },
                    });
                    yield tx.profile.create({
                        data: {
                            userId: newUser.id,
                            name,
                            address,
                            nim,
                            stase,
                            startSchoolYear: Number(startSchoolYear),
                            endSchoolYear: Number(endSchoolYear),
                        },
                    });
                }));
                res.status(200).send({ success: true, message: "Register success" });
            }
            catch (error) {
                console.log(error);
                next(error); // meneruskan error ke handleError di app.ts
            }
        });
    }
    updateUserStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield prisma_1.default.user.update({
                    where: { id: Number(id) },
                    data: {
                        isActive: true,
                    },
                });
                res.status(200).send({ success: true, message: "Update success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    loginUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const checkUser = yield prisma_1.default.user.findUnique({
                    where: { email },
                    include: { profile: true },
                });
                if (!checkUser) {
                    throw new Error("Email not found");
                }
                const checkPassword = yield (0, bcrypt_1.compare)(password, checkUser.password);
                if (!checkPassword) {
                    throw new Error("Password not found");
                }
                const payload = {
                    id: checkUser.id,
                    email: checkUser.email,
                    role: checkUser.role,
                    profile: checkUser.profile,
                };
                const secret = "123jwt";
                const expired = "1d";
                const token = (0, jsonwebtoken_1.sign)(payload, secret, { expiresIn: expired });
                const { name, address, nim, stase, startSchoolYear, endSchoolYear } = checkUser.profile || {};
                return res.status(200).send({
                    status: true,
                    data: {
                        id: checkUser.id,
                        email: checkUser.email,
                        role: checkUser.role,
                        name,
                        address,
                        nim,
                        stase,
                        startSchoolYear,
                        endSchoolYear,
                        token,
                    },
                });
            }
            catch (error) {
                next(error); // meneruskan error ke handleError di app.ts
            }
        });
    }
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1. check user by email
                const checkUser = yield prisma_1.default.user.findUnique({
                    where: { email: req.body.email },
                });
                if (checkUser) {
                    // 2.  if exist generate token and send to email
                    const token = (0, jsonwebtoken_1.sign)({
                        id: checkUser === null || checkUser === void 0 ? void 0 : checkUser.id,
                        role: checkUser === null || checkUser === void 0 ? void 0 : checkUser.role,
                        email: checkUser === null || checkUser === void 0 ? void 0 : checkUser.email,
                    }, "123jwt");
                    // menyimpan token yg aktif
                    yield redis_1.redisClient.setEx(`forgot:${req.body.email}`, 3600, token);
                    const templateMail = path_1.default.join(__dirname, "../templates", "forgotpassword.hbs");
                    const templateSource = fs_1.default.readFileSync(templateMail, "utf-8");
                    const compileTemplate = handlebars_1.default.compile(templateSource);
                    yield nodemailer_1.transporter.sendMail({
                        from: "Free Blog",
                        to: req.body.email,
                        subject: "Request forgot password",
                        html: compileTemplate({
                            url: `http://localhost:3000/reset-password/?tkn=${token}`,
                        }),
                    });
                    return res
                        .status(200)
                        .send({ success: true, message: "Check your email" });
                }
                else {
                    // 3. if no exist throw error
                    throw new Error("Account is not exist");
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, confirmPassword, id } = req.body;
            try {
                // 1. check user by email
                const checkUser = yield prisma_1.default.user.findUnique({
                    where: { id: id },
                });
                if (!checkUser) {
                    throw new Error("Account is not exist");
                }
                const salt = yield (0, bcrypt_1.genSalt)(10);
                const hashPassword = yield (0, bcrypt_1.hash)(confirmPassword, salt);
                yield prisma_1.default.user.update({
                    where: { id: id },
                    data: {
                        password: hashPassword,
                    },
                });
                // 2. if exist generate token and send to email
                // 3. if no exist throw error
                console.log("Data from token", req.dataUser);
                console.log("Data pass", req.body.password);
                console.log("Data confirmPassword", req.body.confirmPassword);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getLecturers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lecturers = yield prisma_1.default.user.findMany({
                    where: { role: "LECTURER" },
                    include: { profile: true },
                });
                const lecturersMapped = lecturers.map((lecturer) => {
                    var _a;
                    return {
                        id: lecturer.id,
                        name: (_a = lecturer.profile) === null || _a === void 0 ? void 0 : _a.name,
                        email: lecturer.email,
                        role: lecturer.role,
                    };
                });
                return res.status(200).send({ status: true, data: lecturersMapped });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUsersByRoleByDate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate, role } = req.params;
                const users = yield prisma_1.default.user.findMany({
                    where: {
                        role: role,
                        createAt: {
                            gte: new Date(startDate),
                            lte: new Date(endDate),
                        },
                    },
                    include: {
                        profile: true,
                    },
                });
                let usersMapped = users.map((data) => {
                    return Object.assign(Object.assign({}, data), { createAt: data.createAt.toISOString() });
                });
                return res.status(200).send({ status: true, data: usersMapped });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AuthController = AuthController;
