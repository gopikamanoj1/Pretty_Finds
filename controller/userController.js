const User = require("../model/userModel")
const AdminProduct = require("../model/productModel");
const AdminCategory = require("../model/categoryModel");
const Order = require("../model/orderModel");
const randomstring = require('randomstring');
var nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
// const { log } = require("util");
const Cart = require("../model/cartModel")

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
        const products = await AdminProduct.find();
        return res.render('index-3', { products: products })

    } catch (error) {
        console.log(error);
    }
}
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
                const products = await AdminProduct.find();
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
            req.session.userData = user;
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
        const products = await AdminProduct.find();

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
        const enteredOTP = await req.body.otp;
        console.log(enteredOTP, "lll"); // Get the OTP entered by the user

        // Check if the entered OTP matches the one passed as a parameter
        if (enteredOTP === otp || rotp) {

            const user = req.session.userData
            console.log(user);
            const user_detail = new User({
                ...user
            })
            await user_detail.save()
            return res.render('success-login', { logged: 'user logged   ' });

        } else {
            // Invalid OTP
            res.render('page-verify-otp', { message: "invalid OTP" });
        }
    } catch (error) {
        console.log(error);
    }
}

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
        const lipsCareCategory = await AdminCategory.findOne({ name: 'lips care' });

        if (!lipsCareCategory) {
            return res.status(404).send("Lips Care category not found");
        }

        // Find products that belong to the 'lips care' category using its ObjectId
        const lipsCareProducts = await AdminProduct.find({ category: lipsCareCategory._id });

        if (lipsCareProducts.length === 0) {
            return res.status(404).send("Lips Care products not found");
        }

        // Render the 'lipscare' EJS template and pass the products as a variable
        res.render('lipscare', { products: lipsCareProducts });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}


const loadFaceCare = async (req, res) => {
    try {
        // Find the 'face care' category by its name
        const faceCareCategory = await AdminCategory.findOne({ name: 'face  care' });
        console.log(faceCareCategory, "gpoooo");
        if (!faceCareCategory) {
            return res.status(404).send("Face Care category not found");
        }

        // Find products that belong to the 'face care' category using its ObjectId
        const faceCareProducts = await AdminProduct.find({ category: faceCareCategory._id });

        if (faceCareProducts.length === 0) {
            return res.status(404).send("Face Care products not found");
        }

        // Render the 'facecare' EJS template and pass the products as a variable
        res.render('facecare', { products: faceCareProducts });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}


const loadBodyCare = async (req, res) => {
    try {
        // Find the 'body care' category by its name
        const bodyCareCategory = await AdminCategory.findOne({ name: 'body care' });
        console.log(bodyCareCategory, "3333");
        if (!bodyCareCategory) {
            return res.status(404).send("Body Care category not found");
        }

        // Find products that belong to the 'body care' category using its ObjectId
        const bodyCareProducts = await AdminProduct.find({ category: bodyCareCategory._id });

        if (bodyCareProducts.length === 0) {
            return res.status(404).send("Body Care products not found");
        }

        // Render the 'bodycare' EJS template and pass the products as a variable
        res.render('bodycare', { products: bodyCareProducts });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

const loadHairCare = async (req, res) => {
    try {
        // Find the 'hair care' category by its name
        const hairCareCategory = await AdminCategory.findOne({ name: 'Hair Care' });

        if (!hairCareCategory) {
            return res.status(404).send("Hair Care category not found");
        }

        // Find products that belong to the 'hair care' category using its ObjectId
        const hairCareProducts = await AdminProduct.find({ category: hairCareCategory._id });

        if (hairCareProducts.length === 0) {
            return res.status(404).send("Hair Care products not found");
        }

        // Render the 'haircare' EJS template and pass the products as a variable
        res.render('haircare', { products: hairCareProducts });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
const loadAllProducts = async (req, res) => {
    try {
        const products = await AdminProduct.find();
        return res.render("allProducts", { products: products })

    } catch (error) {
        console.log(error);
    }
}






const addAddress = async (req, res) => {
    try {
        const userId = req.session.user_id;
        console.log(userId, "rrrrr");
        const userData = await User.findById(userId);
        console.log(userData, "3333");
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

            const addresses = await userData.save();

            // Pass the addresses array to the 'user-account' template.
            res.render('user-account', { user: userData, addresses: userData.addresses });
        }
    } catch (error) {
        console.error(error);
    }
}

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
        console.log(req.params, "ll");
        // Retrieve the address ID from the request
        const addressId = req.params.id;

        // Assuming you have an Address model, use it to find the address by its ID
        const user = await User.findOne({ "addresses._id": addressId });
        console.log(user, "popopo");

        // Find the specific address by iterating through the addresses array
        const address = user.addresses.find((a) => a._id.toString() === addressId);
        console.log(address, "address");

        if (!address) {
            // Handle the case when the address is not found
            return res.status(404).send("Address not found");
        }

        // Render the "editAddress" view with the address data
        res.render("editAddress", { addresses: address });
    } catch (error) {
        console.log(error);
        // Handle errors appropriately, e.g., render an error page or provide an error response
        res.status(500).send("Internal Server Error");
    }
}



const editAddress = async (req, res) => {
    try {
        const addressId = req.params.id;
        const { name, street, city, state, pincode } = req.body;
        console.log(req.body, "tttttttt");

        // Assuming you have an Address model, you should use it to find the address by its ID.
        const address = await User.findOne({ "addresses._id": addressId });
        
        if (!address) {
            // Handle the case when the address is not found
            return res.status(404).send("Address not found");
        }
        // Update the address properties with the new data
        address.name = name;
        address.street = street;
        address.city = city;
        address.state = state;
        address.pincode = pincode;

        // Save the updated address using the .save() method
        await address.save();

        // Redirect back to the user account page or any other desired page
        res.redirect('/myprofile');
    } catch (error) {
        console.error(error);
        // Handle errors appropriately, e.g., render an error page or provide an error response
        res.status(500).send("Internal Server Error");
    }
};
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

        res.redirect('/myprofile'); // Redirect back to the user account page or any other desired page after deleting.
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
        let cart = await Cart.findOne({ user: userId }).populate("products.productId");
        let products = cart?.products;

        // Check if the cart is empty
        const isCartEmpty = !products || products.length === 0;

        res.render("cart-page", { products, userdata, cart, isCartEmpty });
    } catch (error) {
        console.log(error);
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
        const user = await User.findById({_id: user_id});
        
        const addresses = user.addresses;
        
        // Assuming you have a separate Cart model to store user's cart data
        const cart = await Cart.findOne({ user: user_id }).populate('products.productId');
        // console.log(cart,"cartttttttttt");
        const products = await AdminProduct.find();
           console.log(products,"ff");
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
        const userId = req.session.user_id;
        console.log(userId,"userId");
        const selectedAddress = req.body.addresses;

        console.log( req.body,"req.body");
        console.log(selectedAddress,"selectedAddress");
        // Assuming you have a separate Cart model to store user's cart data
        const cart = await Cart.findOne({ user: userId }).populate('products.productId');

        // Create an order with the products from the cart
        const order = new Order({
            user: userId,
            products: cart.products.map(product => ({
                productId: product.productId,
                quantity: product.quantity,
                subTotal: product.quantity * product.productId.price
            })),
            total: calculateCartTotal(cart.products),
            addresses: selectedAddress // Make sure this is the correct field name
        });

        await order.save();

        // Clear the cart
        await Cart.findOneAndUpdate({ user: userId }, { $set: { products: [] } });

        res.render("confirmPage");
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}






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

      console.log(total,quantity,"pppp");
  
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


  const decrementQuantity=async(req,res,next)=>{
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

      console.log(cart,"uuuu");
      const total = cart.products[cartIndex].quantity* cart.products[cartIndex].productId.price;
      const quantity = cart.products[cartIndex].quantity;
     
     
  
      res.json({
        success: true,
        message: "Quantity updated successfully.",
        total,
        quantity,
      });
    } catch (error) {
      res.json({ success: false, message: "Failed to update quantity." });
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
    decrementQuantity





}