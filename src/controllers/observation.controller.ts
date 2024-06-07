import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import fs from "fs";

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

      dataObservations = dataObservations.map((data) => {
        return {
          ...data,
          image: `${req.get("host")}/${data.image}`,
        };
      });
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

      dataObservations = dataObservations.map((data) => {
        return {
          ...data,
          image: `${req.get("host")}/${data.image}`,
        };
      });

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
          image: `${req.get("host")}/${data.image}`,
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

  async createObservation(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, name, description, date, lecturerId } = req.body;
      const checkUser = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });

      if (!checkUser) {
        fs.unlink(`./public/image/${req.file?.filename}`, () => {});
        throw new Error("User not found");
      }

      await prisma.$transaction(async (tx) => {
        const createObservation = await prisma.observation.create({
          data: {
            userId: Number(userId),
            name,
            description,
            date: new Date(date),
            image: `image/${req.file?.filename}`,
          },
        });

        await tx.observationLecturer.create({
          data: {
            userId: Number(lecturerId),
            observationId: Number(createObservation.id),
          },
        });

        return res.status(200).send({ status: true, data: createObservation });
      });
    } catch (error) {
      next(error);
    }
  }

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

      if (req.file?.filename) {
        fs.unlink(
          "./public/image/" + checkObservation.image.replace("image/", ""),
          (err) => {
            if (err) {
              console.log(err);
              throw new Error(err.message);
            }
          }
        );
      }

      const updateObservation = await prisma.observation.update({
        where: { id: Number(id) },
        data: {
          ...(req.file?.filename
            ? { image: `image/${req.file?.filename}` }
            : {}),
          userId: Number(userId),
          name,
          description,
          date: new Date(date),
          updatedAt: new Date().toISOString(),
          active: JSON.parse(active),
        },
      });

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
