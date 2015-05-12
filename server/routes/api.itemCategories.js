var router = require('express').Router(),
    itemCategoryService = require('../services/itemCategoryService'),
    itemCategoryModel = itemCategoryService.model,
    _ = require('lodash');

router.route('/itemCategories')
    .get(function(req, res) {
        itemCategoryModel.find({}, function(err, data) {
            if (err)
                res.send(err);
            res.json(data);
        });
    })
    .post(function(req, res) {
        if (_.contains(req.user.roles, 'admin')) {
            if (req.body._id) {
                itemCategoryModel.findOneAndUpdate({
                    _id: req.body._id
                }, _.omit(req.body, '_id'), function(err, data) {
                    if (err)
                        res.json(err);
                    else
                        res.json(data);

                });
            } else {
                new itemCategoryModel(req.body).save(function(err, data) {
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

router.route('/itemCategories/sync')
    .get(function(req, res) {
        if (_.contains(req.user.roles, 'admin')) {
            itemCategoryService.sync();
            res.send({});
        } else
            res.status(401).send('');
    });

router.route('/itemCategories/:id')
    .get(function(req, res) {
        itemCategoryModel.findOne({
            _id: req.params.id
        }, function(err, data) {
            if (err)
                res.send(err);
            res.json(data);
        });
    });



module.exports = router;
