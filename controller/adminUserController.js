const userModel = require("../model/userModel");
const adminModel = require("../model/adminModel");
const OrderModel= require("../model/orderModel");

const bcrypt = require("bcrypt");


const loadUserList = async (req, res) => {
    try {
        return res.render('page-user-list')
    } catch (error) {
        console.log(error);
    }
}

const UserDETAILS = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Fetch user orders (replace 'orders' with your actual orders schema)
        const orders = await OrderModel.find({ user: id });

        return res.render('page-user-detail', { user, orders });
    } catch (error) {
        // Handle errors appropriately
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

 

const displayUserlist = async (req, res) => {
    try {
        const users = await userModel.find();
        // console.log(users,"555555555");
        res.render('page-user-list', { users, data: 'user,...' });
    } catch (error) {
        console.log(error);
    } 
}

const blockUser = async (req, res) => {
    try {
        const { id } = req.params

        // Update the user document with the provided id
        await userModel.updateOne({ _id: id }, { $set: { isBlocked: true } });

        res.redirect("/page-user-list");
    } catch (err) {
        console.log(err);
    }
};
const unblockUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Update the user document with the provided id to set isBlocked to false
        await userModel.updateOne({ _id: id }, { $set: { isBlocked: false } });

        res.redirect("/page-user-list");
    } catch (err) {
        console.log(err);
     }
};


const searchUser = async (req, res) => {
    try {

        const searchCriteria = req.body.searchCriteria;
        const users = await User.find({
            $and: [
                { name: { $regex: `^${searchCriteria}`, $options: 'i' } }, // Starts with 'a' search
                { name: { $not: { $eq: 'User' } } } // Exclude records where name is 'admin' (case-insensitive)
            ]
        });

        res.render('search', { users });

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
}


const deleteUser = async (req, res) => {
    try {
        const id = req.query.id
        await User.deleteOne({ _id: id })
        res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error.message);
    }
}










module.exports = {
    loadUserList,
    UserDETAILS,
    displayUserlist,
    searchUser,
    deleteUser,
    blockUser,
    unblockUser,
}