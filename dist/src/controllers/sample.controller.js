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
exports.SampleController = void 0;
const nodemailer_1 = require("../helpers/nodemailer");
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
class SampleController {
    getSample(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(200).send("Sample Get Contoller");
        });
    }
    createSample(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(200).send("Sample Create Contoller");
        });
    }
    addNewImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.file);
                return res.status(200).send(req.file);
            }
            catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
        });
    }
    addMultipleImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                return res.status(200).send(req.body);
            }
            catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
        });
    }
    sendMail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // mendifinisikan lokasi template  yang akan dikirim
                const templateSource = fs_1.default.readFileSync((0, path_1.join)(__dirname, "../templates/mail.hbs", "utf-8"));
                const compiledTemplate = handlebars_1.default.compile(templateSource.toString());
                yield nodemailer_1.transporter.sendMail({
                    from: "Review API Mailer",
                    to: req.body.email,
                    subject: "Welcome to mailer",
                    html: compiledTemplate({ name: req.body.email.split("@")[0] }),
                });
                return res.status(200).send("Send email success");
            }
            catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
        });
    }
    getEventData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
            }
            catch (error) {
                return res.status(500).send(error);
            }
        });
    }
}
exports.SampleController = SampleController;
