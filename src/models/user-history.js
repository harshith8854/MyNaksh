const mongoose = require("mongoose");
const user = require("./user");

const userHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    date: {
        type: Date,
        required: true
    },
    horoscope: {
        type: String,
        required: true
    }
});

// to store only 
userHistorySchema.index({userId: 1, date: 1}, {unique: true});

module.exports = mongoose.model('UserHistory',userHistorySchema);