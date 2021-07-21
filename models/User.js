var mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
    },
    email:{
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password:{
        type: String,
        require: true,
        trim: true,
    },
    avatar: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('user', UserSchema)