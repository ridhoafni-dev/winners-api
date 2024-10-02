import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";

export class MemoController {
  async getMemos(req: Request, res: Response, next: NextFunction) {
    try {
      const dataMemos = await prisma.memo.findMany({
        where: {
          active: true,
        },
        include: {
          user: { select: { id: true, email: true, role: true } },
          memoComment: true,
        },
      });
      return res.status(200).send({ status: true, data: dataMemos });
    } catch (error) {
      next(error);
    }
  }

  async getMemosByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const dataMemos = await prisma.memo.findMany({
        where: {
          userId: Number(userId),
          active: true,
        },
        include: {
          user: { select: { id: true, email: true, role: true } },
          memoComment: true,
        },
      });
      return res.status(200).send({ status: true, data: dataMemos });
    } catch (error) {
      next(error);
    }
  }

  async getMemosByUserIdByDate(
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

      const dataMemos = await prisma.memo.findMany({
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
          memoComment: true,
          memoLecturer: true,
        },
      });
      let mapped = dataMemos.map((data) => {
        return {
          ...data,
          createAt: data.createAt.toISOString(),
        };
      });

      if (isLecturer) {
        mapped = mapped.filter((data) => {
          return data.memoLecturer?.userId === Number(userId);
        });
      }

      return res.status(200).send({ status: true, data: mapped });
    } catch (error) {
      next(error);
    }
  }

  async createMemo(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, lecturerId, title } = req.body;
      const checkUser = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });

      if (!checkUser) {
        throw new Error("User not found");
      }

      await prisma.$transaction(async (tx) => {
        const createMemo = await tx.memo.create({
          data: {
            userId: Number(userId),
            title,
          },
        });

        await tx.memoLecturer.create({
          data: {
            userId: Number(lecturerId),
            memoId: Number(createMemo.id),
          },
        });

        return res.status(200).send({ status: true, data: createMemo });
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMemo(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, title, active } = req.body;
      const { id } = req.params;
      const checkUser = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });

      if (!checkUser) {
        throw new Error("User not found");
      }

      const checkSelfEvaluation = await prisma.memo.findUnique({
        where: { id: Number(id) },
      });

      if (!checkSelfEvaluation) {
        throw new Error("Memo not found");
      }

      const updateMemo = await prisma.memo.update({
        where: { id: Number(id) },
        data: {
          title,
          active: JSON.parse(active),
          updatedAt: new Date().toISOString(),
        },
      });

      return res.status(200).send({
        success: true,
        data: {
          data: updateMemo,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  async createMemoComment(req: Request, res: Response, next: NextFunction) {
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

      const checkMemo = await prisma.memo.findUnique({
        where: { id: Number(id) },
      });

      if (!checkMemo) {
        throw new Error("Memo not found");
      }

      const checkMemoComment = await prisma.memoComment.findUnique({
        where: { id: Number(id) },
      });

      if (checkMemoComment) {
        throw new Error("Memo comment already exists");
      }

      const createMemoComment = await prisma.memoComment.create({
        data: {
          userId: Number(userId),
          rating: Number(rating),
          comment,
          memoId: Number(id),
        },
      });

      return res.status(200).send({ status: true, data: createMemoComment });
    } catch (error) {
      next(error);
    }
  }
}
