const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp',(err, client)=>{
    if(err){
        return console.log('error while connecting to mongodb');
    }
    console.log('connection to MongoDb');
    const db = client.db('ToDoApp');
    // db.collection('todos').find({done:false}).toArray().then((doc)=>{
    //     console.log(JSON.stringify(doc));
    // },(err)=>{console.log('Error:'+err);});

    db.collection('todos').find().count().then((count)=>{
        console.log(`count amount of data ${count}`);
    },(err)=>{console.log(`Count Error ${err}`);});


     client.close();

});
