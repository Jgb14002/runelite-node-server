const express = require('express');
const api = express.Router();

const users = require('./users');
const plugins = require('./plugins');
const licenses = require('./licenses');

api.use('/users', users);
api.use('/plugins', plugins);
api.use('/licenses', licenses);

module.exports = api;