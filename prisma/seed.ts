import { PrismaClient, Role } from "@prisma/client";
import { profiles, users } from "./data";
import { genSalt, hash } from "bcrypt";

const prisma = new PrismaClient();

const main = async () => {
  // region delete

  await prisma.profile.deleteMany();
  console.log("Deleted profile in welcome table");
  await prisma.$queryRaw`ALTER TABLE profile AUTO_INCREMENT = 1`;
  console.log("reset profile auto increment to 1");

  await prisma.user.deleteMany();
  console.log("Deleted records in user table");
  await prisma.$queryRaw`ALTER TABLE user AUTO_INCREMENT = 1`;
  console.log("reset user auto increment to 1");

  // endregion
  // region insert master

  for (const user of users) {
    const newUser = {
      ...user,
      password: await generateHash(user.password),
    };

    await prisma.user.create({
      data: newUser,
    });
  }
  console.log("Inserted records in user table");

  await prisma.profile.createMany({
    data: profiles,
  });
  console.log("Inserted records in profile table");

  // endregion
};

function generateHash(password: string) {
  return hash(password, 10);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
