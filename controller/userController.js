const User = require("../model/userModel")
const AdminProduct = require("../model/productModel");
const AdminCategory = require("../model/categoryModel");
const Order = require("../model/orderModel");
const randomstring = require('randomstring');
var nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
// const { log } = require("util");
const Cart = require("../model/cartModel")
const Razorpay = require('razorpay');
const { makeRazorpayPayment } = require("../utils/razorypay");
const razorpay = new Razorpay({
    key_id: 'rzp_test_tNMVjP0jtH4ZlP',
    key_secret: '4MoJ10O8fIWCAhLIpd',
});


const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (err) {
        console.log(err.message)
    }
}

const landing = async (req, res) => {
    try {
        const products = await AdminProduct.find().limit(8);
        return res.render('index-3', { products: products });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};



const login = async (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.render("page-login");
    }

    catch (err) {
        console.log(err.message);
    }
}


const register = async (req, res) => {
    try {
        return res.status(200).render('page-register')
    } catch (error) {
        console.log(error);
    }
}

const verifyUser = async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password); // Compare the hashed password
            if (passwordMatch) {
                const products = await AdminProduct.find().limit(8)
                req.session.user_id = userData._id;
                console.log("User logged in successfully.");
                return res.render("index-3", { logged: 'user logged   ', products: products });
            } else {
                return res.render("page-login", { message: "Invalid USERNAME or PASSWORD!" });
            }
        } else {
            return res.render("page-login", { message: "Invalid USERNAME or PASSWORD!" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
};



const insertUser = async (req, res) => {
    try {
        const checkEmail = await User.findOne({ email: req.body.email });
        if (checkEmail) {
            res.render("page-register", { message: "Email already exists. Try again" });
        } else {


            if (userData) {
                res.redirect("/home")
            } else {
                res.render("registration", { message: "failed" });
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}


var otp
const userRegister = async (req, res) => {
    try {
        const checkEmail = await User.findOne({ email: req.body.email });
        if (checkEmail) {
            // Email already exists, display validation message
            return res.render("page-register", { message: "Email already exists. Try again" });
        } else {
            otp = randomstring.generate({
                length: 6,
                charset: 'numeric'
            });

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "muhzinsidhiq333@gmail.com",
                    pass: "iiue xtwn lkkf jfps",
                },
            });

            const mailOptions = {
                from: 'muhzinsidhiq333@gmail.com',
                to: req.body.email,
                subject: 'OTP Verification',
                text: `Your OTP code is: ${otp}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Email send error: ' + error);
                    return res.status(500).json({ error: 'Failed to send OTP' });
                } else {
                    console.log('Email sent: ' + info.response);
                    // Redirect to the OTP verification page
                    return res.status(200).redirect('/page-verify-otp');
                }
            });

            // Rest of your code for user registration
            req.session.userData = userData;
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server Error");
    }
};




//HOME
const loadhome = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        const products = await AdminProduct.find()

        if (userData) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.render('index-3', { user: userData, logged: 'user logged   ', products: products });
        } else {
            res.redirect("/");
        }

    } catch (err) {
        console.log(err.message);
    }
}

const userLogout = async (req, res) => {
    try {
        req.session.destroy();
        return res.redirect("/index-3")
    } catch (error) {
        console.log(error.message)
    }
}




const loadverifyUserOTP = async (req, res) => {
    try {
        if (req.session.user_id) {
            res.redirect('/index-3');
        } else {
            // Calculate the remaining time in seconds (adjust the value as needed)
            const remainingTimeInSeconds = 60; // Change this value based on your requirements

            // Render the "page-verify-otp" view with the remaining time
            res.render('page-verify-otp', { remainingTime: remainingTimeInSeconds });
        }
    } catch (error) {
        console.log(error);
    }
};




const verificationOtp = async (req, res) => {
    try {
        const enteredOTP = req.body.otp;

        // Check if the entered OTP matches the one passed as a parameter
        if (enteredOTP === otp || enteredOTP === rotp) {
            // Ensure that userData is defined in req.session
            const userData = req.session.userData;

            const user = new User({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                is_admin: userData.is_admin,
                // Add other properties as needed
            });

            await user.save();

            return res.render('success-login', { logged: 'user logged   ' });

        } else {
            // Invalid OTP
            res.render('page-verify-otp', { message: "invalid OTP" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};



var rotp
const resendOTP = async (req, res) => {
    try {
        // Generate a new OTP (same code you used during registration)
        rotp = randomstring.generate({
            length: 6,
            charset: 'numeric'
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "muhzinsidhiq333@gmail.com",
                pass: "iiue xtwn lkkf jfps",
            }
        });

        const mailOptions = {
            from: 'muhzinsidhiq333@gmail.com',
            to: req.session.userData.email, // Use the email from the user's session
            subject: 'Resend OTP Verification',
            text: `Your new OTP code is: ${rotp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Email send error: ' + error);
                res.status(500).json({ error: 'Failed to send OTP' });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).redirect('/page-verify-otp');
            }
        });



    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    resendOTP,
};

const success = async (req, res) => {
    try {
        return res.status(200).render('success-login')
    } catch (error) {
        console.log(error);
    }
}

const loadSingleProductPage = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await AdminProduct.findById(id).populate('category'); // Populate the 'category' field

        res.render('single-product-page', { product });
    } catch (error) {
        console.log(error);
    }
}

const loadLipsCare = async (req, res) => {
    try {
        // Find the 'lips care' category by its name
        const lipsCareCategory = await AdminCategory.findOne({ _id: '6542743d9867a953f1762ac9' });

        if (!lipsCareCategory) {
            return res.status(404).send("Lips Care category not found");
        }

        // Get the sort parameter from the query string
        const sortBy = req.query.sortBy || 'featured';

        // Define the sort criteria based on the sortBy parameter
        let sortCriteria;
        if (sortBy === 'lowToHigh') {
            sortCriteria = { price: 1 }; // Ascending order
        } else if (sortBy === 'highToLow') {
            sortCriteria = { price: -1 }; // Descending order
        } else {
            // Default to sorting by 'featured' or any other default criteria
            sortCriteria = { /* your default sorting criteria */ };
        }

        // Find products that belong to the 'lips care' category using its ObjectId and apply sorting
        const lipsCareProducts = await AdminProduct.find({ category: lipsCareCategory._id }).sort(sortCriteria);

        if (lipsCareProducts.length === 0) {
            return res.status(404).send("Lips Care products not found");
        }

        // Render the 'lipscare' EJS template and pass the products and sortBy as variables
        res.render('lipscare', { products: lipsCareProducts, sortBy: sortBy });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};



const loadFaceCare = async (req, res) => {
    try {
        // Find the 'face care' category by its name
        const faceCareCategory = await AdminCategory.findOne({_id: '653bd88ad77542c16cd64b13' });
        console.log(faceCareCategory, "gpoooo");
        if (!faceCareCategory) {
            return res.status(404).send("Face Care category not found");
        }
        
        // Get the sort parameter from the query string
        const sortBy = req.query.sortBy || 'featured';

        // Define the sort criteria based on the sortBy parameter
        let sortCriteria;
        if (sortBy === 'lowToHigh') {
            sortCriteria = { price: 1 }; // Ascending order
        } else if (sortBy === 'highToLow') {
            sortCriteria = { price: -1 }; // Descending order
        } else {
            // Default to sorting by 'featured' or any other default criteria
            sortCriteria = { /* your default sorting criteria */ };
        }
        // Find products that belong to the 'face care' category using its ObjectId
        const faceCareProducts = await AdminProduct.find({ category: faceCareCategory._id }).sort(sortCriteria);

        if (faceCareProducts.length === 0) {
            return res.status(404).send("Face Care products not found");
        }

        // Render the 'facecare' EJS template and pass the products as a variable
        res.render('facecare', { products: faceCareProducts, sortBy: sortBy  });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}


const loadBodyCare = async (req, res) => {
    try {
        // Find the 'body care' category by its name
        const bodyCareCategory = await AdminCategory.findOne({ _id: "653b5d46daca97646f21abac" });

        // Get the sort parameter from the query string
        const sortBy = req.query.sortBy || 'featured';

        // Define the sort criteria based on the sortBy parameter
        let sortCriteria;
        if (sortBy === 'lowToHigh') {
            sortCriteria = { price: 1 }; // Ascending order
        } else if (sortBy === 'highToLow') {
            sortCriteria = { price: -1 }; // Descending order
        } else {
            // Default to sorting by 'featured' or any other default criteria
            sortCriteria = { /* your default sorting criteria */ };
        }

        // Find products that belong to the 'body care' category using its ObjectId and apply sorting
        const bodyCareProducts = await AdminProduct.find({ category: bodyCareCategory._id }).sort(sortCriteria);

        if (bodyCareProducts.length === 0) {
            return res.status(404).send("Body Care products not found");
        }

        // Render the 'bodycare' EJS template and pass the products and sortBy as variables
        res.render('bodycare', { products: bodyCareProducts, sortBy: sortBy });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};


const loadHairCare = async (req, res) => {
    try {
        // Find the 'hair care' category by its name
        const hairCareCategory = await AdminCategory.findOne({ _id: '653b59fd3bebb46642473acf' });

        if (!hairCareCategory) {
            return res.status(404).send("Hair Care category not found");
        }

        // Get the sort parameter from the query string
        const sortBy = req.query.sortBy || 'featured';

        // Define the sort criteria based on the sortBy parameter
        let sortCriteria;
        if (sortBy === 'lowToHigh') {
            sortCriteria = { price: 1 }; // Ascending order
        } else if (sortBy === 'highToLow') {
            sortCriteria = { price: -1 }; // Descending order
        } else {
            // Default to sorting by 'featured' or any other default criteria
            sortCriteria = { /* your default sorting criteria */ };
        }

        // Find products that belong to the 'hair care' category using its ObjectId and apply sorting
        const hairCareProducts = await AdminProduct.find({ category: hairCareCategory._id }).sort(sortCriteria);

        if (hairCareProducts.length === 0) {
            return res.status(404).send("Hair Care products not found");
        }

        // Render the 'haircare' EJS template and pass the products and sortBy as variables
        res.render('haircare', { products: hairCareProducts, sortBy: sortBy });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

const loadAllProducts = async (req, res) => {
    try {
        // Get the sort parameter from the query string
        const sortBy = req.query.sortBy || 'featured';

        // Define the sort criteria based on the sortBy parameter
        let sortCriteria;
        if (sortBy === 'lowToHigh') {
            sortCriteria = { price: 1 }; // Ascending order
        } else if (sortBy === 'highToLow') {
            sortCriteria = { price: -1 }; // Descending order
        } else {
            // Default to sorting by 'featured' or any other default criteria
            sortCriteria = { /* your default sorting criteria */ };
        }

        // Fetch products from the database and apply sorting
        const products = await AdminProduct.find().sort(sortCriteria);

        // Render the view with the sorted products
        return res.render("allProducts", { products: products, sortBy: sortBy });

    } catch (error) {
        console.log(error);
        // Handle the error appropriately
        return res.status(500).send('Internal Server Error');
    }
};




const addAddress = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const userData = await User.findById(userId);

        if (userData) {
            const { name, street, city, state, phone, pincode } = req.body;

            const newAddress = {
                name,
                street,
                city,
                state,
                phone,
                pincode,
            };

            userData.addresses.push(newAddress);

            await userData.save();

            // Fetch user orders
            const userOrders = await Order.find({ user: userId });

            // Pass the addresses and orders arrays to the 'user-account' template.
            res.render('myAddress', { user: userData, addresses: userData.addresses, orders: userOrders });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


const loadMyProfile = async (req, res) => {
    try {
        const userId = req.session.user_id;

        // Fetch user data
        const userData = await User.findById(userId);

        // Fetch user orders
        const userOrders = await Order.find({ user: userId });

        if (userData) {
            res.render('user-account', { user: userData, addresses: userData.addresses, orders: userOrders });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};





const loadEditProfile = async (req, res) => {
    try {
        const userId = req.session.user_id; // Assuming req.session.user_id contains a valid ObjectId
        const userData = await User.findById(userId);

        if (userData) {
            res.render('edit-profile', { user: userData });
        }
    } catch (error) {
        console.log(error);
    }
}

const editProfile = async (req, res) => {
    try {
        const id = req.query.id; // or req.body.id if passed as a form field
        const name = req.body.name; // assuming name is passed in the request body
        // Update the user's name
        await User.findByIdAndUpdate(id, { name });

        res.redirect('/myprofile')
    } catch (error) {
        console.log(error);
    }
};

const loadEditAddress = async (req, res) => {
    try {
        const addressId = req.params.id;
        const user = await User.findOne({ "addresses._id": addressId });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const address = user.addresses.find((a) => a._id.toString() === addressId);
        console.log(address, "address");


        res.render("editAddress", { addresses: address });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};






const editAddress = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const addressId = req.params.id;
        const { name, street, city, state, pincode } = req.body;

        // Use the positional operator to update the specific address within the array
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId, "addresses._id": addressId },
            {
                $set: {
                    "addresses.$.name": name,
                    "addresses.$.street": street,
                    "addresses.$.city": city,
                    "addresses.$.state": state,
                    "addresses.$.pincode": pincode,
                },
            },
            { new: true } // Return the updated document
        );



        // Redirect back to the user account page or any other desired page
        res.redirect('/loadmyaddress');
    } catch (error) {
        console.error(error);
        // Handle errors appropriately, e.g., render an error page or provide an error response
        res.status(500).send("Internal Server Error");
    }
};


const loadmyAddress = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await User.findById(userId);

        if (user) {
            res.render("myAddress", { addresses: user.addresses });
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}



const deleteAddress = async (req, res) => {
    try {
        const addressId = req.params.id;

        // Assuming you have an Address model, you should use it to find and delete the address by its ID.
        const user = await User.findOne({ "addresses._id": addressId });

        if (!user) {
            // Handle the case when the user is not found
            return res.status(404).send("User not found");
        }

        const addressIndex = user.addresses.findIndex((address) => address._id.toString() === addressId);
        if (addressIndex === -1) {
            // Handle the case when the address is not found
            return res.status(404).send("Address not found");
        }

        // Remove the address from the user's addresses array
        user.addresses.splice(addressIndex, 1);

        // Save the updated user document
        await user.save();

        res.redirect('/loadmyaddress'); // Redirect back to the user account page or any other desired page after deleting.
    } catch (error) {
        console.error(error);
        // Handle errors appropriately, e.g., render an error page or provide an error response
        res.status(500).send("Internal Server Error");
    }
};


const loadEnterEmail = async (req, res) => {
    try {
        res.render("email-reset-otp")
    } catch (error) {
        console.log(error);
    }
}

var otp
const loadEnterOtp = async (req, res) => {
    try {
        const email = req.body.email;

        // Generate a random OTP
        otp = randomstring.generate({
            length: 4, // Adjust the length as needed
            charset: 'numeric', // Generate a numeric OTP
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'muhzinsidhiq333@gmail.com', // Your Gmail address
                pass: 'iiue xtwn lkkf jfps', // Your Gmail password or an app-specific password
            },
        });

        // Create email data
        const mailOptions = {
            from: 'muhzinsidhiq333@gmail.com', // Your Gmail address
            to: email, // User's email
            subject: 'OTP Verification',
            text: `Your OTP code is: ${otp}`,
        };

        // Send the email with OTP
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email send error: ' + error);
                res.status(500).json({ error: 'Failed to send OTP' });
            } else {
                console.log('Email sent: ' + info.response);
                res.render("enterOTP")
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const loadForgottPassword = async (req, res) => {
    try {
        const enteredOTP = req.body.otp;

        // Check if the entered OTP matches the one generated
        if (enteredOTP === otp || enteredOTP === rotp) {

            res.render('forgott-password');
        } else {
            res.render("enterOTP", { message: "please check the OTP" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



const resetPassword = async (req, res) => {
    try {
        const newPassword = req.body.password;

        const passwordHash = await securePassword(newPassword);
        const userEmail = req.body.email; // Assuming the user provides their email
        console.log(userEmail, "123");
        const result = await User.updateOne({ email: userEmail }, { $set: { password: passwordHash } });

        console.log(result, "vvv");

        const successMessage = 'Password reset successful.'
        res.render('forgott-password', { successMessage });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating user information" });
    }
};


const loadAddToCart = async (req, res) => {
    try {
        let userId = req.session.user_id;
        const userdata = await User.findById(userId);

        // Check if the user is not logged in
        if (!userdata) {
            // Redirect to the login page
            return res.redirect('/page-login');
        }

        let cart = await Cart.findOne({ user: userId }).populate("products.productId");
        let products = cart?.products;

        // Check if the cart is empty
        const isCartEmpty = !products || products.length === 0;

        // Calculate the total cart amount
        const totalAmount = calculateCartTotal(products).toFixed(2);

        res.render("cart-page", { products, userdata, cart, isCartEmpty, totalAmount });
    } catch (error) {
        console.log(error);
        // Handle other errors as needed
        res.status(500).send("Internal Server Error");
    }
};




const AddToCart = async (req, res) => {
    try {
        const userId = req.session.user_id;

        const productId = req.params.id;
        let userCart = await Cart.findOne({ user: userId });
        if (!userCart) {
            // If the user's cart doesn't exist, create a new cart
            let discount = 0
            const newCart = new Cart({ user: userId, products: [], });
            await newCart.save();
            userCart = newCart;
        }

        const productIndex = userCart?.products.findIndex(
            (product) => product.productId == productId
        );
        if (productIndex === -1) {
            // If the product is not in the cart, add it
            userCart.products.push({ productId, quantity: 1 });
        } else {
            // If the product is already in the cart, increase its quantity by 1
            userCart.products[productIndex].quantity += 1;
        }

        await userCart.save();
        res.redirect('/cart');
    } catch (error) {
        console.log(error);
    }
}



// const updateQuantity = async (req, res) => {
//     try {
//         const { userId, productId, count } = req.body;

//         const customer = await User.findById(userId);
//         if (!customer) {
//             return res.status(404).send("User not found.");
//         }

//         const cart = await Cart.findOne({ user: userId });
//         if (!cart) {
//             return res.status(404).send("Cart not found.");
//         }

//         const prdt = cart.products.find(product => product.productId.toString() === productId.toString());
//         if (!prdt) {
//             return res.status(404).send("Product not found in the cart.");
//         }

//         prdt.quantity += count;

//         await cart.save();

//         // Assuming you want to update the total or perform other calculations
//         // const products = await AdminProduct.findById(productId);
//         // Update the cart total or perform other calculations if needed

//         res.json({
//             updatedQuantity: prdt.quantity,
//             productValue: prdt.subTotal, // Adjust this based on your model structure
//             cartTotal: cart.CartTotal, // Assuming you have CartTotal in your Cart model
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Internal Server Error');
//     }
// };



const removeProduct = async (req, res) => {
    try {
        const userId = req.session.user_id; // Check the actual structure of req.user
        const productId = req.body.productId;

        // Find the user's cart
        const userCart = await Cart.findOne({ user: userId });

        // If the user has a cart
        if (userCart) {
            // Remove the product from the cart's products array
            userCart.products = userCart.products.filter(product => product.productId.toString() !== productId);

            await userCart.save();

            return res.redirect('/cart');
        } else {
            return res.status(404).send("User does not have a cart");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const loadCheckOut = async (req, res) => {
    try {
        const user_id = req.session.user_id;
        const user = await User.findById({ _id: user_id });

        const addresses = user.addresses;

        // Assuming you have a separate Cart model to store user's cart data
        const cart = await Cart.findOne({ user: user_id }).populate('products.productId');
        // console.log(cart,"cartttttttttt");
        const products = await AdminProduct.find();
        console.log(products, "ff");
        res.render("checkout-page", { addresses: addresses, cart: cart, products: products });
    } catch (error) {
        console.log(error);
    }
};







const calculateCartTotal = (products) => {
    let total = 0;
    products.forEach(product => {
        total += product.quantity * product.productId.price;
    });
    return total;
};

const loadConfirmOrder = async (req, res) => {
    try {
        console.log(req.body)
        const userId = req.session.user_id;
        const selectedAddressId = req.body.addresses;

        // Fetch user's cart
        const cart = await Cart.findOne({ user: userId }).populate('products.productId');
        const cartProducts = Array.isArray(cart.products) ? cart.products : [];

        // Create an order with the products from the cart
        const orderItems = cartProducts.map(product => ({
            product: product.productId,
            quantity: product.quantity,
            price: product.productId.price,
            image: product.productId.image,
        }));

        const order = new Order({
            user: userId,
            items: orderItems,
            total: calculateCartTotal(cartProducts),
            addresses: selectedAddressId,
            paymentType: req.body.payment_option
        });

        await order.save();

        // Update product stock in the database
        for (const item of orderItems) {
            const productId = item.product._id;

            // Find the product by ID
            const product = await AdminProduct.findById(productId);

            if (!product) {
                // Handle the case where the product is not found
                console.error(`Product with ID ${productId} not found.`);
            } else {
                // Decrease stock by the ordered quantity
                product.stock -= item.quantity;

                // Save the updated product
                await product.save();
            }
        }

        // Clear the cart
        await Cart.findOneAndUpdate({ user: userId }, { $set: { products: [] } });

        if (req.body.payment_option === "razorypay") {
            console.log("razorpay payment started");
            makeRazorpayPayment(order._id, order.total).then(async (response) => {
                console.log(response), "resloved";
              const  updatedOrder =  await Order.findOneAndUpdate({_id: order._id}, {$set: {paymentId: response.id}}, {new: true});
              console.log(updatedOrder);
                return res.status(200).json({ status: "razorpay", data: response, order: updatedOrder })
            }).catch((err) => {
                console.log(err, "rejected")
                return res.status(500).json({ status: "false", message: "somthing went wrong" })
            });

        }
        res.status(200).json({status: "success", message: "Order has been place, with cash on delivery", paymentOption: "cod"});
        // res.status(200).send("confirmPage")

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};








const updateQuantitys = async (req, res, next) => {
    const userId = req.session.user_id;
    const cartItemId = req.body.cartItemId;

    try {
        const cart = await Cart.findOne({ user: userId }).populate("products.productId");
        //   const product = await products.findById({ _id: cartItemId });

        const cartIndex = cart.products.findIndex((item) => item.productId.equals(cartItemId));

        if (cartIndex === -1) {
            return res.json({ success: false, message: "Cart item not found." });
        }

        cart.products[cartIndex].quantity += 1;

        const products = cart.products[cartIndex].productId;
        const maxQuantity = products.stock;


        if (cart.products[cartIndex].quantity > maxQuantity) {
            return res.json({
                success: false,
                message: "Maximum quantity reached.",
                maxQuantity
            });
        }

        await cart.save();

        const total = cart.products[cartIndex].quantity * cart.products[cartIndex].productId.price;
        const quantity = cart.products[cartIndex].quantity;

        console.log(total, quantity, "pppp");

        res.json({
            success: true,
            message: "Quantity updated successfully.",
            total: parseInt(total),
            quantity
        });
    } catch (error) {
        res.json({ success: false, message: "Failed to update quantity." });
    }
};


const decrementQuantity = async (req, res, next) => {
    const userId = req.session.user_id;
    const cartItemId = req.body.cartItemId;

    //    const product=await product_model.findById({_id:cartItemId})
    try {
        const cart = await Cart.findOne({ user: userId }).populate("products.productId")
        const cartIndex = cart.products.findIndex((item) => item.productId.equals(cartItemId));

        if (cartIndex === -1) {
            return res.json({ success: false, message: "Cart item not found." });
        }

        cart.products[cartIndex].quantity -= 1;
        await cart.save();

        console.log(cart, "uuuu");
        const total = cart.products[cartIndex].quantity * cart.products[cartIndex].productId.price;
        const quantity = cart.products[cartIndex].quantity;



        res.json({
            success: true,
            message: "Quantity updated successfully.",
            total,
            quantity,
        });
    } catch (error) {
        res.json({ success: false, message: "Failed to update quantity." });
    }
}


const searchProducts = async (req, res) => {
    try {
        const searchTerm = req.query.q; // Assuming the search query is passed as a query parameter 'q'

        // Perform a case-insensitive search for products with names that match the search term
        const products = await AdminProduct.find({ name: { $regex: new RegExp(searchTerm, 'i') } });

        // Render the search results in the 'search-results' view
        return res.render('search-results', { products: products, searchTerm: searchTerm });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

const orderDetails = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        const user = await User.findById(userId);

        if (order) {
            res.render("orderDetails", { order: order, user: user });
        }
    } catch (error) {
        console.log(error);
    }
};

const loadOrder = async (req, res) => {
    try {
        // Assuming you fetch the orders from the database here, adjust as needed
        const orders = await Order.find({ user: req.session.user_id });

        res.render("ordersList", { orders: orders });
    } catch (error) {
        console.log(error);
        // Handle errors appropriately, e.g., render an error page or provide an error response  
        res.status(500).send("Internal Server Error");
    }
};

const cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const cancelReason = req.body.cancelReason;

        // Fetch the order by ID
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the order is already canceled
        if (order.status === 'Cancel') {
            return res.status(400).json({ message: 'Order is already canceled' });
        }

        // Update order status to 'Cancel'
        order.status = 'Cancel';

        // Save the cancellation reason
        order.reasonForCancel = cancelReason;

        // Save the updated order
        await order.save();

        // Iterate through order items and increase the product stock
        for (const item of order.items) {
            const productId = item.product;
            const quantity = item.quantity;

            // Fetch the product by ID
            const product = await AdminProduct.findById(productId);

            if (product) {
                // Increase the stock by the canceled quantity
                product.stock += quantity;

                // Save the updated product
                await product.save();
            }
        }

        // Send a JSON response with the success message
        res.status(200).json({ message: 'Order Cancelled!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const loadRazorpay = async (req, res) => {
    try {
        // Implement logic to create a Razorpay order
        const options = {
            amount: 50000, // Amount in paise (e.g., 50000 paise = ₹500)
            currency: 'INR',
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const handleVerifyPayment = async (req, res) =>{
    try {
        console.log(req.body)
        const order = await Order.findOneAndUpdate({paymentId: req.body?.order?.id}, {$set: {paymentStatus: "complete"}}, {new: true});
        console.log(order);
        res.status(200).json({status: "success", message:"Successfully verified payment..."});

    } catch (error) {
        console.log(error);
        res.status(500).send({error: "Internal Server Error"})
    }
}

const loadConfirmPage = async (req, res) =>{
    try {
        console.log("got to confirm page")
        res.render("confirmPage");
    } catch (error) {
        res.status(500).json({error: "Somthing went wrong..."})
    }
}





module.exports = {
    landing,
    login,
    register,
    userRegister,
    insertUser,
    loadhome,
    verifyUser,
    userLogout,
    loadverifyUserOTP,
    verificationOtp,
    success,
    loadSingleProductPage,
    loadLipsCare,
    loadFaceCare,
    loadBodyCare,
    loadHairCare,
    loadAllProducts,
    loadMyProfile,
    loadEditProfile,
    editProfile,
    loadmyAddress,
    addAddress,
    deleteAddress,
    loadEditAddress,
    editAddress,
    resendOTP,
    loadEnterEmail,
    loadEnterOtp,
    loadForgottPassword,
    resetPassword,
    loadCheckOut,
    loadConfirmOrder,
    loadAddToCart,
    AddToCart,
    removeProduct,
    updateQuantitys,
    decrementQuantity,
    searchProducts,
    loadOrder,
    orderDetails,
    cancelOrder,
    loadRazorpay,
    handleVerifyPayment,
    loadConfirmPage,







}