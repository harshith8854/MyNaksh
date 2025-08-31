const argon2  = require('argon2');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    zodiac: {
        type: String,
        required: true
    }
});

// - encrypt/hash the password while storing
userSchema.pre('save', async function() {
    if(this.isModified('password')){
        const hash = await argon2.hash(this.password);
        this.password = hash;
    }
});

module.exports = model('User', userSchema);