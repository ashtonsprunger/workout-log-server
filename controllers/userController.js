let express = require('express');
let router = express.Router();
let sequelize = require('../db');
let User = sequelize.import('../models/user');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');

router.post('/register', (request, response) => {
    let username = request.body.user.username;
    let password = request.body.user.password;

    User.create({
        username: username,
        passwordhash: bcrypt.hashSync(password, 12)
    }).then(
        function createSuccess(user){

            let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});

            response.json({
                user: user,
                message: 'created',
                sessionToken: token
            });
        },
        function createError(error){
            response.send(500, error.message);
        }
    );
});

router.post('/login', (request, response) => {
    User.findOne({where: {username: request.body.user.username}})
        .then(
            function(user){
                if(user){
                    bcrypt.compare(request.body.user.password, user.passwordhash,
                    function(err, matches){
                        if(matches){
                            let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
                            response.json({
                                user: user,
                                message: "successfully authenticated",
                                sessionToken: token
                            })
                        }else{
                            response.status(502).send({error: "you failed, yo"});
                        }
                    })
                }else{
                    response.status(500).send({error: "failed to authenticate"});
                }
            },
            function(error){
                response.status(501).send({error: "you failed, yo"});
            }
        );
});

module.exports = router;