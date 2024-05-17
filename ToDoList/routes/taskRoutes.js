const express = require('express');
const router = express.Router();

const task = require('../models/task');

router.get("/tasks", async (req,res) =>{
    try{
        const tasks = await task.find();
        res.status(200).json(tasks);
    }catch (err){
        res.status(500).json({error : err.message});
    }
});

module.exports = router;