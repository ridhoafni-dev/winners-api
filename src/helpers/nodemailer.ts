import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "official.daily.apps@gmail.com",
    pass: "moijhktxwomnxqbd",
  },
});
