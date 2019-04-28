const express = require('express');
const plugins = express.Router();
const mongoose = require('mongoose');

const Plugin = require('../../models/plugin');

plugins.get('/', (req, res, next) => {
    Plugin.find()
    .select('-__v')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            plugins: docs.map(doc => {
                return {
                    id: doc._id,
                    name: doc.name
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

plugins.post('/', (req, res, next) => {
    const _name = req.body.name;
    const _description = req.body.description;
    const _price = req.body.price;

    const plugin = new Plugin({
        _id: new mongoose.Types.ObjectId(),
        name: _name,
        description: _description,
        price: _price
    });
    plugin.save().then(result => {
        res.status(200).json({
            message: 'OK.',
            pluginID: plugin._id
        });
    }).catch((err) => {
        res.status(500).json({
            error: err
        });
    });

});

plugins.get('/:pluginID', (req, res, next) => {
    const id = req.params.pluginID;
    Plugin.findById(id)
    .select('-__v')
    .exec()
    .then(doc => {
        if(doc != null){
            res.status(200).json(doc);
        } else {
            res.status(404).json({message: 'No entry found for specified plugin ID.'})
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

plugins.patch('/:pluginID', (req, res, next) => {
    const id = req.params.pluginID;
    const keys = {};
    for(const key in req.body)
    {
        keys[key] = req.body[key];
    }
   Plugin.update({_id:id}, {$set: keys})
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

plugins.delete('/:pluginID', (req, res, next) => {
    const id = req.params.pluginID;
    Plugin.remove({_id:id})
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


module.exports = plugins;