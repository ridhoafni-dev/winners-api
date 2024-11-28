import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";

export class ActivityPlanController {
  async getActivityPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const dataActivityPlans = await prisma.activityPlan.findMany({
        where: {
          active: true,
        },
        include: {
          user: { select: { id: true, email: true, role: true } },
          activityPlanComment: true,
        },
      });
      return res.status(200).send({ status: true, data: dataActivityPlans });
    } catch (error) {
      next(error);
    }
  }

  async getActivityPlansByUserId(
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

      const dataActivityPlans = await prisma.activityPlan.findMany({
        where: {
          userId: Number(userId),
          active: true,
        },
        include: {
          user: { select: { id: true, email: true, role: true } },
          activityPlanComment: true,
        },
      });
      return res.status(200).send({ status: true, data: dataActivityPlans });
    } catch (error) {
      next(error);
    }
  }

  async getActivityPlansByUserIdByDate(
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

      const dataActivityPlans = await prisma.activityPlan.findMany({
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
          activityPlanComment: true,
          activityPlanLecturer: true,
        },
      });

      let mapped = dataActivityPlans.map((data) => {
        return {
          ...data,
          createAt: data.createAt.toISOString(),
        };
      });

      if (isLecturer) {
        mapped = mapped.filter((data) => {
          return data.activityPlanLecturer?.userId === Number(userId);
        });
      }

      return res.status(200).send({ status: true, data: mapped });
    } catch (error) {
      next(error);
    }
  }

  async createActivityPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, name, startDate, endDate, status, lecturerId } = req.body;
      const checkUser = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });

      if (!checkUser) {
        throw new Error("User not found");
      }

      await prisma.$transaction(async (tx) => {
        const createActivityPlan = await tx.activityPlan.create({
          data: {
            userId: Number(userId),
            name,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status,
          },
        });

        await tx.activityPlanLecturer.create({
          data: {
            userId: Number(lecturerId),
            activityPlanId: Number(createActivityPlan.id),
          },
        });

        return res.status(200).send({ status: true, data: createActivityPlan });
      });
    } catch (error) {
      next(error);
    }
  }

  async updateActivityPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, name, startDate, endDate, status, active } = req.body;
      const { id } = req.params;

      const checkUser = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });

      if (!checkUser) {
        throw new Error("User not found");
      }

      const checkActivityPlan = await prisma.activityPlan.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!checkActivityPlan) {
        throw new Error("Activity plan not found");
      }

      const updateEvaluation = await prisma.activityPlan.update({
        where: { id: Number(id) },
        data: {
          userId: Number(userId),
          active: JSON.parse(active),
          name,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          status,
          updatedAt: new Date().toISOString(),
        },
      });

      return res.status(200).send({
        success: true,
        data: {
          data: updateEvaluation,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  async createActivityPlanComment(
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

      const checkActivityPlan = await prisma.activityPlan.findUnique({
        where: { id: Number(id) },
      });

      if (!checkActivityPlan) {
        throw new Error("Activity plan not found");
      }

      const createActivityPlanComment = await prisma.activityPlanComment.create(
        {
          data: {
            userId: Number(userId),
            rating: Number(rating),
            comment,
            activityPlanId: Number(id),
          },
        }
      );

      return res
        .status(200)
        .send({ status: true, data: createActivityPlanComment });
    } catch (error) {
      next(error);
    }
  }
}
