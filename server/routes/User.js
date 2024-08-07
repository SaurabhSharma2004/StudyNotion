const express = require("express")
const router = express.Router()

const {signup,login,sendotp,changePassword} = require('../controllers/Auth')

const {resetPasswordToken,resetPassword} = require('../controllers/ResetPassword')

const {auth} = require('../middlewares/auth')

// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signup)

// Route for sending OTP to the user's email
router.post("/sendotp", sendotp)

// Route for changing the user's password
router.post("/changepassword", auth, changePassword)

router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

// Export the router for use in the main application
module.exports = router