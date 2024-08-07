const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const mongoose = require("mongoose")

const createRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const {rating, review, courseId} = req.body;

        const courseDetail = await Course.findById(
            {_id:courseId},
            {studentsEnrolled:userId}
        )
        if(!courseDetail) {
            return res.status(400).json({
                success:false,
                message: "Course not found"
            
            })
        }
        const alreadyReviewed = await RatingAndReview.findOne({
            user:userId,
            course:courseId
        })
        if(alreadyReviewed) {
            return res.status(400).json({
                success:false,
                message: "You have already reviewed this course"
            })
        }

        const ratingReview = await RatingAndReview.create(
            {
                user:userId,
                course:courseId,
                rating:rating,
                review:review
            }
        )

        // update the course 
        const updatedCourse = await Course.findByIdAndUpdate(
            {_id:courseId},
            {$push:{ratingAndReviews:ratingReview._id}},
            {new:true}
        )
        return res.status(200).json({
            success: true,
            message: "Rating and Review created Successfully",
            ratingReview,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in creating rating and review",
            error: error.message,
        })
    }

}

const getAverageRating = async (req, res) => {
    try {
        const {courseId} = req.body;

        const result = await RatingAndReview.aggregate([
            {
                $match: { course: new mongoose.Types.ObjectId(courseId) },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"}
                }
            }
        ])

        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating
            })
        }
        else{
            return res.status(400).json({
                success:false,
                message:"No rating found for this course",
                averageRating:0
            })
            
        }

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error in getting average rating",
            error:error.message,
        })
        
    }
    
}

const getAllRating = async (req, res) => {
    try {
        const allReviews = await RatingAndReview.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName email image",
            })
            .populate({
                path: "course",
                select: "courseName",
            })
            .exec();
        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
module.exports = {
    createRating,
    getAverageRating,
    getAllRating
}