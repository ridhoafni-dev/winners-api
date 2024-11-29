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
exports.ObservationController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const fs_1 = __importDefault(require("fs"));
class ObservationController {
    getObservations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dataObservations = yield prisma_1.default.observation.findMany({
                    where: {
                        active: true,
                    },
                    include: {
                        user: { select: { id: true, email: true, role: true } },
                        observationComments: true,
                    },
                });
                dataObservations = dataObservations.map((data) => {
                    return Object.assign(Object.assign({}, data), { image: `${req.get("host")}/${data.image}` });
                });
                return res.status(200).send({ status: true, data: dataObservations });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getObservationsByUserId(req, res, next) {
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
                let dataObservations = yield prisma_1.default.observation.findMany({
                    where: {
                        userId: Number(userId),
                        active: true,
                    },
                    include: {
                        user: { select: { id: true, email: true, role: true } },
                        observationComments: true,
                    },
                });
                dataObservations = dataObservations.map((data) => {
                    return Object.assign(Object.assign({}, data), { image: `${req.get("host")}/${data.image}` });
                });
                return res.status(200).send({ status: true, data: dataObservations });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getObservationsByUserIdByDate(req, res, next) {
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
                const dataObservations = yield prisma_1.default.observation.findMany({
                    where: Object.assign(Object.assign({}, (isLecturer ? {} : { userId: Number(userId) })), { createAt: {
                            gte: new Date(startDate),
                            lte: new Date(endDate),
                        }, active: true }),
                    include: {
                        user: { select: { id: true, email: true, role: true } },
                        observationComments: true,
                        observationLecturers: true,
                    },
                });
                let mapped = dataObservations.map((data) => {
                    return Object.assign(Object.assign({}, data), { image: `${req.get("host")}/${data.image}`, createAt: data.createAt.toISOString() });
                });
                if (isLecturer) {
                    mapped = mapped.filter((data) => {
                        var _a;
                        return ((_a = data.observationLecturers) === null || _a === void 0 ? void 0 : _a.userId) === Number(userId);
                    });
                }
                return res.status(200).send({ status: true, data: mapped });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createObservation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { userId, name, description, date, lecturerId } = req.body;
                const checkUser = yield prisma_1.default.user.findUnique({
                    where: {
                        id: Number(userId),
                    },
                });
                if (!checkUser) {
                    fs_1.default.unlink(`./public/image/${(_a = req.file) === null || _a === void 0 ? void 0 : _a.filename}`, () => { });
                    throw new Error("User not found");
                }
                yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const createObservation = yield tx.observation.create({
                        data: {
                            userId: Number(userId),
                            name,
                            description,
                            date: new Date(date),
                            image: `image/${(_a = req.file) === null || _a === void 0 ? void 0 : _a.filename}`,
                        },
                    });
                    yield tx.observationLecturer.create({
                        data: {
                            userId: Number(lecturerId),
                            observationId: Number(createObservation.id),
                        },
                    });
                    return res.status(200).send({ status: true, data: createObservation });
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateObservation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const { userId, name, description, date, active } = req.body;
                const { id } = req.params;
                const checkUser = yield prisma_1.default.user.findUnique({
                    where: {
                        id: Number(userId),
                    },
                });
                if (!checkUser) {
                    throw new Error("User not found");
                }
                const checkObservation = yield prisma_1.default.observation.findUnique({
                    where: { id: Number(id) },
                });
                if (!checkObservation) {
                    throw new Error("Observation not found");
                }
                if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) {
                    fs_1.default.unlink("./public/image/" + checkObservation.image.replace("image/", ""), (err) => {
                        if (err) {
                            console.log(err);
                            throw new Error(err.message);
                        }
                    });
                }
                const updateObservation = yield prisma_1.default.observation.update({
                    where: { id: Number(id) },
                    data: Object.assign(Object.assign({}, (((_b = req.file) === null || _b === void 0 ? void 0 : _b.filename)
                        ? { image: `image/${(_c = req.file) === null || _c === void 0 ? void 0 : _c.filename}` }
                        : {})), { userId: Number(userId), name,
                        description, date: new Date(date), updatedAt: new Date().toISOString(), active: JSON.parse(active) }),
                });
                return res.status(200).send({
                    success: true,
                    data: {
                        data: updateObservation,
                    },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createObservationComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, rating, comment } = req.body;
                const { id } = req.params;
                const checkUser = yield prisma_1.default.user.findUnique({
                    where: {
                        id: userId,
                    },
                });
                if (!checkUser) {
                    throw new Error("User not found");
                }
                const checkObservation = yield prisma_1.default.observation.findUnique({
                    where: { id: Number(id) },
                });
                if (!checkObservation) {
                    throw new Error("Observation not found");
                }
                const checkObservationComment = yield prisma_1.default.observationComment.findUnique({
                    where: { id: Number(id) },
                });
                if (checkObservationComment) {
                    throw new Error("Observation comment already exists");
                }
                const createObservationComment = yield prisma_1.default.observationComment.create({
                    data: {
                        userId,
                        rating: Number(rating),
                        comment,
                        observationId: Number(id),
                    },
                });
                return res
                    .status(200)
                    .send({ status: true, data: createObservationComment });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ObservationController = ObservationController;
