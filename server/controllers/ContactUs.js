const { contactUsEmail } = require("../mail/templates/contactFormRes");
const mailSender = require("../utils/mailSender");

const contactUsController = async (req, res) => {
    try {
        const {firstname, lastname, email, message, phoneNo, countrycode} = req.body;
        try {
            const emailRes = await mailSender(
                email,
                "Your Data send successfully",
                contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
            )
            console.log("Email Res ", emailRes);
            return res.json({
                success: true,
                message: "Email send successfully",
            });
        } catch (error) {
            return res.json({
                success: false,
                message: "Something went wrong...",
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: "Something went wrong...",
        });
    }
}

module.exports = { contactUsController };