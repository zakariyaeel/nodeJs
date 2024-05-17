const mongoose = require("mongoose");

const taskShema = new mongoose.Schema({
    titel : {type : String, required : true},
    description : {type : String, required : false},
    completed : {type : Boolean, default: false}
});

module.exports = mongoose.model('Task', taskShema);