const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");


// Create a section
const createSection = async (req, res) => {
    try {
        const {sectionName, courseId} = req.body
        if (!sectionName || !courseId) {
            return res.status(400).json({success:false,message: "Please provide all required fields"})
        }
        const newSection = await Section.create({sectionName})
        const updatedCourse = await Course.findByIdAndUpdate(courseId, {$push: {courseContent: newSection._id}})
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        }).exec()
        return res.status(200).json(
            {
                success:true,
                message:"Section created successfully",
                updatedCourse
            }
        )
    
    } catch (error) {
        return res.status(500).json({
            message:"Error in creating a section",
            success:false,
            error:error.message
        })
    }
}

const updateSection = async (req, res) => {
    try {
        const {sectionName, sectionId, courseId} = req.body;
        if(!sectionName || !sectionId || !courseId) {
            return res.status(400).json({
                success:false,
                message:"Please provide all required fields"
            })
        }
        const updatedSection = await Section.findByIdAndUpdate(sectionId, {sectionName:sectionName}, {new:true})

        const course = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: course,
        });

    } catch (error) {
        return res.status(500).json({
            message:"Error in updating a section",
            success:false,
            error:error.message
        })
    }

}

const deleteSection = async (req, res) => {
    try {
        const {sectionId, courseId} = req.body;
        if(!sectionId || !courseId) {
            return res.status(400).json({
                success:false,
                message:"Please provide all required fields"
            })
        }
        await Course.findByIdAndUpdate(courseId, {$pull: {courseContent: sectionId}})
        const section = await Section.findById(sectionId)
        if(!section) {
            return res.status(400).json({
                message:"Section not found",
                success:false,
            })
        }
        // delete subSection
        await SubSection.deleteMany({_id:{$in: section.subSection}})

        // delete the section
        await Section.findByIdAndDelete(sectionId)

        // update the course
        const updatedCourse = await Course.findById(courseId).populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
            
        }).exec()
        
        return res.status(200).json({
            success:true,
            message:"Section deleted successfully",
            data:updatedCourse
        })
    
    } catch(error) {
        return res.status(500).json({
            message:"Error in deleting a section",
            success:false,
            error:error.message
        })
    }
}
module.exports = {createSection, updateSection, deleteSection}