const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    is_admin: {
        type: Number,
        default: false,
        required: true
    },
    is_verified: {
        type: Number,
        default: 0
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    addresses: [{
        name: String,
        street: String,
        city: String,
        state: String,
        phone: String,
        pincode: Number
    }],
    wallet: {
        type: Number
    },
    
    myRefferalCode: {
        type: String, // Assuming your referral code is a string, you can adjust the type accordingly
        unique: true,
        default:""
    },
    refferalUsedBy:{
        type:Array
    }
});
 
module.exports = mongoose.model('User', userSchema);
