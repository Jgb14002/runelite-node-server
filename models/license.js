const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');

const licenseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    key: {type: String, required: true, unique: true},
    plugins: {type: [mongoose.Schema.Types.ObjectId], ref: 'Plugin', required: true},
    redeemed: {type: Boolean, default: false},
    owner: {type: mongoose.Schema.Types.ObjectId, red: 'User'}

});

licenseSchema.plugin(validator);

module.exports = mongoose.model('License', licenseSchema);