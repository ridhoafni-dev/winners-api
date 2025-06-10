import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import fs from "fs";
import path from "path";

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
          image: `${req.get("host")}/${data.image}`,
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
      const checkUser = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });

      if (!checkUser) {
        throw new Error("User not found");
      }

      await prisma.$transaction(async (tx) => {
        const createReport = await prisma.report.create({
          data: {
            userId: Number(userId),
            date: new Date(date),
            active: true,
            image: `document/${req.file?.filename}`,
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
      const { userId, date, active } = req.body;
      const { id } = req.params;

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

      if (req.file?.filename) {
        fs.unlink(
          "./public/document/" + checkReport.image.replace("document/", ""),
          (err) => {
            if (err) {
              console.log(err);
              throw new Error(err.message);
            }
          }
        );
      }

      const updateReport = await prisma.report.update({
        where: { id: Number(id) },
        data: {
          userId: Number(userId),
          ...(req.file?.filename
            ? { image: `document/${req.file?.filename}` }
            : {}),
          active: JSON.parse(active),
          date: new Date(date),
          updatedAt: new Date().toISOString(),
        },
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

  async downloadDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const report = await prisma.report.findUnique({
        where: {
          id: Number(id),
          active: true,
        },
      });

      if (!report) {
        return res.status(404).send({
          status: false,
          message: "Document not found",
        });
      }

      // Extract filename from the image path
      const filename = report.image.replace("document/", "");
      const filePath = path.join(__dirname, "../../public/document", filename);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).send({
          status: false,
          message: "File not found on server",
        });
      }

      // Generate download URL
      const protocol = req.protocol;
      const host = req.get('host');
      const baseUrl = `${protocol}://${host}`;
      const downloadUrl = `${baseUrl}/document/${filename}`;
      
      // Return download URL in response
      return res.status(200).send({
        status: true,
        data: downloadUrl
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Helper function to determine content type
  private getContentType(filename: string): string {
    const extension = path.extname(filename).toLowerCase();
    
    switch (extension) {
      case '.pdf':
        return 'application/pdf';
      case '.doc':
        return 'application/msword';
      case '.docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case '.xls':
        return 'application/vnd.ms-excel';
      case '.xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case '.png':
        return 'image/png';
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      default:
        return 'application/octet-stream';
    }
  }
}