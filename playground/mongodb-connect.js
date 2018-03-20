const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp',(err, client)=>{
    if(err){
        return console.log('error while connecting to mongodb');
    }
    console.log('connection to MongoDb');
    // const db = client.db('ToDoApp');
    // db.collection('todos').insertOne({
    //     'task':'Do two thing',
    //     'done':false
    // },(err,res)=>{
    //     if(err){return console.log('Adding failed');}
    //     console.log(JSON.stringify(res.ops,undefined,2));
    // });
    // client.close();
});
