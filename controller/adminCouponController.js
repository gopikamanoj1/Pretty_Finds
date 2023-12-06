const AdminOrder = require("../model/orderModel");
const User=require ("../model/userModel");
const AdminProduct = require("../model/productModel");
const Coupon = require("../model/couponModel");



// controller/adminCouponController.js

const loadCoupenPage = async (req, res) => {
    try {
        // Assuming you fetch the coupons from the database here, adjust as needed
        const coupons = await Coupon.find();

        res.render("addCoupen", { coupons: coupons });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};




const createCoupon = async (req, res) => {
    try {
        // Retrieve data from the form
        const { couponcode, couponDescription, Discount, MazimumAmount,  couponexpiry } = req.body;

        // Create a new coupon
        const newCoupon = new Coupon({
            couponCode: couponcode,
            couponDescription: couponDescription,
            discountPercentage: Discount,
            maxDiscountAmount: MazimumAmount,
            couponexpiry: couponexpiry, // Fix the assignment here
            activeCoupon: true, // Assuming the coupon is active by default
            usageCount: 0,
            createdOn: new Date(),
        });

        // Save the coupon to the database
        await newCoupon.save();

        // Redirect to the addCoupen page
        res.redirect("/addCoupon");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};


    const loadEditCoupon = async (req, res) => {
        try {
            // Fetch coupon details based on the ID, replace with your own logic
            const couponId = req.params.id;
            const coupon = await Coupon.findById(couponId);
    
            if (!coupon) {
                // If the coupon with the given id is not found
                return res.status(404).send("Coupon not found");
            }
    
            // Render the editCoupon page with the coupon details
            res.render("editCoupon", { coupon });
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    };


    const editCoupon = async (req, res) => {
        try {
            const { couponid, couponcode, couponDescription, Discount, MaximumAmount, couponexpiry } = req.body;

            // Find the existing coupon by ID
            const existingCoupon = await Coupon.findById(couponid);
    
            if (!existingCoupon) {
                // If the coupon with the given id is not found
                return res.status(404).send("Coupon not found");
            }
    
            // Update the coupon details
            existingCoupon.couponCode = couponcode;
            existingCoupon.couponDescription = couponDescription;
            existingCoupon.discountPercentage = Discount;
            existingCoupon.maxDiscountAmount = MaximumAmount;
            existingCoupon.couponexpiry = couponexpiry;
    
            // Save the updated coupon
            await existingCoupon.save();
    
            // Redirect to the addCoupen page or any other page as needed
            res.redirect("/addCoupen");
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    };





const deleteCoupon = async (req, res) => {
    try {
        const couponId = req.params.id; // Assuming the coupon id is passed as a parameter in the URL

        // Use findOneAndDelete to find the coupon by its id and delete it
        const deletedCoupon = await Coupon.findOneAndDelete({ _id: couponId });

        if (!deletedCoupon) {
            // If the coupon with the given id is not found
            return res.status(404).send("Coupon not found");
        }

        // Redirect or respond as needed
        res.redirect("/addCoupon"); // Redirect to the coupon list page, adjust the route as needed
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};







module.exports={
    loadCoupenPage,
    createCoupon,
    loadEditCoupon,
    editCoupon,
    deleteCoupon,
    createCoupon,
} 