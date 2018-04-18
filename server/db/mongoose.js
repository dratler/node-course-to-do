const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let mongo_uri = process.env.MONGO_URI || 'mongodb://localhost:27017/tododb';
mongoose.connect(mongo_uri);

module.exports = {mongoose};