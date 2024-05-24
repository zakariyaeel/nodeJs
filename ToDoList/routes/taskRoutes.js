const express = require('express');
const router = express.Router();

const Task = require('../models/task');

router.get("/tasks", async (req,res) =>{
    try{
        const tasks = await Task.find();
        res.status(200).json(tasks);
    }catch (err){
        res.status(500).json({error : err.message});
    }
});

router.post("/tasks", async (req,res) => {
    try{
        const task = new Task(req.body);
        await task.save();
        res.status(200).json({message : "added !", task});
    }catch(err){
        res.status(400).send({err : err.message});
    }
})

router.put('/tasks/:id', async (req,res)=>{
    try{
        const {id} = req.params;
        const task = await Task.findByIdAndUpdate(id , req.body , {new: true});
        res.status(200).json({message : "updated!", task});
    }catch(err){
        res.status(400).json({err : err.message});
    }
})

router.delete("/tasks/:id",async (req,res)=>{
    try{
        const {id} = req.params;
        await Task.findByIdAndDelete(id);
        res.status(200).json({message : "deleted"});
    }catch(err){
        res.status(400).json({err : err.message});
    }
})
module.exports = router;