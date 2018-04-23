const {SHA256} = require("crypto-js");
const jwt = require('jsonwebtoken');

let data = {
    id : [1,2,3,4]
};

let token = jwt.sign(data,'123');
console.log(token);