const Sequelize = require('sequelize');

const sequelize = new Sequelize('workoutlog', 'postgres', 'ashtonefa', {
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = sequelize;