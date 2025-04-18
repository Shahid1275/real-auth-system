// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// // Load environment variables
// dotenv.config();

// const transporter = nodemailer.createTransport({
//     host: "smtp.elasticemail.com",
//     port: 2525,
//     secure: false,
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS
//     },
//     tls: {
//         rejectUnauthorized: false
//     },
//     debug: true
// });

// // Test the connection immediately
// transporter.verify(function(error, success) {
//   if (error) {
//     console.error('SMTP Verification Error:', error);
//   } else {
//     console.log('SMTP Server is ready to send emails');
//   }
// });

// export default transporter;
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL);

const transporter = nodemailer.createTransport({
    host: "smtp.mailosaur.net",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    debug: true
});

transporter.verify(function (error, success) {
    if (error) {
        console.error('SMTP Verification Error:', error);
    } else {
        console.log('SMTP Server is ready to send emails');
    }
});

export default transporter;