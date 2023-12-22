const Order=require("../model/orderModel");





const LoadSalesReport = async (req, res) => {
    try {
        // Fetch only delivered orders
        const orders = await Order.find({ status: 'Delivered' }).populate('user');

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
        const orderId = req.body.orderId;
        const newStatus = req.body.status;

        // Update the order status in the database
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: newStatus },
            { new: true } // Return the updated document 
        );

        if (!updatedOrder) {
            // Order not found
            return res.status(404).send('Order not found');
        }

        // Redirect back to the order details page
        res.redirect(`/page-orderDetails/${orderId}`);
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).send('Internal Server Error');
    }
};

const filterByStatus = async (req, res) => {
    try {
        // Fetch the status from the query parameters
        const enterStatus = req.query.status;

        // Check if a specific status is provided
        if (enterStatus && enterStatus !== "") {
            // Fetch orders from the database based on the provided status
            const orders = await Order.find({ status: enterStatus }).populate('user');

            // Render the salesReport template with filtered orders and the status variable
            res.render('page-orders-list', { orders, status: enterStatus });
        } else {
            // If no specific status is provided, fetch all orders
            const allOrders = await Order.find().populate('user');

            // Render the salesReport template with all orders
            res.render('page-orders-list', { orders: allOrders, status: "All Status" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};






 
module.exports={
    LoadSalesReport,
    LoadDailyReport,
    loadWeeklyReport,
    loadYearlyReport,
    OrdersByDate,
    changeStatus,
    filterByStatus

}