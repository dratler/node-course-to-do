const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp',(err, client)=>{
    if(err){
        return console.log('error while connecting to mongodb');
    }
    console.log('connection to MongoDb');
    const db = client.db('ToDoApp');
    //DELETE MANY
    db.collection('todos')
        .deleteMany({task:'duplicate'}) 
        .then((res)=>{
            console.log(res);
        });  
    //DELETE ONE
    db.collection('todos')
    .deleteOne({task:'duplicate - with one'}) 
    .then((res)=>{
        console.log(res);
    }); 
    //FindOneAndDelete
    db.collection('todos')
    .findOneAndDelete({task:'duplicate - with two'}) 
    .then((res)=>{
        console.log(res);
    });
     client.close();

});
