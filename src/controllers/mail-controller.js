const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const sendGridApiKey =
  "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";

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: sendGridApiKey,
    },
  })
);

const sendMail = (t, s, h, f = "bhairesh97@gmail.com") => {
  return transporter.sendMail({
    to: t,
    from: f,
    subject: s,
    html: h,
  });
};

module.exports = sendMail;
