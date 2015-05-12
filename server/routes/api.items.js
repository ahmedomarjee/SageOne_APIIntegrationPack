var router = require('express').Router(),
    itemService = require('../services/itemService'),
    itemModel = itemService.model,
    _ = require('lodash');

router.route('/items')
    .get(function(req, res) {
        itemModel.find({}, function(err, data) {
            if (err)
                res.send(err);
            res.json(data);
        });
    })
    .post(function(req, res) {
        if (_.contains(req.user.roles, 'admin')) {
            if (req.body._id) {
                itemModel.findOneAndUpdate({
                    _id: req.body._id
                }, _.omit(req.body, '_id'), function(err, data) {
                    if (err)
                        res.json(err);
                    else
                        res.json(data);

                });
            } else {
                new itemModel(req.body).save(function(err, data) {
                    if (err)
                        res.json(err);
                    else
                        res.json(data);
                });
            }
        } else {
            res.status(401).send('');
        }
    });

router.route('/items/sync')
    .get(function(req, res) {
        if (_.contains(req.user.roles, 'admin')) {
            itemService.sync();
            res.send({});
        } else
            res.status(401).send('');
    });

router.route('/items/:id')
    .get(function(req, res) {
        itemModel.findOne({
            _id: req.params.id
        }, function(err, data) {
            if (err)
                res.send(err);
            res.json(data);
        });
    })

router.route('/items/:id/order')
    .post(function(req, res) {        
        itemModel.findOne({
            _id: req.params.id
        }, function(err, data) {
            if (err)
                res.send(err);
            itemService.order(data,req.user);
            res.send();
        });
    })    

router.route('/itemCategories/:id/items')
    .get(function(req, res) {
        itemModel.find({
            category: req.params.id
        }, function(err, data) {
            if (err)
                res.send(err);
            res.json(data);
        });
    })



module.exports = router;
