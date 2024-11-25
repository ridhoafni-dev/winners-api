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
exports.ActivityPlanController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class ActivityPlanController {
    getActivityPlans(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataActivityPlans = yield prisma_1.default.activityPlan.findMany({
                    where: {
                        active: true,
                    },
                    include: {
                        user: { select: { id: true, email: true, role: true } },
                        activityPlanComment: true,
                    },
                });
                return res.status(200).send({ status: true, data: dataActivityPlans });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getActivityPlansByUserId(req, res, next) {
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
                const dataActivityPlans = yield prisma_1.default.activityPlan.findMany({
                    where: {
                        userId: Number(userId),
                        active: true,
                    },
                    include: {
                        user: { select: { id: true, email: true, role: true } },
                        activityPlanComment: true,
                    },
                });
                return res.status(200).send({ status: true, data: dataActivityPlans });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getActivityPlansByUserIdByDate(req, res, next) {
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
                const dataActivityPlans = yield prisma_1.default.activityPlan.findMany({
                    where: Object.assign(Object.assign({}, (isLecturer ? {} : { userId: Number(userId) })), { createAt: {
                            gte: new Date(startDate),
                            lte: new Date(endDate),
                        }, active: true }),
                    include: {
                        user: { select: { id: true, email: true, role: true } },
                        activityPlanComment: true,
                        activityPlanLecturer: true,
                    },
                });
                let mapped = dataActivityPlans.map((data) => {
                    return Object.assign(Object.assign({}, data), { createAt: data.createAt.toISOString() });
                });
                if (isLecturer) {
                    mapped = mapped.filter((data) => {
                        var _a;
                        return ((_a = data.activityPlanLecturer) === null || _a === void 0 ? void 0 : _a.userId) === Number(userId);
                    });
                }
                return res.status(200).send({ status: true, data: mapped });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createActivityPlan(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, name, startDate, endDate, status, lecturerId } = req.body;
                const checkUser = yield prisma_1.default.user.findUnique({
                    where: {
                        id: Number(userId),
                    },
                });
                if (!checkUser) {
                    throw new Error("User not found");
                }
                yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const createActivityPlan = yield prisma_1.default.activityPlan.create({
                        data: {
                            userId: Number(userId),
                            name,
                            startDate: new Date(startDate),
                            endDate: new Date(endDate),
                            status,
                        },
                    });
                    yield tx.activityPlanLecturer.create({
                        data: {
                            userId: Number(lecturerId),
                            activityPlanId: Number(createActivityPlan.id),
                        },
                    });
                    return res.status(200).send({ status: true, data: createActivityPlan });
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateActivityPlan(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, name, startDate, endDate, status, active } = req.body;
                const { id } = req.params;
                const checkUser = yield prisma_1.default.user.findUnique({
                    where: {
                        id: Number(userId),
                    },
                });
                if (!checkUser) {
                    throw new Error("User not found");
                }
                const checkActivityPlan = yield prisma_1.default.activityPlan.findUnique({
                    where: {
                        id: Number(id),
                    },
                });
                if (!checkActivityPlan) {
                    throw new Error("Activity plan not found");
                }
                const updateEvaluation = yield prisma_1.default.activityPlan.update({
                    where: { id: Number(id) },
                    data: {
                        userId: Number(userId),
                        active: JSON.parse(active),
                        name,
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                        status,
                        updatedAt: new Date().toISOString(),
                    },
                });
                return res.status(200).send({
                    success: true,
                    data: {
                        data: updateEvaluation,
                    },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createActivityPlanComment(req, res, next) {
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
                const checkActivityPlan = yield prisma_1.default.activityPlan.findUnique({
                    where: { id: Number(id) },
                });
                if (!checkActivityPlan) {
                    throw new Error("Activity plan not found");
                }
                const createActivityPlanComment = yield prisma_1.default.activityPlanComment.create({
                    data: {
                        userId: Number(userId),
                        rating: Number(rating),
                        comment,
                        activityPlanId: Number(id),
                    },
                });
                return res
                    .status(200)
                    .send({ status: true, data: createActivityPlanComment });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ActivityPlanController = ActivityPlanController;
