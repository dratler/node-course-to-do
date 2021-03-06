const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        minlenght: 1,
        unique: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a email!'
        }
    },
    password: {
        type: String,
        require: true,
        minlenght: 6,
    },
    time_stamp: {
        type: Number,
        default: new Date().getDate()
    },
    tokens: [{
        access: {
            type: String,
            require: true,
            minlenght: 1
        },
        token: {
            type: String,
            require: true,
            minlenght: 1
        }
    }]
});

userSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, process.env.JWT_SECERT).toString();
    user.tokens.push({
        access,
        token
    });
    return user.save().then(() => {
        return token;
    });
}

userSchema.methods.toJSON = function () {
    let user = this;
    let userObj = user.toObject();
    return _.pick(userObj, ['_id', 'email']);
}

userSchema.statics.findByToken = function (token) {
    let user = this;
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECERT);
    } catch (e) {
        return Promise.reject();
    }
    return user.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth',
    });
}

userSchema.statics.findByCredentials = function (email, password) {
    let user = this;
    return user.findOne({ email })
        .then((u) => {
            if (!u) {
                return Promise.reject();
            }
            return new Promise((resolve, reject) => {

                bcrypt.compare(password, u.password, (err, res) => {
                    if (res) {
                        resolve(u);
                    } else {
                        reject();
                    }
                });

            });
        });
};

userSchema.methods.removeToken = function (token) {
    let user = this;
    return user.update({
        $pull: {
            tokens: {
                token
            }
        }
    }
    );
}

userSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});


let userModel = mongoose.model('user', userSchema);

module.exports = {
    userModel
};