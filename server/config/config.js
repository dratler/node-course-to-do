const env = process.env.NODE_ENV || "development";
if ('development' === env || 'test' === env) {
    const config = require('./config.json');
    const envConfig = config[env];
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });

}