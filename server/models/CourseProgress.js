const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseProgress = new Schema({
    courseID: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    completedVideos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection"
        }
    ]
})

module.exports = mongoose.model("CourseProgress", courseProgress);