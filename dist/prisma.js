"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
exports.default = new client_1.PrismaClient({
    log: ["query", "info", "warn", "error"],
    transactionOptions: {
        isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
    },
});
