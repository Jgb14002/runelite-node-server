const express = require('express');
const users = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

users.get('/', (req, res, next) => {
   User.find()
   .select('-__v')
   .exec()
   .then(docs => {
       const response = {
           count: docs.length,
           users: docs.map(doc => {
               return {
                   id: doc._id,
                   hwid: doc.hwid,
                   discord: doc.discord,
                   last_ip: doc.last_ip,
                   plugins: doc.plugins.length
               }
           })
       };
        res.status(200).json(response);
   })
   .catch(err => {
       res.status(500).json({
           error: err
       });
   });
});

users.post('/register', (req, res, next) => {

    User.find({username: req.body.username})
    .exec()
    .then(user => {
        if(user.length > 0){
            return res.status(409).json({
                message: 'A user with this username already exists.'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        username: req.body.username,
                        password: hash,
                        date_created: Date.now(),
                        last_login: null,
                        last_ip: req.connection.remoteAddress,
                        discord: null,
                        ip_addresses: [req.connection.remoteAddress],
                        plugins: [],
                        banned: false,
                        failed_logins: []
                    });
                    user.save().then(result => {
                        res.status(200).json({
                            message: 'OK.',
                            userID: user._id
                        });
                    }).catch((err) => {
                        res.status(500).json({
                            error: err
                        });
                    });     
                }
            });
        }
    });
});

users.post('/login', (req, res, next) => {
        User.find({username: req.body.username})
        .exec()
        .then(user => {
            if(user.length < 1){
                return res.status(401).json({message: 'Invalid username or password.'})
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err != null || !result){
                    return res.status(401).json({message: 'Invalid username or password.'})
                }

                const token = jwt.sign({
                    username: user.username,
                    userID: user._id
                }, process.env.JWT_SECRET, 
                {
                    expiresIn: process.env.JWT_EXPIRE
                });

                return res.status(200).json({
                    message: 'OK.',
                    token: token
                });   
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    });
});

users.get('/:userID', (req, res, next) => {
    const id = req.params.userID;
    User.findById(id)
    .select('-__v')
    .populate('plugins', ['_id', 'name'])
    .exec()
    .then(doc => {
        if(doc != null){
            res.status(200).json(doc);
        } else {
            res.status(404).json({message: 'No entry found for specified user ID.'})
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

users.patch('/:userID', (req, res, next) => {
    const id = req.params.userID;
    const keys = {};
    for(const key in req.body)
    {
        keys[key] = req.body[key];
    }
   User.update({_id:id}, {$set: keys})
   .exec()
   .then(result => {
       res.status(200).json({message: "OK."});
   })
   .catch(err => {
        res.status(500).json({
            error: err
        });
   });
});

users.delete('/:userID', (req, res, next) => {
    const id = req.params.userID;
    User.remove({_id:id})
    .exec()
    .then(result => {
        res.status(200).json({message: "OK."});
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = users;