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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const data_1 = require("./data");
const bcrypt_1 = require("bcrypt");
const prisma = new client_1.PrismaClient();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // region delete
    // region delete
    //   await prisma.profile.deleteMany();
    //   console.log("Deleted profile in welcome table");
    //   // Get the sequence name for the profile table
    //   const result = await prisma.$queryRaw<{ sequence_name: string }[]>`
    //    SELECT pg_get_serial_sequence('Profile', 'id') as sequence_name
    //  `;
    //   const sequenceName = result[0].sequence_name;
    //   // Reset the auto-increment sequence for the profile table
    //   await prisma.$executeRawUnsafe(
    //     `ALTER SEQUENCE ${sequenceName} RESTART WITH 1`
    //   );
    //   console.log("Reset profile auto increment to 1");
    //   await prisma.user.deleteMany();
    //   console.log("Deleted records in user table");
    //   // Get the sequence name for the user table
    //   const userResult = await prisma.$queryRaw<{ sequence_name: string }[]>`
    //    SELECT pg_get_serial_sequence('User', 'id') as sequence_name
    //  `;
    //   const userSequenceName = userResult[0].sequence_name;
    //   // Reset the auto-increment sequence for the user table
    //   await prisma.$executeRawUnsafe(
    //     `ALTER SEQUENCE ${userSequenceName} RESTART WITH 1`
    //   );
    //   console.log("Reset user auto increment to 1");
    // endregion
    // endregion
    // region insert master
    for (const user of data_1.users) {
        const newUser = Object.assign(Object.assign({}, user), { password: yield generateHash(user.password) });
        yield prisma.user.create({
            data: newUser,
        });
    }
    console.log("Inserted records in user table");
    yield prisma.profile.createMany({
        data: data_1.profiles,
    });
    console.log("Inserted records in profile table");
    // endregion
});
function generateHash(password) {
    return (0, bcrypt_1.hash)(password, 10);
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
