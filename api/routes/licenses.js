const express = require('express');
const licenses = express.Router();
const mongoose = require('mongoose');

const License = require('../../models/license');

licenses.get('/', (req, res, next) => {
    License.find()
    .select('-__v')
    .populate('plugins', ['_id', 'name'])
    .exec()
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
});

licenses.post('/', (req, res, next) => {
    const _key = req.body.key;
    const _plugins = req.body.plugins;

    const license = new License({
        _id: new mongoose.Types.ObjectId(),
        key: _key,
        plugins: _plugins
    });

    license.save()
    .then(result => {
        res.status(200).json({
            id: result._id,
            key: result.key,
            plugins: result.plugins
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

licenses.get('/:licenseID', (req, res, next) => {
    const id = req.params.licenseID;
    License.findById(id)
    .select('-__v')
    .populate('plugins', ['_id', 'name'])
    .exec()
    .then(doc => {
        if(doc != null) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({message: 'No entry found for specified license ID.'})
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

licenses.delete('/:licenseID', (req, res, next) => {
    const id = req.params.liecenseID;
    License.remove({_id:id})
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

licenses.patch('/:licenseID', (req, res, next) => {
    const id = req.params.licenseID;
    const keys = {};
    for(const key in req.body)
    {
        keys[key] = req.body[key];
    }
   License.update({_id:id}, {$set: keys})
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

function redeem(userID, key)
{
    
}

module.exports = [licenses, redeem];