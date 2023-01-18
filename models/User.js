const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const User = new Schema(
    {
        username: { type: String, required: [true, 'username is required'], unique: true },
        password: { type: String, required: [true, 'password is required'] },
        admin: {type: Boolean, default: false},
        added_films : {type: Array, default: []},
    },
    { timestamps: true }
);

User.pre('save', async function (next) {

    console.log(this.password);
    try {
        const user = this;
        if(!user.isModified('password')) next();
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
        next();
    } catch (e) {
        throw Error('could not hash password');
    }
})


module.exports = mongoose.model('User', User);