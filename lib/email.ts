import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({

    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

})

export async function sendOTPEmail(email: string, otp: string) {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your login code",
        text: `Your OTP code is: ${otp}`
    })
}