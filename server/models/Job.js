const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'please add a job title'],
        trim:true
    },
    description:{
        type:String,
        required:[true,'please add a job description']
    },
    company:{
        type:String,
        required:[true,'please add a company name']
    },
    location:{
        type:String,
        required:[true,'please add a location']
    },
    jobType:{
        type:String,
        enum:['full-time','part-time','remote','intership','contract'],
        required:true
    },
    salary:{
        min:{type:Number},
        max:{type:Number},
        currency:{type:String,default:'INR'}

    },
    skills:[{type:String}],
    experience:{
        type:String,
        enum:['fresher','1-2 years','2-5 years','5+ years'],
        required:true
    },
    education:{
        type:String
    },
    openings:{
        type:Number,
        default:1
    },
    deadline:{
        type:Date
    },
    status:{
        type:String,
        enum:['active','closed'],
        default:'active'
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model('Job',jobSchema)