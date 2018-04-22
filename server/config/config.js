const env = process.env.NODE_ENV || "development";

if("development" === env){
    process.env.PORT = 3000;
    process.env.MONGO_URI = 'mongodb://localhost:27017/tododb';
} else if ("test" === env) {
    process.env.PORT = 3000;
    process.env.MONGO_URI = 'mongodb://localhost:27017/tododb_test';
}