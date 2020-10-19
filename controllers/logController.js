let router = require('express').Router();
let sequelize = require('../db');
const log = require('../models/log')
let LogModel = sequelize.import('../models/log');

router.post('/', (request, response) => {
    let description = request.body.log.description;
    let definition = request.body.log.definition;
    let result = request.body.log.result;

    console.log(request.user);
    
    let owner = request.user.id;

    LogModel
        .create({
            description: description,
            definition: definition,
            result: result,
            owner: owner
        })
        .then(
            function createSuccess(data){
                response.json({
                    data: data
                });
            },
            function createError(error){
                response.send(500, error.message);
            }
        );
});

router.get('/', (request, response) => {
    let userid = request.user.id;

    LogModel
        .findAll({
            where: {owner: userid}
        })
        .then(
            function findAllSuccess(data){
                response.json(data);
            },
            function findAllError(error){
                response.json(500, error.message);
            }
        );
});

router.get('/:id', (request, response) => {
    let userid = request.user.id;
    let id = request.params.id;

    LogModel
        .findOne({
            where: {owner: userid, id: id}
        })
        .then(
            function findSuccess(data){
                response.json(data);
            },
            function findError(error){
                response.send(500, error.message);
            }
        );
});

router.put('/:id', (request, response) => {
    let id = request.params.id;
    let log = request.body.log;
    let userid = request.user.id;

    LogModel
        .update({
            definition: log.definition,
            description: log.description,
            result: log.result
        },
        {where: {id: id, owner: userid}}
        ).then(
            function updateSuccess(updateLog){
                response.json({
                    log: log
                });
            },
            function updateError(error){
                response.send(500, error.message);
            }
        )
})

router.delete('/:id', (request, response) => {
    let id = request.params.id;
    let userid = request.user.id;

    LogModel
        .destroy({
            where: {id: id, owner: userid}
        }).then(
            function deleteSuccess(data){
                response.send('You removed a log');
            },
            function deleteError(error){
                response.send(500, error.message);
            }
        );
});

module.exports = router;