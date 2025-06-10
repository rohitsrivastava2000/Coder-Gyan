import Project from "../Model/projectSchema.js";
import User from "../Model/userSchema.js";

export const newProject = async (req, res) => {
  try {
    const { title, description, meetingId, username } = req.body;
    const userId = req.userId;

    const checkMeeting = await Project.findOne({ meetingId: meetingId });
    if (checkMeeting) {
      return res.status(401).json({
        success: false,
        message: "Generate New Meeting ID",
      });
    }

    const projectDetail = new Project({
      title,
      description,
      userId,
      meetingId,
      username,
    });

    await projectDetail.save();

    const projectId = projectDetail._id;

    // console.log(projectDetail)
    const response = await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { projectId: projectId } }
    )
      .populate("projectId")
      .exec();

    console.log(response);

    return res.status(200).json({
      success: true,
      message: "Project Created",
      projectId: projectDetail._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong on the newProject",
    });
  }
};

export const saveProject = async (req, res) => {
  try {
    const { projectId, code, language } = req.body;

    if (!projectId)
      return res.status(401).json({
        success: false,
        message: "Need Project Id",
      });

    const searchProject = await Project.findById({ _id: projectId });

    if (!searchProject) {
      return res.status(400).json({
        success: false,
        message: "Wrong Project Id",
      });
    }

    const projectDetail = {
      code,
      language,
    };

    await Project.findByIdAndUpdate(projectId, projectDetail, { new: true });

    return res.status(200).json({
      success: true,
      message: "Project Save",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong on saveProject",
    });
  }
};

export const joinProject = async (req, res) => {
  try {
    const { meetingId } = req.body;
    const userId = req.userId;
    if (!meetingId) {
      return res.status(401).json({
        success: false,
        message: "Meeting Id is Missing",
      });
    }

    const gotProject = await Project.findOne({ meetingId });

    if (!gotProject) {
      return res.status(401).json({
        success: false,
        message: "No any current Meeting on that Meeting ID",
      });
    }

    const response = await User.findByIdAndUpdate(userId, {
      $push: { projectId: gotProject._id },
    })
      .populate("projectId")
      .exec();
    console.log("join-Project");
    console.log(response);

    return res.status(200).json({
      success: true,
      message: "Join Successfully",
      projectId: gotProject._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong on joinProject",
    });
  }
};

//delete project
export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userId=req.userId;
    //how to send projectId from the frontend side
    // {
    //   {
    //     projects.map((project) => (
    //       <div key={project._id}>
    //         <p>{project.title}</p>
    //         <button onClick={() => deleteProject(project._id)}>Delete</button>
    //       </div>
    //     ));
    //   }
    //   const deleteProject = async (projectId) => {
    //     await axios.delete(`/api/project/${projectId}`);
    //   };
    // }

    // Find the project
    const project = await Project.findById(projectId);
    console.log(projectId)
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Delete project from Project collection
    await Project.findByIdAndDelete(projectId);

    // Remove project from user's list
    await User.findByIdAndUpdate(userId, {
      $pull: { projectId: projectId },
    });

    return res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error in deleteProject" });
  }
};
//update project

export const updateProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;

  const {title,description}=req.body;

  // Find the project
    const project = await Project.findById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    await Project.findByIdAndUpdate(projectId,{title:title,description:description});

    return res.status(200).json({
        success:true,
        message:"Update Successfully"
    })
  } catch (error) {
    return res.status(500).json({
        success:false,
        message:"Something went wrong on the updateProject"
    })
  }
};


export const getAllProject=async(req,res)=>{
    try {
        const userId=req.userId;

    const user=await User.findById(userId).populate('projectId');

    const getProjectDetail=user.projectId;

    console.log(getProjectDetail);

    return res.status(200).json({
        success:true,
        message:"Getting all Project",
        projects:getProjectDetail
    })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went wrong in getAllProject"
        })
    }
}
