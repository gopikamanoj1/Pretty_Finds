const Order=require("../model/orderModel");





const LoadSalesReport = async (req, res) => {
    try {
        const orders = await Order.find().populate('user');


        res.render("salesReport", { orders: orders });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};



const LoadDailyReport = async (req, res) => {
    try {
        const orders = await Order.find({
            createdAt: {
                $gte: new Date(new Date().setHours(0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59))
            }
        }).populate('user');


        res.render("salesReport", { orders: orders, timeframe: 'daily' });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};



const loadWeeklyReport = async (req, res) => {
    try {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Set to the first day of the week

        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // Set to the last day of the week

        // Fetch all orders
        const orders = await Order.find().populate('user');

        // Fetch orders for the current week
        const weeklyOrders = await Order.find({
            createdAt: { $gte: startOfWeek, $lte: endOfWeek }
        }).populate('user');

        res.render('salesReport', { weeklyOrders, orders:orders });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};


const loadYearlyReport = async (req, res) => {
    try {
        // Fetch all orders for the current year
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1); // Set to the first day of the year
        const endOfYear = new Date(today.getFullYear() + 1, 0, 0); // Set to the last day of the year

        const yearlyOrders = await Order.find({
            createdAt: { $gte: startOfYear, $lte: endOfYear }
        }).populate('user');

        // Fetch all orders
        const orders = await Order.find().populate('user');

        res.render('salesReport', { yearlyOrders, orders:orders });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
 


const OrdersByDate = async (req, res) => {
    try {
        // Retrieve date range from request body, assuming the form submits data using POST method
        const { orderFrom, orderTo } = req.body;
        console.log(req.body,"req.body");

        // Fetch orders by date range
        const orders = await Order.find({
            createdAt: { $gte: new Date(orderFrom), $lte: new Date(orderTo) }
        }).populate('user');

        res.render('salesReport', {  orders:orders, orderFrom, orderTo });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};



const changeStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const newStatus = req.body.status;

        // Check if the new status is "Delivered" and update delivered_date
        const updateData = (newStatus === "Delivered")
            ? { delivered_date: Date.now(), status: newStatus }
            : { status: newStatus };

        // Use findByIdAndUpdate to update the order
        const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

       

        res.redirect("/ordersDetails");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = OrdersByDate;



module.exports={
    LoadSalesReport,
    LoadDailyReport,
    loadWeeklyReport,
    loadYearlyReport,
    OrdersByDate,
    changeStatus
}