import mongoose from 'mongoose'

const prjectSchema=mongoose.Schema({
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
    },
    language:{
        type:String,
        default:"cpp"
    },
    username:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const projectModel= mongoose.models.Project || mongoose.model('Project',prjectSchema)

export default projectModel

