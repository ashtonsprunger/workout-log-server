require('dotenv').config();
let express = require('express');
let app = express();
let user = require('./controllers/userController');
let log = require('./controllers/logController');
let sequelize = require('./db');
const { response } = require('express');
sequelize.sync();
app.use(express.json());
app.use(require('./middleware/headers'));

sequelize.authenticate().then(
    function(){
        console.log('Connected to workoutlog postgres database')
    },
    function(err){
        console.log(err);
    }
);

app.use('/user', user);

app.use(require('./middleware/validate-session'));

app.use('/log', log);

app.listen(9999, function(){
    console.log('Workout log server is listening on port 9999.');
});