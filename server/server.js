const express = require('express');
const body = require('body-parser');
let {ObjectID} = require('mongodb');


const {mongoose} = require('../server/db/mongoose');
let {todoModel} = require('./model/todo');
let {userModel} = require('./model/user');

const port = process.PORT || 3000;
let app = express();

app.use(body.json());

const TODO_PATH = '/todo';

app.get(TODO_PATH,(req,res)=>{
    todoModel
        .find()
        .then((todos)=>{
            res.send({todos});
        },(err)=>{res.status(400).send(e);});
});

app.get(`${TODO_PATH}/:id`,(req,res)=>{
    
    let id = req.params.id;
  
    console.log(ObjectID);
    if(!ObjectID.isValid(id)){
        res.status(404).send(`Given id is invalid ${id}`);
    }
    todoModel
    .findById(id)
    .then((todo)=>{
        if(!todo){
            res.status(401).send(`Todo not found by id ${todo}`);
        }
        res.send({todo});
    },(err)=>{res.status(400).send(e);});
});

app.post(TODO_PATH,(req,res)=>{
    let todo = new todoModel({text:req.body.text});
    todo.save().then(
        (doc)=>{
            res.send(doc);
        }
        ,(e)=>{
            res.status(400).send(e);
        })

});


app.listen(port,()=>{console.log(`server is starting on port ${port}`)});

module.exports = {app};