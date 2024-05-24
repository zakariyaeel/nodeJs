const express = require('express');
const mongoose = require("mongoose");
const taskRoutes = require('./routes/taskRoutes');

const app  = express();
const port = 3000;

//middleware
app.use(express.json());

// DB connection
mongoose.connect("mongodb://localhost:27017/ToDo");

const db = mongoose.connection;
db.on("error",()=>{
    console.log("Connection Failed!");
});
db.once('open',()=>{
    console.log("Db connected!");
});
// ===============================

app.use(taskRoutes);


//listning
app.listen(port,()=>{
    console.log("App Running http://localhost:3000/");
})