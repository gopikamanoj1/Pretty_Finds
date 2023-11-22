const Razorpay = require("razorpay");
const { options } = require("../router/userRoute");
require("dotenv").config();


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})



async function makeRazorpayPayment(orderId, totalAmount) {
    console.log(orderId, totalAmount)

    return new Promise((resolve, reject) => {
        const options = {
            amount: `${totalAmount * 100}`,
            currency: "INR",
            receipt: `${orderId}`,
            payment_capture: 1,
        };

        razorpay.orders.create(options, function (err, order) {
            if (err) {
               return reject(err)
            }
            resolve(order);

        })
    })
}



module.exports = {
    makeRazorpayPayment,
}