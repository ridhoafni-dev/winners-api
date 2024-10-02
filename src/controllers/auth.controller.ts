import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import { compare, genSalt, hash } from "bcrypt";
import { transporter } from "../helpers/nodemailer";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import { decode, sign } from "jsonwebtoken";
import { redisClient } from "../helpers/redis";
import { log } from "console";
import { Role } from "@prisma/client";

export class AuthController {
  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        email,
        password,
        role,
        name,
        address,
        nim,
        stase,
        startSchoolYear,
        endSchoolYear,
      } = req.body;
      const checkUser = await prisma.user.findUnique({ where: { email } });

      if (checkUser) {
        throw new Error("Email is already exist");
      }

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email,
            password: hashPassword,
            role,
          },
        });

        await tx.profile.create({
          data: {
            userId: newUser.id,
            name,
            address,
            nim,
            stase,
            startSchoolYear: Number(startSchoolYear),
            endSchoolYear: Number(endSchoolYear),
          },
        });
      });

      res.status(200).send({ success: true, message: "Register success" });
    } catch (error: any) {
      console.log(error);
      next(error); // meneruskan error ke handleError di app.ts
    }
  }

  async updateUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.user.update({
        where: { id: Number(id) },
        data: {
          isActive: true,
        },
      });

      res.status(200).send({ success: true, message: "Update success" });
    } catch (error: any) {
      next(error);
    }
  }
  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const checkUser = await prisma.user.findUnique({
        where: { email },
        include: { profile: true },
      });
      if (!checkUser) {
        throw new Error("Email not found");
      }

      const checkPassword = await compare(password, checkUser.password);

      if (!checkPassword) {
        throw new Error("Password not found");
      }

      const payload = {
        id: checkUser.id,
        email: checkUser.email,
        role: checkUser.role,
        profile: checkUser.profile,
      };

      const secret = "123jwt";
      const expired = "1d";
      const token = sign(payload, secret, { expiresIn: expired });

      const { name, address, nim, stase, startSchoolYear, endSchoolYear } =
        checkUser.profile || {};

      return res.status(200).send({
        status: true,
        data: {
          id: checkUser.id,
          email: checkUser.email,
          role: checkUser.role,
          name,
          address,
          nim,
          stase,
          startSchoolYear,
          endSchoolYear,
          token,
        },
      });
    } catch (error: any) {
      next(error); // meneruskan error ke handleError di app.ts
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. check user by email
      const checkUser = await prisma.user.findUnique({
        where: { email: req.body.email },
      });
      if (checkUser) {
        // 2.  if exist generate token and send to email
        const token = sign(
          {
            id: checkUser?.id,
            role: checkUser?.role,
            email: checkUser?.email,
          },
          "123jwt"
        );

        // menyimpan token yg aktif
        await redisClient.setEx(`forgot:${req.body.email}`, 3600, token);

        const templateMail = path.join(
          __dirname,
          "../templates",
          "forgotpassword.hbs"
        );

        const templateSource = fs.readFileSync(templateMail, "utf-8");
        const compileTemplate = handlebars.compile(templateSource);
        await transporter.sendMail({
          from: "Free Blog",
          to: req.body.email,
          subject: "Request forgot password",
          html: compileTemplate({
            url: `http://localhost:3000/reset-password/?tkn=${token}`,
          }),
        });

        return res
          .status(200)
          .send({ success: true, message: "Check your email" });
      } else {
        // 3. if no exist throw error
        throw new Error("Account is not exist");
      }
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const { password, confirmPassword, id } = req.body;
    try {
      // 1. check user by email
      const checkUser = await prisma.user.findUnique({
        where: { id: id },
      });

      if (!checkUser) {
        throw new Error("Account is not exist");
      }

      const salt = await genSalt(10);
      const hashPassword = await hash(confirmPassword, salt);

      await prisma.user.update({
        where: { id: id },
        data: {
          password: hashPassword,
        },
      });

      // 2. if exist generate token and send to email
      // 3. if no exist throw error

      console.log("Data from token", req.dataUser);
      console.log("Data pass", req.body.password);
      console.log("Data confirmPassword", req.body.confirmPassword);
    } catch (error) {
      next(error);
    }
  }

  async getLecturers(req: Request, res: Response, next: NextFunction) {
    try {
      const lecturers = await prisma.user.findMany({
        where: { role: "LECTURER" },
        include: { profile: true },
      });

      const lecturersMapped = lecturers.map((lecturer) => {
        return {
          id: lecturer.id,
          name: lecturer.profile?.name,
          email: lecturer.email,
          role: lecturer.role,
        };
      });

      return res.status(200).send({ status: true, data: lecturersMapped });
    } catch (error) {
      next(error);
    }
  }

  async getUsersByRoleByDate(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate, role } = req.params;

      const users = await prisma.user.findMany({
        where: {
          role: role as Role,
          createAt: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string),
          },
        },
        include: {
          profile: true,
        },
      });
      let usersMapped = users.map((data) => {
        return {
          ...data,
          createAt: data.createAt.toISOString(),
        };
      });

      return res.status(200).send({ status: true, data: usersMapped });
    } catch (error) {
      next(error);
    }
  }
}
