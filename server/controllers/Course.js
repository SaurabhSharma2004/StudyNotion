const User = require('../models/User')
const Course = require('../models/Course')
const Section = require( '../models/Section')
const SubSection = require( '../models/SubSection')
const {uploadImageToCloudinary} = require('../utils/imageUploader')
const Category = require('../models/Category')
const CourseProgress = require('../models/CourseProgress')
const { convertSecondsToDuration } = require("../utils/secToDuration")


// Create a new course
const createCourse = async (req, res) => {
    try {
        const userId = req.user.id;
        
        let {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag: _tag,
            category,
            status,
            instructions: _instructions,
        } = req.body;
        // Get thumbnail image from request files
        const thumbnail = req.files.thumbnail;

        // console.log("printing course details ", req.body);
        // console.log("printing the thumbnail ", req.files);

        // Convert the tag and instructions from stringified Array to Array
        const tag = JSON.parse(_tag)
        const instructions = JSON.parse(_instructions)

        if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !tag.length ||
            !thumbnail ||
            !category ||
            !instructions.length
        ) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Mandatory",
            });
        }

        if(!status || status === 'undefined'){
            status = 'draft'
        }

        const instructorDetails = await User.findById(userId, {
            accountType:"Instructor"
        })
        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: "Instructor details not found"
            })
        }

        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Details Not Found",
            });
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: status,
            instructions,
        });

        // Add the this new course to instructor course list
        await User.findByIdAndUpdate({_id:instructorDetails._id}, {
            $push: {courses: newCourse._id}
        }, { new: true })

        // Add the new course to the Categories
        const categoryDetails2 = await Category.findByIdAndUpdate(
            { _id: category },
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        );
        console.log("HEREEEEEEEE", categoryDetails2);
        // Return the new course and a success message
        return res.status(200).json({
            success: true,
            data: newCourse,
            message: "Course Created Successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        });
    }
}

const getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find(
            {status:"Published"},{
                courseName: true,
                price: true,
                thumbnail: true,
                instructor: true,
                ratingAndReviews: true,
                studentsEnrolled: true,
            }
        ).populate("instructor").exec()
        return res.status(200).json({
            success: true,
            data: allCourses,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: `Can't Fetch Course Data`,
            error: error.message,
        });
    }
}

const getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body
        const courseDetails = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                    select: "-videoUrl",
                },
            })
            .exec()

        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            })
        }

        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }

        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalDurationInSeconds += timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const deleteCourse = async (req, res) => {
    try {
        const {courseId} = req.body;
        const course = await Course.findById(courseId);
        if(!course)
        {
            return res.status(404).json({
                success: false,
                message: "Course Not Found",
            });
        
        }
        const enrolledStudents = course.studentsEnrolled;
        for (const studentId of enrolledStudents) {
            await User.findByIdAndUpdate(
                {_id:studentId},
                {$pull:{courses:courseId}},
                {new:true}
            )
        }

        const sections = course.courseContent;
        for(const sectionId of sections) {
            const section = await Section.findById(sectionId);
            if(section) {
                const subSections = section.subSection;
                for (const subSectionId of subSections) {
                    await SubSection.findByIdAndDelete(subSectionId);
                }
                
            }
            await Section.findByIdAndDelete(sectionId);
            
        }
        await Course.findByIdAndDelete(courseId);
        return res.status(200).json({
            success: true,
            message: "Course Deleted Successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete course",
            error: error.message,
        });
    }
}

const getInstructorCourses = async (req, res) => {
    try {
        const instructorId = req.user.id;
        const instructorCourses = await Course.find({instructor: instructorId}).sort({createdAt:-1})
        return res.status(200).json({
            success: true,
            data: instructorCourses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get instructor courses",
            error: error.message,
        });
    
    }
}

const getFullCourseDetails = async (req, res) => {
    try {
        const {courseId} = req.body;
        const courseDetails = await Course.findById(
            {_id:courseId}
        )
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        })
        .populate({
            path: "instructor",
            populate:{
                path:"additionalDetails"
            }
        })
        .exec()
        if(!courseDetails) {
            return res.status(400).json({
                success:false,
                message:"Course Details Not Found "
            })
        }
        let courseProgressCount = await CourseProgress.findOne({
            courseID:courseId,
        })
        let totalDurationInSeconds = 0;
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration);
                totalDurationInSeconds += timeDurationInSeconds;
            });
        });

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

        return res.status(200).json({
            success:true,
            data:{
                courseDetails,
                totalDuration,
                completedVideos:courseProgressCount?.completedVideos ? courseProgressCount?.completedVideos : []
            }
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Failed to get course Full details",
            error:error.message
        })
    }
    
}

const editCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const updates = req.body;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        if (req.files) {
            console.log("thumbnail update");
            const thumbnail = req.files.thumbnail;
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            );
            course.thumbnail = thumbnailImage.secure_url;
        }
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                if (key === "tag" || key === "instructions") {
                    course[key] = JSON.parse(updates[key]);
                } else {
                    course[key] = updates[key];
                }
            }
        }

        await course.save();

        const updatedCourse = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Editing Course",
            error: error.message,
        });
    }
}

module.exports = {
    createCourse,
    deleteCourse,
    getInstructorCourses,
    getFullCourseDetails,
    editCourse,
    getAllCourses,
    getCourseDetails
};