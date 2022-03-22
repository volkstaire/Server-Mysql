const dotenv = require('dotenv')

dotenv.config()

const config = {
    host: process.env.IP_HOST_DATABASE,
    port: process.env.PORT_DATABASE,
    user: process.env.USER_DATABASE,
    password: process.env.PASSWORD_DATABASE,
    database: process.env.DATABASE_NAME
};

module.exports = config;