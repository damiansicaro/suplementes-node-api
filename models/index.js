const Sequelize = require('sequelize');
const { db } = require('../config.json');

const sequelize = new Sequelize(
    db.database,
    db.username,
    db.password,
    {
        host: db.host,
        port: db.port,
        dialect: 'mysql',
        define: {
            underscored: true
        },
        logging: false
    }
);


var models = {};

models.Sequelize = Sequelize;
models.sequelize = sequelize;

//Models/tables
models.account = require('./account')(sequelize, Sequelize)
models.product = require('./product')(sequelize, Sequelize)

module.exports = models;
