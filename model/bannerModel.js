const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    image: [
        {
          url: {
            type: String,
            required: true,
          },
        },
      ]
    // Add any other fields you need for your banners
});

const Banner = mongoose.model("Banner", bannerSchema);

module.exports = Banner;
