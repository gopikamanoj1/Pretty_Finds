const AdminOrder = require("../model/orderModel");

 const loadPageOrder=async(req,res)=>{
    try {
        res.render("page-orders-list")
    } catch (error) {
        console.log();
    }
 }









module.exports ={
    loadPageOrder
}