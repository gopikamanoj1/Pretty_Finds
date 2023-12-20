const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    image: [
        {
          url: {
            type: String,
            required: true,
          },
        },
    ],
    link: {
        type: String, // You may want to use a more specific type if needed (e.g., URL type)
        required: false, // Update as needed based on your requirements
    },
    // Add any other fields you need for your banners
});

const Banner = mongoose.model("Banner", bannerSchema);

module.exports = Banner;
