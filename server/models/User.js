const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please add a name'],
        trim:true
    },
    email:{
        type:String,
        required:[true,'please add an email'],
        unique:true,
        lowerCase:true,
         match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    password:{
        type:String,
        required:[true,'Please add a password'],
        minlength:6
    },
    role:{
        type:String,
        enum:['jobseeker','employer'],
        default:'jobseeker'
    },
    profile:{
        phone:{type:String},
        location:{type:String},
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String},
        companyName:{type:String},
        companyWebsite:{type:String}
    }
},{timestamps:true})

module.exports = mongoose.model('User',userSchema)