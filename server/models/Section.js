const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sectionSchema = new Schema({
  sectionName: {
    type: String,
  },
  subSection:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection",
        required:true
    }
  ]

});

module.exports = mongoose.model("Section", sectionSchema);
