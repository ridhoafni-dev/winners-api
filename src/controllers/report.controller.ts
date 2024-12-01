import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import fs from "fs";
import {
  deleteFromSupabaseDoc,
  replaceImageInSupabaseDoc,
  uploadToSupabaseDoc,
} from "../utils/supabaseStorage";

export class ReportController {
  async getReports(req: Request, res: Response, next: NextFunction) {
    try {
      const dataReports = await prisma.report.findMany({
        where: {
          active: true,
        },
        include: {
          user: { select: { id: true, email: true, role: true } },
          reportLecturer: true,
        },
      });
      return res.status(200).send({ status: true, data: dataReports });
    } catch (error) {
      next(error);
    }
  }

  async getReportsByUserId(req: Request, res: Response, next: NextFunction) {
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

      const dataReports = await prisma.report.findMany({
        where: {
          userId: Number(userId),
          active: true,
        },
        include: {
          user: { select: { id: true, email: true, role: true } },
          reportLecturer: true,
        },
      });
      return res.status(200).send({ status: true, data: dataReports });
    } catch (error) {
      next(error);
    }
  }

  async getReportsByUserIdByDate(
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

      const dataReports = await prisma.report.findMany({
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
          reportLecturer: true,
        },
      });

      let mapped = dataReports.map((data) => {
        return {
          ...data,
          // image: `${req.get("host")}/${data.image}`,
          createAt: data.createAt.toISOString(),
        };
      });

      if (isLecturer) {
        mapped = mapped.filter((data) => {
          return data.reportLecturer?.userId === Number(userId);
        });
      }

      return res.status(200).send({ status: true, data: mapped });
    } catch (error) {
      next(error);
    }
  }

  async createReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, date, lecturerId } = req.body;

      const [checkUser, docUrl] = await Promise.all([
        prisma.user.findUnique({
          where: { id: Number(userId) },
        }),
        req.file ? uploadToSupabaseDoc(req.file) : Promise.resolve(null),
      ]);

      if (!checkUser) {
        throw new Error("User not found");
      }

      await prisma.$transaction(async (tx) => {
        const createReport = await tx.report.create({
          data: {
            userId: Number(userId),
            date: new Date(date),
            active: true,
            image: docUrl || "",
          },
        });

        await tx.reportLecturer.create({
          data: {
            userId: Number(lecturerId),
            reportId: Number(createReport.id),
          },
        });

        return res.status(200).send({ status: true, data: createReport });
      });
    } catch (error) {
      next(error);
    }
  }

  async updateReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const userId = req.dataUser?.id;

      const checkUser = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });

      if (!checkUser) {
        throw new Error("User not found");
      }

      const checkReport = await prisma.report.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!checkReport) {
        throw new Error("Report not found");
      }

      await deleteFromSupabaseDoc(checkReport.image);

      let newImage = null;

      if (req.file?.filename) {
        try {
          newImage = await replaceImageInSupabaseDoc(
            checkReport.image,
            req.file
          );
        } catch (error) {
          console.error("Error deleting old image:", error);
          throw new Error("Failed to delete old image");
        }
        // fs.unlink(
        //   "./public/document/" + checkReport.image.replace("document/", ""),
        //   (err) => {
        //     if (err) {
        //       console.log(err);
        //       throw new Error(err.message);
        //     }
        //   }
        // );
      }

      const updateReport = await prisma.report.delete({
        where: { id: Number(id) },
      });

      return res.status(200).send({
        success: true,
        data: {
          data: updateReport,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }
}
