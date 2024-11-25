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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        console.log("token", token);
        if (!token) {
            return res
                .status(403)
                .send({ status: false, message: "Token not found" });
        }
        // Mengambil data token dari redis dan dicocokkan dengan token dari header
        //const checkToken = await redisClient.get(`forgot:${req.body.email}`);
        //console.log(token, checkToken);
        if (token) {
            const verifiedToken = (0, jsonwebtoken_1.verify)(token, "123jwt");
            req.dataUser = verifiedToken;
            next();
        }
        else {
            return res
                .status(401)
                .send({ status: false, message: "Failed to authenticate token." });
        }
    }
    catch (error) {
        return res.status(401).send({ status: false, message: "Token error" });
    }
});
exports.verifyToken = verifyToken;
