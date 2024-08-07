const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");

const resetPasswordToken = async (req,res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email:email});
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const token = crypto.randomBytes(32).toString("hex");
        const updatedDetails = await User.findOneAndUpdate(
            {email:email},
            {token:token,resetPasswordExpires:Date.now() + 3600000},
            {new:true}
        );
        console.log("DETAILS", updatedDetails);

        const url = `http://localhost:3000/update-password/${token}`;

        await mailSender(
            email,
            "Password Reset",
            `Your Link for email verification is ${url}. Please click this url to reset your password.`
        );

        return res.status(200).json({
            success: true,
            message:
                "Email Sent Successfully, Please Check Your Email to Continue Further",
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            success: false,
            message: `Some Error creating reset password token`,
        });
    }
}

const resetPassword = async (req,res) => {
    try {
        const {password,confirmPassword,token} = req.body;
        if(password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }
        const user = await User.findOne({token:token});
        if(!user) {
            return res.status(404).json({
                message: "Token is invalid"
            });
        }
        if(Date.now() > user.resetPasswordExpires) {
            return res.status(400).json({
                message: "Reset password token has expired"
            });
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt);

        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword,token:null,resetPasswordExpires:null},
            {new:true}
        );

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message,
            success: false,
            message: `Some Error in Updating the Password`,
        });
    }
}

module.exports = {resetPasswordToken,resetPassword};