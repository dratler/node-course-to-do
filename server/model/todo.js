const mongoose = require('mongoose');

let todoModel = mongoose.model('todo',{
    text:{
        type:String,
        require:true,
        minlenght:1,
        trim:true
    },
    compeleted:{
        type:Boolean,
        default:false
    },
    time_stamp:{
        type:Number,
        default:new Date().getDate()
    }
});

module.exports = {todoModel};
