const {mongoose,ObjectId} = require('../server/db/mongoose');
const {userModel} = require('../server/model/user');
const {todoModel} = require('../server/model/todo');


todoModel.remove({}).then((results)=>{
    console.log(results)
});

todoModel.findOneAndRemove({_id}).then((results)=>{
    console.log(results)
});

todoModel.findByIdAndRemove(id).then((results)=>{
    console.log(results)
});