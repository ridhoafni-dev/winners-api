import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import fs from "fs";
import {
  deleteFromSupabase,
  replaceImageInSupabase,
  uploadToSupabase,
} from "../utils/supabaseStorage";

export class ObservationController {
  async getObservations(req: Request, res: Response, next: NextFunction) {
    try {
      let dataObservations = await prisma.observation.findMany({
        where: {
          active: true,
        },
        include: {
          user: { select: { id: true, email: true, role: true } },
          observationComments: true,
        },
      });

      // dataObservations = dataObservations.map((data) => {
      //   return {
      //     ...data,
      //     image: `${req.get("host")}/${data.image}`,
      //   };
      // });

      return res.status(200).send({ status: true, data: dataObservations });
    } catch (error) {
      next(error);
    }
  }

  async getObservationsByUserId(
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

      let dataObservations = await prisma.observation.findMany({
        where: {
          userId: Number(userId),
          active: true,
        },
        include: {
          user: { select: { id: true, email: true, role: true } },
          observationComments: true,
        },
      });

      // dataObservations = dataObservations.map((data) => {
      //   return {
      //     ...data,
      //     image: `${req.get("host")}/${data.image}`,
      //   };
      // });

      return res.status(200).send({ status: true, data: dataObservations });
    } catch (error) {
      next(error);
    }
  }

  async getObservationsByUserIdByDate(
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

      const dataObservations = await prisma.observation.findMany({
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
          observationComments: true,
          observationLecturers: true,
        },
      });
      let mapped = dataObservations.map((data) => {
        return {
          ...data,
          //image: `${req.get("host")}/${data.image}`,
          createAt: data.createAt.toISOString(),
        };
      });

      if (isLecturer) {
        mapped = mapped.filter((data) => {
          return data.observationLecturers?.userId === Number(userId);
        });
      }

      return res.status(200).send({ status: true, data: mapped });
    } catch (error) {
      next(error);
    }
  }

  // observation.controller.ts
  async createObservation(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, name, description, date, lecturerId } = req.body;

      // Pre-transaction checks and file upload
      const [checkUser, imageUrl] = await Promise.all([
        prisma.user.findUnique({
          where: { id: Number(userId) },
        }),
        req.file ? uploadToSupabase(req.file) : Promise.resolve(null),
      ]);

      if (!checkUser) {
        throw new Error("User not found");
      }

      // Database transaction with increased timeout
      const result = await prisma.$transaction(
        async (tx) => {
          const observation = await tx.observation.create({
            data: {
              userId: Number(userId),
              name,
              description,
              date: new Date(date),
              image: imageUrl || "",
            },
          });

          await tx.observationLecturer.create({
            data: {
              userId: Number(lecturerId),
              observationId: observation.id,
            },
          });

          return observation;
        },
        {
          maxWait: 5000, // Max time to wait for transaction
          timeout: 15000, // Increased transaction timeout to 15s
        }
      );

      return res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      console.error("Transaction error:", error);
      next(error);
    }
  } // observation.controller.ts

  async updateObservation(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, name, description, date, active } = req.body;
      const { id } = req.params;

      const checkUser = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });

      if (!checkUser) {
        throw new Error("User not found");
      }

      const checkObservation = await prisma.observation.findUnique({
        where: { id: Number(id) },
      });

      if (!checkObservation) {
        throw new Error("Observation not found");
      }

      await deleteFromSupabase(checkObservation.image);

      let newImage = null;

      if (req.file?.filename) {
        try {
          newImage = await replaceImageInSupabase(
            checkObservation.image,
            req.file
          );
        } catch (error) {
          console.error("Error deleting old image:", error);
          throw new Error("Failed to delete old image");
        }

        // fs.unlink(
        //   "./public/image/" + checkObservation.image.replace("image/", ""),
        //   (err) => {
        //     if (err) {
        //       console.log(err);
        //       throw new Error(err.message);
        //     }
        //   }
        // );
      }

      const updateObservation = await prisma.observation.delete({
        where: { id: Number(id) },
      });

      // const updateObservation = await prisma.observation.update({
      //   where: { id: Number(id) },
      //   data: {
      //     // ...(req.file?.filename
      //     //   ? { image: `image/${req.file?.filename}` }
      //     //   : {}),
      //     ...(req.file?.filename ? { image: newImage || "" } : {}),
      //     userId: Number(userId),
      //     name,
      //     description,
      //     date: new Date(date),
      //     updatedAt: new Date().toISOString(),
      //     active: JSON.parse(active),
      //   },
      // });

      return res.status(200).send({
        success: true,
        data: {
          data: updateObservation,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  async createObservationComment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, rating, comment } = req.body;
      const { id } = req.params;
      const checkUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!checkUser) {
        throw new Error("User not found");
      }

      const checkObservation = await prisma.observation.findUnique({
        where: { id: Number(id) },
      });

      if (!checkObservation) {
        throw new Error("Observation not found");
      }

      const checkObservationComment =
        await prisma.observationComment.findUnique({
          where: { id: Number(id) },
        });

      if (checkObservationComment) {
        throw new Error("Observation comment already exists");
      }

      const createObservationComment = await prisma.observationComment.create({
        data: {
          userId,
          rating: Number(rating),
          comment,
          observationId: Number(id),
        },
      });

      return res
        .status(200)
        .send({ status: true, data: createObservationComment });
    } catch (error) {
      next(error);
    }
  }
}
