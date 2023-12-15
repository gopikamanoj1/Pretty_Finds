// walletModel.js

const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    balance: {
        type: Number,
        required: true
    },
    transactions: [{
       data:{
        type: String
       },
        from: String,
        type: {
            type: String,
        },
        amount: {
            type: Number,
        },

    }]
}, { timestamp: true });

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
