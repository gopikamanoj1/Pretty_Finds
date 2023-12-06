const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Products",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered','Cancel','Returned'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now 
  },
  isWallet:{
    default:'nil',
    type:String
  },
  addresses: {
    type: mongoose.Schema.Types.ObjectId, // Change the type here
    ref: "User", // Update with your Address model name
    required: true,
  },
  reasonForCancel:{
    default:'nil',
    type:String
  },
  reasonForReturn:{
    default:'nil',
    type:String
  },
  delivered_date:{
    type: Date,
  },
  paymentId: {
    type: String,
    default: ""
  },
  paymentType:{
    type: String,
    require: true
  },
  paymentStatus: {
    type: String,
    require:true,
    default:"pending"
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
