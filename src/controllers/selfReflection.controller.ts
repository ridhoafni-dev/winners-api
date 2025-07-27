import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export class SelfEvaluationController {
  async getSelfEvaluationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const dataReflection = await prisma.selfEvaluation.findUnique({
        where: {
          id: Number(id),
          active: true,
        },
        include: {
          user: {
            select: { id: true, email: true, role: true, profile: true },
          },
          selfEvaluationComments: true,
          selfEvaluationLecturer: {
            select: {
              id: true,
              userId: true,
              user: {
                select: {
                  profile: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      let mapped = {
        ...dataReflection,
        createAt: dataReflection?.createAt.toISOString(),
        selfEvaluationLecturer: dataReflection?.selfEvaluationLecturer
          ? {
              id: dataReflection?.selfEvaluationLecturer?.id,
              userId: dataReflection?.selfEvaluationLecturer?.userId,
              name: dataReflection?.selfEvaluationLecturer?.user?.profile?.name,
            }
          : null,
      };

      return res.status(200).send({ status: true, data: mapped });
    } catch (error) {
      next(error);
    }
  }

  async getSelfEvaluationsByUserIdByDate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, startDate, endDate, lecturer } = req.params;
      const isLecturer = Number(lecturer) ? true : false;
      if (!isLecturer) {
        const checkUser = await prisma.user.findUnique({
          where: {
            id: Number(userId),
          },
        });

        if (!checkUser) {
          throw new Error("User not found");
        }
      }

      // Parse dates and set time components
      const start = new Date(startDate as string);
      start.setHours(0, 0, 0, 0); // Start of day

      const end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999); // End of day

      const dataReflections = await prisma.selfEvaluation.findMany({
        where: {
          ...(isLecturer ? {} : { userId: Number(userId) }),
          createAt: {
            gte: start,
            lte: end,
          },
          active: true,
        },
        include: {
          user: {
            select: { id: true, email: true, role: true, profile: true },
          },
          selfEvaluationLecturer: {
            select: {
              id: true,
              userId: true,
              user: {
                select: {
                  profile: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          selfEvaluationComments: true,
        },
      });
      let mapped = dataReflections.map((data) => {
        return {
          ...data,
          createAt: data.createAt.toISOString(),
          selfEvaluationLecturer: data?.selfEvaluationLecturer
            ? {
                userId: data?.selfEvaluationLecturer?.userId,
                name: data?.selfEvaluationLecturer?.user?.profile?.name,
              }
            : null,
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

  async createSelfEvaluation(req: Request, res: Response, next: NextFunction) {
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

      // Database transaction with increased timeout and logging
      const result = await prisma.$transaction(
        async (tx) => {
          console.log("Starting transaction for SelfEvaluation");

          const selfEvaluation = await tx.selfEvaluation.create({
            data: {
              userId: Number(userId),
              description,
              createAt: new Date(),
            },
          });

          console.log("Created SelfEvaluation:", selfEvaluation);

          if (lecturerId) {
            const selfEvaluationLecturer =
              await tx.selfEvaluationLecturer.create({
                data: {
                  selfEvaluationId: selfEvaluation.id,
                  userId: Number(lecturerId),
                },
              });

            console.log(
              "Created SelfEvaluationLecturer:",
              selfEvaluationLecturer
            );
          }

          console.log("Transaction completed for SelfEvaluation");
          return selfEvaluation;
        },
        {
          timeout: 15000, // Increase timeout to 15 seconds
          maxWait: 5000, // Maximum time to wait for transaction to start
        }
      );

      return res.status(201).json({ status: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateSelfEvaluation(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, description, lecturerId } = req.body;
      const { id } = req.params;
      const checkUser = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });

      if (!checkUser) {
        throw new Error("User not found");
      }

      await prisma.$transaction(async (tx) => {
        const updateReflection = await tx.selfEvaluation.update({
          where: { id: Number(id) },
          data: {
            description,
            active: true,
            updatedAt: new Date().toISOString(),
          },
        });

        await tx.selfEvaluationLecturer.update({
          where: {
            selfEvaluationId: Number(id),
          },
          data: {
            userId: Number(lecturerId),
          },
        });

        return res.status(200).send({
          success: true,
          data: {
            data: updateReflection,
          },
        });
      });
    } catch (error: any) {
      next(error);
    }
  }

  async createSelfEvaluationComment(
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
