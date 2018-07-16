var nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const fs = require("fs");
const data = JSON.parse(fs.readFileSync("./result.json"));
const emailContent = fs.readFileSync("./emailContent.html");
dotenv.config();

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.LOGIN,
    pass: process.env.PASSWORD
  }
});

// for (var i = 0; i <= data.length; i++) {
  var mailOptions = {
    from: process.env.LOGIN,
    to: 'cheungdzinyung@gmail.com',
    subject: "Class information",
    html: emailContent,
    attachments: [
      {
        filename: "CIL.jpg",
        path: "../assets/CILLogo.jpg",
        cid: "thisiscillogo"
      }
    ]
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
// }
