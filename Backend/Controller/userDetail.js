import User from "../Model/userSchema.js";

export const getInfo=async(req,res)=>{
    const userId=req.userId;
    console.log(userId)
   try {
     const user=await User.findById({_id:userId});

    if(!user){
        return res.status(401).json({
            success:false,
            message:"User Not Exist"
        })
    }

    const detail={
        username:user.userName,
        email:user.email
    }

    return res.status(200).json({
        success:true,
        message:"Get The User Detail",
        detail:detail
    })
   } catch (error) {
    return res.status(500).json({
        success:false,
        message:"Something went wrong on the getInfo "
    })
   }
}