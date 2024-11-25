"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profiles = exports.users = void 0;
const client_1 = require("@prisma/client");
exports.users = [
    {
        email: "student@test.com",
        password: "Qwerty1234",
        role: client_1.Role.STUDENT,
    },
    {
        email: "lecturer@test.com",
        password: "Qwerty1234",
        role: client_1.Role.LECTURER,
    },
    {
        email: "admin@test.com",
        password: "Qwerty1234",
        role: client_1.Role.ADMIN,
    },
];
exports.profiles = [
    {
        userId: 1,
        name: "Student 1",
        address: "Jl. Cempaka",
        nim: "12345678",
        stase: "TIF",
        startSchoolYear: 2020,
        endSchoolYear: 2023,
    },
    {
        userId: 2,
        name: "Lecturer 1",
        address: "Jl. Cempaka",
        nim: "123456789",
        stase: "SIF",
        startSchoolYear: 2020,
        endSchoolYear: 2023,
    },
    {
        userId: 3,
        name: "Admin",
        address: "Jl. Cempaka",
        nim: "12345678910",
        stase: "SIF",
        startSchoolYear: 2020,
        endSchoolYear: 2023,
    },
];
