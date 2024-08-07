const mongoose = require("mongoose")
const Schema = mongoose.Schema

const profileSchema = new Schema({
    gender:{
        type:String
    },
    dateOfBirth:{
        type:String
    },
    about:{
        type:String
    },
    contactNumber:{
        type:String,
        trim:true
    }
})

module.exports = mongoose.model("Profile", profileSchema)