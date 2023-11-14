const AdminOrder = require("../model/orderModel");

const loadPageOrder = async (req, res) => {
    try {
        // Fetch orders from your database (assuming you have an Order model)
        const orders = await AdminOrder.find().populate('user'); // Adjust the query based on your actual schema

        res.render("page-orders-list", { orders });
    } catch (error) {
        console.log(error);
    }
};










module.exports ={
    loadPageOrder
}