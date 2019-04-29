const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date_created: {type:Date, required: true},
    hwid: {type:String, required: true, unique: true},
    last_login: Date,
    last_ip: String,
    discord: String,
    ip_addresses: [String],
    plugins: [{type: mongoose.Schema.Types.ObjectId, ref: 'Plugin'}],
    banned: Boolean,
    failed_logins: [{
        date: Date,
        ip_address: String,
        hwid: String
    }]
});

userSchema.plugin(validator);

userSchema.statics.pushPlugins = function(userID, _plugins, callback)
{
    this.update({_id:userID}, {$push: {plugins: _plugins}})
    .exec()
    .then(result => {
        callback(null);
    }).catch(err => {
        callback(err);
    });
}

module.exports = mongoose.model('User', userSchema);