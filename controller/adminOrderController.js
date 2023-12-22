const AdminOrder = require("../model/orderModel");
const User=require ("../model/userModel");
const AdminProduct = require("../model/productModel");










const loadPageOrder = async (req, res) => {
    try {
        // Fetch orders from your database (assuming you have an Order model)
        const orders = await AdminOrder.find({}).populate('user'); // Adjust the query based on your actual schema

        res.render("page-orders-list", { orders:orders });
    } catch (error) {
        console.log(error);
    } 
}; 
 
   
 
const loadOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await AdminOrder.findById(orderId).populate('user').populate('items.product'); // Populate the 'user' and 'items.product' fields
        res.render("ordersDetails", { order:order, orderId });

    } catch (error) {
        console.log(error);
        // Handle other errors as needed
        res.status(500).send('Internal Server Error');
    }
};
















 

module.exports ={
    loadPageOrder,
    loadOrderDetails,

}