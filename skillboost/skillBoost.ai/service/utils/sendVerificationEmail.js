// import nodemailer from "nodemailer";
// import jwt from "jsonwebtoken";

// export async function sendVerificationEmail(user) {
//     const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS
//         }
//     });

//     await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: user.email,
//         subject: "Verify your email",
//         html: `<p>Hello ${user.name},</p><p>Click here to verify: <a href="${verificationLink}">Verify Email</a></p>`
//     });
// }
