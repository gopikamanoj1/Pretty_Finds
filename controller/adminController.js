const Admin = require("../model/adminModel");
const bcrypt = require("bcrypt");
const Product=require("../model/productModel")
const Order=require("../model/orderModel");
const { log } = require("console");
const User=require("../model/userModel");


const securePassword=async(password)=>{
    try{
        const passwordHash=await bcrypt.hash(password,10);
        return passwordHash;
    }catch(err){
        console.log(err.message)
    }
}


const adminLoad=async (req,res)=>{
    try{
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

       res.render('page-account-login')
    
    }catch(err){
        console.log(err.message);
    }
}


const adminlogin =async (req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
    
        const adminData=await Admin.findOne({email:email})
        // console.log(email,password);
        if(adminData){
            const passwordMatch=await bcrypt.compare(password,adminData.password);

            if(passwordMatch){
                if(adminData.is_admin){
                    req.session.admin_id=adminData._id;
                    // req.session.authenticated=true;
                    res.redirect('/admindashboard')
                }else{
                    return res.render("page-account-login",{message:"Invalid  PASSWORD!"})
                }
                
            }else{
                return res.render("page-account-login",{message:"Invalid USERNAME !"})
            }
        }else{
            return res.render("page-account-login",{message:"Invalid USERNAME or PASSWORD!"})
        }
    }catch(err){
        console.log(err.message)
    }
}

const loadDashboard = async (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

        // Fetch the total number of orders
        const totalOrders = await Order.countDocuments();

        // Fetch the total number of products
        const totalProducts = await Product.countDocuments();

        // Calculate the total revenue by summing the total amount of delivered orders
        const totalRevenueResult = await Order.aggregate([
            {
                $match: { status: 'Delivered' } // Add this condition to filter delivered orders
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$total" }
                }
            }
        ]);

        // Extract the total revenue from the result
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalAmount : 0;

        // Replace the following logic with your actual data fetching logic
        const userData = await Admin.find({ is_admin: 0 });

        res.render("index", { users: userData, totalOrders, totalProducts, totalRevenue });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Internal Server Error');
    }
};







const adminLogout=async(req,res)=>{
    try{
        req.session.destroy()
        res.redirect("/admin")
        }catch(err){
        console.log(err.message)
    }
}


const fetchDataGraph = async (req, res) => {
    try {
        const time = req.params.time;

        if (time === 'month') {
            const currentYear = new Date().getFullYear();
            const data = await Order.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                            $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        ordersCount: { $sum: 1 }
                    }
                }
            ]);

            const allMonths = {
                'January': 0,
                'February': 0,
                'March': 0,
                'April': 0,
                'May': 0,
                'June': 0,
                'July': 0,
                'August': 0,
                'September': 0,
                'October': 0,
                'November': 0,
                'December': 0,
            };
            data.forEach(item => {
                const month = new Date(`2023-${item._id}-01`).toLocaleString('default', { month: 'long' });
                
                allMonths[month] = item.ordersCount;
            });
            res.json(allMonths);
        }

        if (time === 'year') {
            const startYear = 2019;
            const endYear = 2024;
            const ordersByYear = {};

            for (let year = startYear; year <= endYear; year++) {
                const data = await Order.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                                $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            ordersCount: { $sum: 1 }
                        }
                    }
                ]);

                const orderCount = data.length > 0 ? data[0].ordersCount : 0;

                ordersByYear[year] = orderCount;
            }

            res.json(ordersByYear);
        }

        if (time === 'week') {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();
            const currentDay = currentDate.getDate();

            const dayOfWeek = currentDate.getDay();

            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            const startDate = new Date(currentYear, currentMonth, currentDay - dayOfWeek);

            const ordersByDayOfWeek = {};

            for (let day = 0; day < 7; day++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + day);

                const data = await Order.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte: new Date(date.setHours(0, 0, 0, 0)),
                                $lt: new Date(date.setHours(23, 59, 59, 999))
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            ordersCount: { $sum: 1 }
                        }
                    }
                ]);

                const orderCount = data.length > 0 ? data[0].ordersCount : 0;

                ordersByDayOfWeek[dayNames[day]] = orderCount;
            }

            res.json(ordersByDayOfWeek);
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while fetching data.");
    }
};







module.exports={
    adminLoad,
    adminlogin,
    loadDashboard,
    adminLogout,
    fetchDataGraph,
   
}