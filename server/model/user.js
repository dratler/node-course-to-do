const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let userSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true,
        minlenght:1,
        unique:true,
        trim:true,
        validate:{
            validator: validator.isEmail,
            message: '{VALUE} is not a email!'
        }
    },
    password:{
        type:String,
        require:true,
        minlenght:6,
    },
    time_stamp:{
        type:Number,
        default:new Date().getDate()
    },
    token:[{
        access:{
            type:String,
            require:true,
            minlenght:1
        },
        token:{
            type:String,
            require:true,
            minlenght:1
        }
    }]
});

userSchema.methods.generateAuthToken = function(){
    let user = this;
    let access = user.access;
    let token = jwt.sign({_id:user._id, access},'abc123').toString();
    user.token = user.token.concat([{access,token}]);
    return user.save().then( ()=>{
        return token;
    });
}

userSchema.methods.toJSON = function(){
    let user = this;
    let userObj = user.toObject();
    return _.pick(userObj,['email','password','time_stamp']);
}

let userModel = mongoose.model('user',userSchema);

module.exports = {userModel};
