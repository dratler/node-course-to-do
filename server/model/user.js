const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
    tokens:[{
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
    let access ='auth';
    let token = jwt.sign({_id:user._id.toHexString(), access},'abc123').toString();
    user.tokens.push({access, token});
    return user.save().then( ()=>{
        return token;
    });
}

userSchema.methods.toJSON = function(){
    let user = this;
    let userObj = user.toObject();
    return _.pick(userObj,['_id','email']);
}

userSchema.statics.findByToken = function(token){
    let user = this;
    let decoded;
    try{
        decoded = jwt.verify(token,'abc123');
        } catch(e){
       return Promise.reject();
    }
    console.log('I have found a user :'+user);
    return user.findOne({
         '_id':decoded._id,
         'tokens.token':token,
         'tokens.access':'auth',
    });
    
}

userSchema.pre('save',function(next){
    let user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            next();
          });
        });
      } else {
        next();
      }
});


let userModel = mongoose.model('user',userSchema);

module.exports = {userModel};
