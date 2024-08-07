const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const crypto = require('crypto');
const mongoose = require('mongoose')
const {
    courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const {
    paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");
const CourseProgress = require('../models/CourseProgress');


const { instance } = require('../config/razorpay')

const capturePayment = async (req, res) => {
    // Multiple courses can purchase
    // array of courseId
    const { courses } = req.body;
    const userId = req.user.id;

    if (courses.length === 0) {
        return res.json({ success: false, message: "Please provide Course Id" });
    }

    let totalAmount = 0;

    for (const course_id of courses) {
        let course;
        try {

            course = await Course.findById(course_id);
            if (!course) {
                return res.status(200).json({ success: false, message: "Could not find the course" });
            }

            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({ success: false, message: "Student is already Enrolled" });
            }

            totalAmount += course.price;
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    const currency = "INR";
    const options = {
        amount: totalAmount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
    }

    try {
        const paymentResponse = await instance.orders.create(options);
        return res.status(200).json({
            success: true,
            message: paymentResponse,
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, mesage: "Could not Initiate Order", error:error.message });
    }
}

const verifyPayment = async (req, res) => {
    const razorypay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const { courses } = req.body;
    const userId = req.user.id

    if (!razorypay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
            success: false,
            message: "Missing parameters in verifyPayment"
        })
    }

    let body = razorypay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        for (const courseId of courses) {
            try {
                console.log("Printing course Id in payment.js ", courseId);
                const courseProgress = await CourseProgress.create({
                    courseId: courseId,
                    userId:userId,
                    completedVideos: []
                })
                const enrolledCourse = await Course.findOneAndUpdate(
                    { _id: courseId },
                    { $push: { studentsEnrolled: userId,  } },
                    { new: true }
                );
                if (!enrolledCourse) {
                    return res.status(500).json({
                        success: false,
                        message: "Error in enrolling student in verifyPayment"

                    })
                }

                const enrolledStudent = await User.findByIdAndUpdate(
                    userId, {
                        $push:{
                            courses:courseId,
                            courseProgress:courseProgress._id
                        }
                    },
                    {new:true}
                )

                console.log(
                    "Course Progress updated in verifyPayment"
                );

                // bacho ko mail send karo couse enrollement ka

                const emailResponse = await mailSender(
                    enrolledStudent.email,
                    `Successfully Enrolled into ${enrolledCourse.courseName}`,
                    courseEnrollmentEmail(
                        enrolledCourse.courseName,
                        enrolledStudent.firstName
                    )
                )

            } catch (error) {
                return res.status(500).json({ success: false, message: error.message });
            }
        }
        return res.status(200).json({
            success: true,
            message: "Payment verified successfully"
        })
    } else {
        return res.status(400).json({
            success: false,
            message: "Invalid signature in verifyPayment"
        })
    }

}

const sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;
    const userId = req.user.id

    if (!orderId || !paymentId) {
        return res.status(400).json({
            success: false,
            message: "Missing parameters in sendPaymentSuccessEmail"
        })
    }

    try {
        const enrolledStudent = await User.findById(userId)
        await mailSender(
            enrolledStudent.email,
            `payment Received`,
            paymentSuccessEmail(
                `${enrolledStudent.firstName}`,
                amount / 100,
                orderId,
                paymentId
            )
        )
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in sending payment success email"
        })
    }

}

module.exports = {
    capturePayment,
    verifyPayment,
    sendPaymentSuccessEmail
}
