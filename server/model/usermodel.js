const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
       type: String,
       required: true
    },
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        required: true,
        default: ["VIEWER"], 
    }
}, {
    versionKey: false
});

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
