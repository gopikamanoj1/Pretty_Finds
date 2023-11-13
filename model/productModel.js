const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },
  
  price: {
    type: Number,
    required: true,
    // Add unique constraint on product_price field
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  image: [
    {
        url: {
            type: String,
            required: true,
        }
    }
],

  description: {
    type: String,
    required: true,
  },
  
  stock: {
    type: Number,
    required: true,
  }
});
module.exports = mongoose.model("Products", productSchema); 

