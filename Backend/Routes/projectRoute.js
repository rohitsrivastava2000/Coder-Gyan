import express from 'express'
import userAuth from '../Middleware/userAuth.js';
import { deleteProject, getAllProject, joinProject, newProject, saveProject, updateProject } from '../Controller/projectController.js';

const projectRoute=express.Router();


projectRoute.post('/new-project',userAuth,newProject);
projectRoute.post('/save-project',userAuth,saveProject);
projectRoute.post('/join-project',userAuth,joinProject);
projectRoute.post('/update-project/:projectId',userAuth,updateProject);
projectRoute.post('/delete-project/:projectId',userAuth,deleteProject);
projectRoute.get('/get-all-project',userAuth,getAllProject);



export default projectRoute;