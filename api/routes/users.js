const express = require('express');
const users = express.Router();
const mongoose = require('mongoose');

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

users.post('/', (req, res, next) => {
    const _hwid = req.body.hwid;
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        date_created: Date.now(),
        hwid: _hwid,
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