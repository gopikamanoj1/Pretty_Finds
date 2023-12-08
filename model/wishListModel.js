
const mongoose = require('mongoose');



const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
});

const Wishlist = mongoose.model('wishlist', wishlistSchema);

module.exports = Wishlist;

