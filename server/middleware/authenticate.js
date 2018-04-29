const {userModel} = require('./../model/user');

const authencticate = (req , res , next) =>{
    let token = req.header('x-auth');
    userModel
        .findByToken(token)
        .then((user)=>{
            if(!user){
                return Promise.reject();
            }
            req.user = user;
            req.token = token;
            next();
        }) .catch((e)=>{
            res.status(401).send(e);
        });   
};

module.exports = {authencticate};