import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { redisClient } from "../helpers/redis";

export class PostsController {
  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      // check data in redis
      const redisData = await redisClient.get("posts");
      // return response if exist
      if (redisData) {
        return res.status(200).send(JSON.parse(redisData));
      }
      // else get from api
      const get = await axios.get("https://jsonplaceholder.typicode.com/posts");
      await redisClient.setEx("posts", 5, JSON.stringify(get.data));
      return res.status(200).send(get.data);
    } catch (error) {
      next(error);
    }
  }
}
