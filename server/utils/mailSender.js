const nodemailer = require('nodemailer')
require('dotenv').config()

const mailSender = async (email,title,body) => {
    try {
        const transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        })
        const mailOptions = {
            from: 'StudyNotion || CodeHelp - by Babbar',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        }
        const mailResponse = await transporter.sendMail(mailOptions)
        return mailResponse
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = mailSender