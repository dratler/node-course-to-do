const {mongoose,ObjectId} = require('../server/db/mongoose');
const {userModel} = require('../server/model/user');


const id  = "5ac3ec384bf1d6b312a42e3b";

userModel
    .findById(id)
    .then((user)=>{
        if(!user) {
            return console.log('requested user not found');
        }
        console.log(JSON.stringify(user,undefined,2));

    }).catch(
        (e)=>console.log(e)
    );