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
exports.SelfReflectionController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class SelfReflectionController {
    getSelfReflections(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataReflections = yield prisma_1.default.selfEvaluation.findMany({
                    where: {
                        active: true,
                    },
                    include: {
                        user: { select: { id: true, email: true, role: true } },
                        selfEvaluation: true,
                    },
                });
                return res.status(200).send({ status: true, data: dataReflections });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getSelfReflectionByUserId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const checkUser = yield prisma_1.default.user.findUnique({
                    where: {
                        id: Number(userId),
                    },
                });
                if (!checkUser) {
                    throw new Error("User not found");
                }
                const dataReflections = yield prisma_1.default.selfEvaluation.findMany({
                    where: {
                        userId: Number(userId),
                        active: true,
                    },
                    include: {
                        user: { select: { id: true, email: true, role: true } },
                        selfEvaluation: true,
                    },
                });
                let mapped = dataReflections.map((data) => {
                    return Object.assign(Object.assign({}, data), { createAt: data.createAt.toISOString() });
                });
                return res.status(200).send({ status: true, data: mapped });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getSelfReflectionByUserIdByDate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, startDate, endDate, lecturer } = req.params;
                const isLecturer = Number(lecturer) ? true : false;
                const checkUser = yield prisma_1.default.user.findUnique({
                    where: {
                        id: Number(userId),
                    },
                });
                if (!checkUser) {
                    throw new Error("User not found");
                }
                const dataReflections = yield prisma_1.default.selfEvaluation.findMany({
                    where: Object.assign(Object.assign({}, (isLecturer ? {} : { userId: Number(userId) })), { createAt: {
                            gte: new Date(startDate),
                            lte: new Date(endDate),
                        }, active: true }),
                    include: {
                        user: { select: { id: true, email: true, role: true } },
                        selfEvaluationLecturer: true,
                        selfEvaluation: true,
                    },
                });
                let mapped = dataReflections.map((data) => {
                    return Object.assign(Object.assign({}, data), { createAt: data.createAt.toISOString() });
                });
                if (isLecturer) {
                    mapped = mapped.filter((data) => {
                        var _a;
                        return ((_a = data.selfEvaluationLecturer) === null || _a === void 0 ? void 0 : _a.userId) === Number(userId);
                    });
                }
                return res.status(200).send({ status: true, data: mapped });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createSelfReflection(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, description, lecturerId } = req.body;
                const checkUser = yield prisma_1.default.user.findUnique({
                    where: {
                        id: Number(userId),
                    },
                });
                if (!checkUser) {
                    throw new Error("User not found");
                }
                yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    yield Promise.all([
                        tx.selfEvaluation.create({
                            data: {
                                userId: Number(userId),
                                description,
                            },
                        }),
                        tx.selfEvaluationLecturer.create({
                            data: {
                                userId: Number(lecturerId),
                                selfEvaluationId: Number(userId),
                            },
                        }),
                    ]);
                    // const createSelfReflection = await tx.selfEvaluation.create({
                    //   data: {
                    //     userId: Number(userId),
                    //     description,
                    //   },
                    // });
                    // await tx.selfEvaluationLecturer.create({
                    //   data: {
                    //     userId: Number(lecturerId),
                    //     selfEvaluationId: Number(createSelfReflection.id),
                    //   },
                    // });
                    return res
                        .status(200)
                        .send({ status: true, data: "Self Reflection created" });
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateSelfReflection(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, description, active } = req.body;
                const { id } = req.params;
                const checkUser = yield prisma_1.default.user.findUnique({
                    where: {
                        id: userId,
                    },
                });
                if (!checkUser) {
                    throw new Error("User not found");
                }
                const updateReflection = yield prisma_1.default.selfEvaluation.update({
                    where: { id: Number(id) },
                    data: {
                        description,
                        active: active,
                        updatedAt: new Date().toISOString(),
                    },
                });
                return res.status(200).send({
                    success: true,
                    data: {
                        data: updateReflection,
                    },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createSelfReflectionComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, rating, comment } = req.body;
                const { id } = req.params;
                const checkUser = yield prisma_1.default.user.findUnique({
                    where: {
                        id: Number(userId),
                    },
                });
                if (!checkUser) {
                    throw new Error("User not found");
                }
                const checkSelfReflection = yield prisma_1.default.selfEvaluation.findUnique({
                    where: { id: Number(id) },
                });
                if (!checkSelfReflection) {
                    throw new Error("Self Reflection not found");
                }
                const checkSelfReflectionComment = yield prisma_1.default.selfEvaluationComment.findUnique({
                    where: {
                        selfEvaluationId: Number(id),
                    },
                });
                if (checkSelfReflectionComment) {
                    throw new Error("Self Reflection comment already exists");
                }
                const createSelfReflectionComment = yield prisma_1.default.selfEvaluationComment.create({
                    data: {
                        userId: Number(userId),
                        rating: Number(rating),
                        comment,
                        selfEvaluationId: Number(id),
                    },
                });
                return res
                    .status(200)
                    .send({ status: true, data: createSelfReflectionComment });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.SelfReflectionController = SelfReflectionController;
