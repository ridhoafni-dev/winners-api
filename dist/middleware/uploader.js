"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploader = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = require("path"); // digunakan untuk merge location file
const uploader = (filePrefix, folderName) => {
    const defaultDir = (0, path_1.join)(__dirname, "../../public"); // mengarahkan ke directory file utama
    const configStorage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const fileDestination = folderName ? defaultDir + folderName : defaultDir;
            console.log("FOLDER TUJUAN : ", fileDestination); // memeriksa alamat penyimpanan tujuan
            cb(null, fileDestination);
        },
        filename: (req, file, cb) => {
            // exmpl : photoku.profile.jpg
            const originalNameParts = file.originalname.split("."); // ["photoku", "profile", "jpg"]
            console.log("ORIGINAL FILE NAME : ", originalNameParts);
            const extention = originalNameParts[originalNameParts.length - 1]; // "jpg"
            const newName = filePrefix + Date.now() + "." + extention;
            console.log("NEW FILE NAME : ", newName);
            cb(null, newName);
        },
    });
    return (0, multer_1.default)({ storage: configStorage });
};
exports.uploader = uploader;
