const mongoose = require('./db/mongoose');
let {todoModel} = require('./model/todo');
let {userModel} = require('./model/user');

let express = require('express');
let body = require('body-parser');

const port = process.PORT || 3000;
let app = express();

app.use(body.json());

app.post('/todo',(req,res)=>{
    let todo = new todoModel({text:req.body.text});

    todo.save().then(
        (doc)=>{
            res.send(doc);
        }
        ,(e)=>{
            console.log(`error storing the body :${e}`);
        })

});


app.listen(port,()=>{console.log(`server is starting on port ${port}`)});