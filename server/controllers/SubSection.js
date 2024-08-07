const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const {uploadImageToCloudinary} = require('../utils/imageUploader')

const createSubSection = async (req, res) => {
    try {
        const { title, description, sectionId } = req.body;
        const video = req.files.video;
        if (!title || !description || !sectionId || !video)
            return res.status(400).json({
                message: "Please fill all the fields",
                success: false
            })
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        const newSubSection = await SubSection.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })
        
        const updatedSection = await Section.findByIdAndUpdate(sectionId, {
            $push: { subSection: newSubSection._id }
        }, { new: true }).populate("subSection")
        return res.status(200).json({
            message: "SubSection created successfully",
            success: true,
            data: updatedSection
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error in creating SubSection",
            success: false,
            error: error.message
        })
    }
}

const updateSubSection = async (req, res) => {
    try {
        const { sectionId, subSectionId, title, description } = req.body;
        const subSection = await SubSection.findById(subSectionId);
        if (!subSection)
            return res.status(400).json({
                message: "SubSection not found",
                success: false
            })
        if (title !== undefined) {
            subSection.title = title;
        }

        if (description !== undefined) {
            subSection.description = description;
        }

        if(req.files && req.files.video !== undefined) {
            const uploadDetails = await uploadImageToCloudinary(req.files.video, process.env.FOLDER_NAME);
            subSection.videoUrl = uploadDetails.secure_url;
            subSection.timeDuration = `${uploadDetails.duration}`;
        }
        await subSection.save();
        const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
        );

        return res.json({
            success: true,
            data: updatedSection,
            message: "subSection updated successfully",
        });
        
    } catch (error) {
        return res.status(500).json({
            message: "Error in updating SubSection",
            success: false,
            error: error.message
        })
    }   
}

const deleteSubSection = async (req, res) => {
    try {
        const {sectionId, subSectionId} = req.body;
        await Section.findByIdAndUpdate(
            {_id:sectionId},
            {
                $pull:{subSection:subSectionId}
            }
        )
        const subSection = await SubSection.findByIdAndDelete(subSectionId);
        if(!subSection)
        {
            return res.status(400).json({
                message: "SubSection not found",
                success: false
            })
        }
        const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
        );
        return res.status(200).json({
            message: "SubSection deleted successfully",
            success: true,
            data: updatedSection
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error in deleting SubSection",
            success: false,
            error: error.message
        })    
    }
}

module.exports = {
    createSubSection,
    updateSubSection,
    deleteSubSection
}