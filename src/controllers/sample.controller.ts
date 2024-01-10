import { Request, Response } from "express";

export class SampleController {
  async getSample(req: Request, res: Response) {
    return res.status(200).send("Sample Get Contoller");
  }

  async createSample(req: Request, res: Response) {
    return res.status(200).send("Sample Create Contoller");
  }
}
