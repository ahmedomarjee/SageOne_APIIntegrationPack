var router = require('express').Router(),
    mongoose = require('mongoose'),
    userModel = mongoose.model('User'),
    jwt = require('jsonwebtoken'),
    _ = require('lodash'),
    config = require('../config/config');

router.route('/login')
    .post(function(req, res, next) {
        userModel.findOne({
            email: req.body.email || ''
        }).exec(function(err, user) {
            if (err) {
                return next(err);
            }
            if (user && user.authenticate(req.body.password || '')) {
                user = _.omit(user.toObject(), 'salt', 'hashed_pwd', '__v');
                var token = jwt.sign(user, config.secret, {
                    expiresInMinutes: config.expiresInMinutes
                });
                res.json({
                    success: true,
                    user: user,
                    token: token
                });
            } else {
                res.status(401).send('Your email or password is incorrect.');
            }
        });
    });

router.route('/logout')
    .post(function(req, res, next) {
        res.json({
            success: true
        });
    });

router.route('/signup')
    .post(function(req, res, next) {
        var user = new userModel(req.body);
        user.setPassword(req.body.password);
        user.roles = [];
        user.save(function(err, data) {
            if (err)
                res.json(err);
            else
                user = _.omit(user.toObject(), 'salt', 'hashed_pwd', '__v');
            var token = jwt.sign(user, config.secret, {
                expiresInMinutes: config.expiresInMinutes
            });
            res.json({
                success: true,
                user: user,
                token: token
            });

        });
    });

module.exports = router;
