const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');

const pluginSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    price: {type: Number, required: true}
});

pluginSchema.plugin(validator);

module.exports = mongoose.model('Plugin', pluginSchema);

