import { Prisma, PrismaClient } from "@prisma/client";

export default new PrismaClient({
  log: ["query", "info", "warn", "error"],
  transactionOptions: {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    maxWait: 5000, // default: 2000
    timeout: 10000, // default: 5000
  },
});
