const mongoose = require('mongoose');

const couponSchema =  new mongoose.Schema({
    couponCode:{
        type:String,
        required:true
    },
    couponDescription:{
        type:String,
        required:false
    },
    discountPercentage:{
        type:Number,
        required:true
    },
    maxDiscountAmount:{
        type:Number,
        required:true
    },

    couponexpiry: {
        type: Date,
        required: true
    },
    activeCoupon:{
        type:Boolean,
        default:false
    },
    usageCount:{
        type:Number,
        
    },
    createdOn:{
        type:Date,
        required:true
    }  ,
    usedBy:{
        type:Array
    }

})

module.exports = mongoose.model('Coupon', couponSchema)