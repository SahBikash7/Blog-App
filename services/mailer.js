const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// async..await is not allowed in global scope, must use a wrapper
const mailer = async (email, subject, body) => {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Bikash Shah"<sahb2676@gmail.com>', // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: `<b>${body}</b>`, // html body
  });

  return info.messageId;
};

module.exports = { mailer };
