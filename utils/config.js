const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    username: process.env.MLAB_USERNAME,
    password: process.env.MLAB_PW,
    host: process.env.MLAB_HOST,
    dbname: process.env.DB_NAME,
    dbengine: process.env.DB_ENGINE
};