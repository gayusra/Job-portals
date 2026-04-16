const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    resume:{
        type:String,
        required:true
    },
    coverLetter:{
        type:String
    },
    status:{
        type:String,
        enum:['pending','reviewed','shortlisted','rejected','hired'],
        default:'pending'
    },
    appliedAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true})

//prevent duplicate applications
applicationSchema.index({job:1,applicant:1},{unique:true})

module.exports = mongoose.model('Application',applicationSchema)