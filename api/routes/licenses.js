const express = require('express');
const licenses = express.Router();
const mongoose = require('mongoose');

const License = require('../../models/license');

licenses.get('/', (req, res, next) => {

});

licenses.post('/', (req, res, next) => {

});

licenses.get('/:licenseID', (req, res, next) => {

});

licenses.delete('/:licenseID', (req, res, next) => {

});

licenses.patch('/:licenseID', (req, res, next) => {

});

function redeem(key)
{

}

module.exports = [licenses, redeem];