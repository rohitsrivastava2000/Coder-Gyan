import mongoose from 'mongoose'

const newPrjectSchema=mongoose.Schema({
    title:{
        type:String,
    },
    description:{
        type:String,
    },
    userId:{
        type:String,
    },
    meetingId:{
        type:String,
    },
    code:{
        type:String,
    }
})

const newProjectModel= mongoose.models.User || mongoose.model('NewProject',newPrjectSchema)

export default newProjectModel

