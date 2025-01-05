"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkContentType = void 0;
const checkContentType = (req, res, next) => {
    const contentType = req.headers["content-type"];
    if (contentType &&
        (contentType.includes("application/json") ||
            contentType.includes("application/x-www-form-urlencoded"))) {
        next();
    }
    else {
        res
            .status(400)
            .json({
            error: "Invalid Content-Type. Expected application/json or application/x-www-form-urlencoded",
        });
    }
};
exports.checkContentType = checkContentType;
