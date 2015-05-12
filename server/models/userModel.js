var mongoose = require('mongoose'),
    crypto = require('crypto'),
    validator = require('validator');

var userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Please fill a valid email address']
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    salt: String,
    hashed_pwd: String,
    roles: [String],
    modified: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods = {
    authenticate: function(passwordToMatch) {
        return hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
    },
    setPassword: function(password) {
        this.salt = createSalt();
        this.hashed_pwd = hashPwd(this.salt, password);
        return this;
    }

};

var userModel = mongoose.model('User', userSchema);

userModel.findOne({
    roles: ['admin']
}, function(err, data) {
    if (data == null) {
        new userModel({
            email: 'admin@admin.com',
            firstName: 'Admin',
            lastName: 'Admin',
            roles: ['admin']
        }).setPassword('admin').save();

    }

});

function createSalt() {
    return crypto.randomBytes(128).toString('base64');
}

function hashPwd(salt, pwd) {
    var hmac = crypto.createHmac('sha1', salt);
    return hmac.update(pwd).digest('hex');
}

module.exports = userModel;
