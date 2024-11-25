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
exports.ReportController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const fs_1 = __importDefault(require("fs"));
class ReportController {
    getReports(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataReports = yield prisma_1.default.report.findMany({
                    where: {
                        active: true,
                    },
                    include: {
                        user: { select: { id: true, email: true, role: true } },
                        reportLecturer: true,
                    },
                });
                return res.status(200).send({ status: true, data: dataReports });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getReportsByUserId(req, res, next) {
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
                const dataReports = yield prisma_1.default.report.findMany({
                    where: {
                        userId: Number(userId),
                        active: true,
                    },
                    include: {
                        user: { select: { id: true, email: true, role: true } },
                        reportLecturer: true,
                    },
                });
                return res.status(200).send({ status: true, data: dataReports });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getReportsByUserIdByDate(req, res, next) {
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
                const dataReports = yield prisma_1.default.report.findMany({
                    where: Object.assign(Object.assign({}, (isLecturer ? {} : { userId: Number(userId) })), { createAt: {
                            gte: new Date(startDate),
                            lte: new Date(endDate),
                        }, active: true }),
                    include: {
                        user: { select: { id: true, email: true, role: true } },
                        reportLecturer: true,
                    },
                });
                let mapped = dataReports.map((data) => {
                    return Object.assign(Object.assign({}, data), { image: `${req.get("host")}/${data.image}`, createAt: data.createAt.toISOString() });
                });
                if (isLecturer) {
                    mapped = mapped.filter((data) => {
                        var _a;
                        return ((_a = data.reportLecturer) === null || _a === void 0 ? void 0 : _a.userId) === Number(userId);
                    });
                }
                return res.status(200).send({ status: true, data: mapped });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createReport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, date, lecturerId } = req.body;
                const checkUser = yield prisma_1.default.user.findUnique({
                    where: {
                        id: Number(userId),
                    },
                });
                if (!checkUser) {
                    throw new Error("User not found");
                }
                yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const createReport = yield prisma_1.default.report.create({
                        data: {
                            userId: Number(userId),
                            date: new Date(date),
                            active: true,
                            image: `document/${(_a = req.file) === null || _a === void 0 ? void 0 : _a.filename}`,
                        },
                    });
                    yield tx.reportLecturer.create({
                        data: {
                            userId: Number(lecturerId),
                            reportId: Number(createReport.id),
                        },
                    });
                    return res.status(200).send({ status: true, data: createReport });
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateReport(req, res, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, date, active } = req.body;
                const { id } = req.params;
                const checkUser = yield prisma_1.default.user.findUnique({
                    where: {
                        id: Number(userId),
                    },
                });
                if (!checkUser) {
                    throw new Error("User not found");
                }
                const checkReport = yield prisma_1.default.report.findUnique({
                    where: {
                        id: Number(id),
                    },
                });
                if (!checkReport) {
                    throw new Error("Report not found");
                }
                if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) {
                    fs_1.default.unlink("./public/document/" + checkReport.image.replace("document/", ""), (err) => {
                        if (err) {
                            console.log(err);
                            throw new Error(err.message);
                        }
                    });
                }
                const updateReport = yield prisma_1.default.report.update({
                    where: { id: Number(id) },
                    data: Object.assign(Object.assign({ userId: Number(userId) }, (((_b = req.file) === null || _b === void 0 ? void 0 : _b.filename)
                        ? { image: `document/${(_c = req.file) === null || _c === void 0 ? void 0 : _c.filename}` }
                        : {})), { active: JSON.parse(active), date: new Date(date), updatedAt: new Date().toISOString() }),
                });
                return res.status(200).send({
                    success: true,
                    data: {
                        data: updateReport,
                    },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ReportController = ReportController;
