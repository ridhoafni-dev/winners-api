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
exports.MemoController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class MemoController {
    getMemos(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataMemos = yield prisma_1.default.memo.findMany({
                    where: {
                        active: true,
                    },
                    include: {
                        user: { select: { id: true, email: true, role: true } },
                        memoComment: true,
                    },
                });
                return res.status(200).send({ status: true, data: dataMemos });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getMemosByUserId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const dataMemos = yield prisma_1.default.memo.findMany({
                    where: {
                        userId: Number(userId),
                        active: true,
                    },
                    include: {
                        user: { select: { id: true, email: true, role: true } },
                        memoComment: true,
                    },
                });
                return res.status(200).send({ status: true, data: dataMemos });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getMemosByUserIdByDate(req, res, next) {
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
                const dataMemos = yield prisma_1.default.memo.findMany({
                    where: Object.assign(Object.assign({}, (isLecturer ? {} : { userId: Number(userId) })), { createAt: {
                            gte: new Date(startDate),
                            lte: new Date(endDate),
                        }, active: true }),
                    include: {
                        user: { select: { id: true, email: true, role: true } },
                        memoComment: true,
                        memoLecturer: true,
                    },
                });
                let mapped = dataMemos.map((data) => {
                    return Object.assign(Object.assign({}, data), { createAt: data.createAt.toISOString() });
                });
                if (isLecturer) {
                    mapped = mapped.filter((data) => {
                        var _a;
                        return ((_a = data.memoLecturer) === null || _a === void 0 ? void 0 : _a.userId) === Number(userId);
                    });
                }
                return res.status(200).send({ status: true, data: mapped });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createMemo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, lecturerId, title } = req.body;
                const checkUser = yield prisma_1.default.user.findUnique({
                    where: {
                        id: Number(userId),
                    },
                });
                if (!checkUser) {
                    throw new Error("User not found");
                }
                yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const createMemo = yield tx.memo.create({
                        data: {
                            userId: Number(userId),
                            title,
                        },
                    });
                    yield tx.memoLecturer.create({
                        data: {
                            userId: Number(lecturerId),
                            memoId: Number(createMemo.id),
                        },
                    });
                    return res.status(200).send({ status: true, data: createMemo });
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateMemo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, title, active } = req.body;
                const { id } = req.params;
                const checkUser = yield prisma_1.default.user.findUnique({
                    where: {
                        id: Number(userId),
                    },
                });
                if (!checkUser) {
                    throw new Error("User not found");
                }
                const checkSelfEvaluation = yield prisma_1.default.memo.findUnique({
                    where: { id: Number(id) },
                });
                if (!checkSelfEvaluation) {
                    throw new Error("Memo not found");
                }
                const updateMemo = yield prisma_1.default.memo.update({
                    where: { id: Number(id) },
                    data: {
                        title,
                        active: JSON.parse(active),
                        updatedAt: new Date().toISOString(),
                    },
                });
                return res.status(200).send({
                    success: true,
                    data: {
                        data: updateMemo,
                    },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createMemoComment(req, res, next) {
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
                const checkMemo = yield prisma_1.default.memo.findUnique({
                    where: { id: Number(id) },
                });
                if (!checkMemo) {
                    throw new Error("Memo not found");
                }
                const checkMemoComment = yield prisma_1.default.memoComment.findUnique({
                    where: { id: Number(id) },
                });
                if (checkMemoComment) {
                    throw new Error("Memo comment already exists");
                }
                const createMemoComment = yield prisma_1.default.memoComment.create({
                    data: {
                        userId: Number(userId),
                        rating: Number(rating),
                        comment,
                        memoId: Number(id),
                    },
                });
                return res.status(200).send({ status: true, data: createMemoComment });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.MemoController = MemoController;
