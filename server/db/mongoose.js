const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//let mongo_uri = process.env.MONGO_URI || 'mongodb://localhost:27017/tododb';
let mongo_uri = 'mongodb://db_user_one:q1w2e3r4t5y6u7@ds147459.mlab.com:47459/node_c_todo_db';
mongoose.connect(mongo_uri);

module.exports = {mongoose};