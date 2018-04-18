const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let mongo_uri = 'mongodb://db_user_one:ZAQ!xsw2@ds147459.mlab.com:47459/node_c_todo_db' || 'mongodb://localhost:27017/tododb';
mongoose.connect(mongo_uri);

module.exports = {mongoose};