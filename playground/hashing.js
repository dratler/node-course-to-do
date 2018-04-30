const {SHA256} = require("crypto-js");
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

let password = '123abc';

bcryptjs.genSalt(10,(err,salt)=>{
    bcryptjs.hash(password, salt, (err , hash)=>{
        console.log(`password ${password} : hash ${hash}`);
    });
});


// let data = {
//     id : [1,2,3,4]
// };

// let token = jwt.sign(data,'123');
// console.log(token);