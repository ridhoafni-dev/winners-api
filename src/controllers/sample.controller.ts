import { Request, Response } from "express";
import { transporter } from "../helpers/nodemailer";
import { join } from "path";
import fs from "fs";
import handlebars from "handlebars";

export class SampleController {
  async getSample(req: Request, res: Response) {
    return res.status(200).send("Sample Get Contoller");
  }

  async createSample(req: Request, res: Response) {
    return res.status(200).send("Sample Create Contoller");
  }

  async addNewImage(req: Request, res: Response) {
    try {
      console.log(req.file);
      return res.status(200).send(req.file);
    } catch (error: any) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  async addMultipleImage(req: Request, res: Response) {
    try {
      console.log(req.body);
      return res.status(200).send(req.body);
    } catch (error: any) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  async sendMail(req: Request, res: Response) {
    try {
      // mendifinisikan lokasi template  yang akan dikirim
      const templateSource = fs.readFileSync(
        join(__dirname, "../templates/mail.hbs", "utf-8")
      );
      const compiledTemplate = handlebars.compile(templateSource.toString());
      await transporter.sendMail({
        from: "Review API Mailer",
        to: req.body.email,
        subject: "Welcome to mailer",
        html: compiledTemplate({ name: req.body.email.split("@")[0] }),
      });

      return res.status(200).send("Send email success");
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  async getEventData(req: Request, res: Response) {
    try {
      // const events = await prisma.event.findMany();
      // const data = events.map((data) => {
      //   console.log(data);
      //   return {
      //     ...data,
      //     img: `${req.get(host)}/${data.img}`,
      //   };
      // });
      // return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}
