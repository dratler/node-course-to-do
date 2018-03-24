const mongoose = require('mongoose');

let userModel = mongoose.model('user',{
    email:{
        type:String,
        require:true,
        minlenght:1
    },
    full_name:{
        type:String,
        require:true,
        minlenght:1
    },
    time_stamp:{
        type:Number,
        default:new Date().getDate()
    }
});

module.exports = {userModel};
