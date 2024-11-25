"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsController = void 0;
const axios_1 = __importDefault(require("axios"));
const redis_1 = require("../helpers/redis");
class PostsController {
    getPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check data in redis
                const redisData = yield redis_1.redisClient.get("posts");
                // return response if exist
                if (redisData) {
                    return res.status(200).send(JSON.parse(redisData));
                }
                // else get from api
                const get = yield axios_1.default.get("https://jsonplaceholder.typicode.com/posts");
                yield redis_1.redisClient.setEx("posts", 5, JSON.stringify(get.data));
                return res.status(200).send(get.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.PostsController = PostsController;
