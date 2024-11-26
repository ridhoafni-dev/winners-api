import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export class SelfReflectionController {
  async getSelfReflections(req: Request, res: Response, next: NextFunction) {
    try {
      const dataReflections = await prisma.selfEvaluation.findMany({
        where: {
          active: true,
        },
        include: {
          user: { select: { id: true, email: true, role: true } },
          selfEvaluation: true,
        },
      });
      return res.status(200).send({ status: true, data: dataReflections });
    } catch (error) {
      next(error);
    }
  }

  async getSelfReflectionByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;

      const checkUser = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });

      if (!checkUser) {
        throw new Error("User not found");
      }

      const dataReflections = await prisma.selfEvaluation.findMany({
        where: {
          userId: Number(userId),
          active: true,
        },
        include: {
          user: { select: { id: true, email: true, role: true } },
          selfEvaluation: true,
        },
      });
      let mapped = dataReflections.map((data) => {
        return {
          ...data,
          createAt: data.createAt.toISOString(),
        };
      });
      return res.status(200).send({ status: true, data: mapped });
    } catch (error) {
      next(error);
    }
  }

  async getSelfReflectionByUserIdByDate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, startDate, endDate, lecturer } = req.params;
      const isLecturer = Number(lecturer) ? true : false;
      const checkUser = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });

      if (!checkUser) {
        throw new Error("User not found");
      }

      const dataReflections = await prisma.selfEvaluation.findMany({
        where: {
          ...(isLecturer ? {} : { userId: Number(userId) }),
          createAt: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string),
          },
          active: true,
        },
        include: {
          user: { select: { id: true, email: true, role: true } },
          selfEvaluationLecturer: true,
          selfEvaluation: true,
        },
      });
      let mapped = dataReflections.map((data) => {
        return {
          ...data,
          createAt: data.createAt.toISOString(),
        };
      });

      if (isLecturer) {
        mapped = mapped.filter((data) => {
          return data.selfEvaluationLecturer?.userId === Number(userId);
        });
      }

      return res.status(200).send({ status: true, data: mapped });
    } catch (error) {
      next(error);
    }
  }

  async createSelfReflection(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, description, lecturerId } = req.body;
      const checkUser = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });

      if (!checkUser) {
        throw new Error("User not found");
      }

      await prisma.$transaction(
        async (tx) => {
          const createSelfReflection = await tx.selfEvaluation.create({
            data: {
              userId: Number(userId),
              description,
            },
          });

          await tx.selfEvaluationLecturer.create({
            data: {
              userId: Number(lecturerId),
              selfEvaluationId: Number(createSelfReflection.id),
            },
          });

          return res
            .status(200)
            .send({ status: true, data: createSelfReflection });
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  async updateSelfReflection(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, description, active } = req.body;
      const { id } = req.params;
      const checkUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!checkUser) {
        throw new Error("User not found");
      }

      const updateReflection = await prisma.selfEvaluation.update({
        where: { id: Number(id) },
        data: {
          description,
          active: active,
          updatedAt: new Date().toISOString(),
        },
      });

      return res.status(200).send({
        success: true,
        data: {
          data: updateReflection,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  async createSelfReflectionComment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, rating, comment } = req.body;
      const { id } = req.params;
      const checkUser = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });

      if (!checkUser) {
        throw new Error("User not found");
      }

      const checkSelfReflection = await prisma.selfEvaluation.findUnique({
        where: { id: Number(id) },
      });

      if (!checkSelfReflection) {
        throw new Error("Self Reflection not found");
      }

      const checkSelfReflectionComment =
        await prisma.selfEvaluationComment.findUnique({
          where: {
            selfEvaluationId: Number(id),
          },
        });

      if (checkSelfReflectionComment) {
        throw new Error("Self Reflection comment already exists");
      }

      const createSelfReflectionComment =
        await prisma.selfEvaluationComment.create({
          data: {
            userId: Number(userId),
            rating: Number(rating),
            comment,
            selfEvaluationId: Number(id),
          },
        });

      return res
        .status(200)
        .send({ status: true, data: createSelfReflectionComment });
    } catch (error) {
      next(error);
    }
  }
}
