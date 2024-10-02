import { Role } from "@prisma/client";

export const users = [
  {
    email: "student@test.com",
    password: "Qwerty1234",
    role: Role.STUDENT,
  },
  {
    email: "lecturer@test.com",
    password: "Qwerty1234",
    role: Role.LECTURER,
  },
  {
    email: "admin@test.com",
    password: "Qwerty1234",
    role: Role.ADMIN,
  },
];

export const profiles = [
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
