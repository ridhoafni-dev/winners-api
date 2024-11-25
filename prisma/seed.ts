import { PrismaClient, Role } from "@prisma/client";
import { profiles, users } from "./data";
import { genSalt, hash } from "bcrypt";

const prisma = new PrismaClient();

const main = async () => {
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
