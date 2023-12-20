const User = require("../model/userModel");
const Product = require("../model/productModel");
const Category = require("../model/categoryModel");
const Order = require("../model/orderModel");
const Cart = require("../model/cartModel");
const Coupon = require("../model/couponModel");
const Wallet = require("../model/walletModel");
const Banners = require("../model/bannerModel");
const multer = require('multer');
const path = require('path');


const loadBanners = async (req, res) => {
    try {
        const banners = await Banners.find();
        res.render("banners",{banners:banners})
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

const loadAddBanners=async (req,res)=>{
    try {

        res.render("addBanners")

    } catch (error) {
        console.log(error);
    }
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
}).array('image', 10);


const addBanners = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send("Error uploading image");
            }

            try {
                // Assuming you want to save multiple images, use req.files instead of req.file
                const images = req.files.map(file => ({ url: file.filename }));
                const bannerLink = req.body.bannerLink; // Extract link from the form


                // Create a new banner instance
                const newBanner = new Banners({
                    image: images,
                    link: bannerLink, // Include the link in the banner data
                });
                

                // Save the banner to the database
                await newBanner.save();

                // Redirect to the banners page or any other page
                res.redirect("/banners");
            } catch (error) {
                console.error(error);
                return res.status(500).send("Error saving image to the database");
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};





module.exports = {
    loadBanners,
    loadAddBanners,
    addBanners
};