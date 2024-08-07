const User = require('../models/User')
const Course = require('../models/Course')
const Profile = require('../models/Profile')
const CourseProgress = require('../models/CourseProgress')
const {convertSecondsToDuration} = require('../utils/secToDuration')
const {uploadImageToCloudinary} = require("../utils/imageUploader");


const updateProfile = async (req, res) => {
    try {
        const {firstName,lastName, gender, contactNumber, about = "", dateOfBirth = ""} = req.body;
        const id = req.user.id

        if(!gender || !contactNumber ) {
            return res.status(400).json({
                message: "Please provide all required fields"
            })
        }

        const updatedUserDetails = await User.findByIdAndUpdate({
            _id:id
        }, {firstName: firstName,lastName: lastName}, {new:true})

        if(!updatedUserDetails) {
            return res.status(400).json({
                success:false,
                message: "User not found"
            })
        }

        const profile = await Profile.findById({_id:updatedUserDetails.additionalDetails})
        if(!profile) {
            return res.status(404).json({
                message: "Profile not found",
                success: false
            })
        }

        profile.gender = gender
        profile.contactNumber = contactNumber
        profile.about = about
        profile.dateOfBirth = dateOfBirth

        await profile.save()


        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            data: {
                profile,
                updatedUserDetails
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error in updating profile",
            success: false,
            error: error.message
        })
    }
}

const deleteAccount = async (req, res) => {
    try {
        const id = req.user.id
        const user = await User.findById({_id:id})
        if(!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        // Delete the user profile
        await Profile.findByIdAndDelete({_id:user.additionalDetails})

        // Delete the user from the courses in which he is enrolled

        const courses = await Course.find({studentsEnrolled:id})

        for (const course of courses) {
            course.studentsEnrolled = course.studentsEnrolled.filter(studentId => String(studentId) !== id)
            await course.save()
        }

        // Delete the user
        await User.findByIdAndDelete({_id:id})

        // Send success response

        return res.status(200).json({
            message: "Account deleted successfully",
            success: true
        })


    } catch (error) {
        return res.status(500).json({
            message: "Error in deleting account",
            success: false,
            error: error.message
        })
    }
}

const getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id
        const userDetails = await User.findById({_id:id}).populate('additionalDetails').exec()
        return res.status(200).json({
            message: "User details fetched successfully",
            success: true,
            data: userDetails
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error in fetching user details",
            success: false,
            error: error.message
        })
    }
    
}

const updateDisplayPicture = async(req, res) => {
    try {
        const id = req.user.id
        const displayPicture = req.files.displayPicture
        const image = await uploadImageToCloudinary(displayPicture, process.env.FOLDER_NAME);

        const updatedUser = await User.findByIdAndUpdate(
            { _id: id }, { image: image.secure_url },
            { new: true }
        )

        return res.status(200).json({
            message: "Display picture updated successfully",
            success: true,
            data: updatedUser
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error in updating display picture",
            success: false,
            error: error.message
        })
    }

}

const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id
        let userDetails = await User.findOne({
            _id: userId,
        })
            .populate({
                path: "courses",
                populate: {
                    path: "courseContent",
                    populate: {
                        path: "subSection",
                    },
                },
            })
            .exec()

        userDetails = userDetails.toObject()
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0
            SubsectionLength = 0
            for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[
                    j
                ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
                userDetails.courses[i].totalDuration = convertSecondsToDuration(
                    totalDurationInSeconds
                )
                SubsectionLength +=
                    userDetails.courses[i].courseContent[j].subSection.length
            }
            let courseProgressCount = await CourseProgress.findOne({
                courseID: userDetails.courses[i]._id,
                userId: userId,
            })
            courseProgressCount = courseProgressCount?.completedVideos.length
            if (SubsectionLength === 0) {
                userDetails.courses[i].progressPercentage = 100
            } else {
                // To make it up to 2 decimal point
                const multiplier = Math.pow(10, 2)
                userDetails.courses[i].progressPercentage =
                    Math.round(
                        (courseProgressCount / SubsectionLength) * 100 * multiplier
                    ) / multiplier
            }
        }

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find user with id: ${userDetails}`,
            })
        }
        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({instructor: req.user.id})
        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            const courseDataWithStats = {
                _id:course._id,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                totalAmountGenerated,
                totalStudentsEnrolled
            }
            return courseDataWithStats
        })
        return res.status(200).json({courses:courseData})
    }catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    updateProfile,
    deleteAccount,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
    instructorDashboard
}
