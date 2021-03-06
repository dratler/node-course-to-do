const mongoose = require('mongoose');

let todoModel = mongoose.model('todo',{
    text:{
        type:String,
        required: true,
        minlength: 1,
        trim: true
    },
    compeleted:{
        type:Boolean,
        default:false
    },
    time_stamp:{
        type:Number,
        default:new Date().getDate()
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        require:true
    }
});

module.exports = {todoModel};
