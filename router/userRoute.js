const express = require('express');
const userControllers = require('../controller/userController');
const bodyParser=require("body-parser")
const path=require("path")
const session=require("express-session")
const userRouter = express.Router(); // Change 'express()' to 'express.Router()'
const userAuth = require('../middleware/userAuth'); // Adjust the path as needed

userRouter.use(session({
    secret: 'abc123',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24* 7 }
}));


//getting landing page
userRouter.get('/', userControllers.landing);
//getting login  
userRouter.get('/page-login',userAuth.isLogout,userControllers.login);
//getting register
userRouter.get('/page-register',userAuth.isLogout,userControllers.register);

//for user registering
userRouter.post("/page-register",userControllers.userRegister)
//for getting home page
userRouter.get("/home",userAuth.isLogin,userControllers.loadhome)
 
userRouter.post("/home",userControllers.verifyUser);
// userRouter.get('/home',userControllers.loadhome); 
//user logout 
userRouter.get("/index-3",userAuth.isLogin,userControllers.userLogout)

userRouter.get('/page-verify-otp', userControllers.loadverifyUserOTP);
userRouter.post('/page-verify-otp',userControllers.verificationOtp)
userRouter.get('/success-login',userControllers.success)  


//prduct
userRouter.get('/singleProduct/:id', userControllers.loadSingleProductPage);
//lips
userRouter.get('/lipscareonly', userControllers.loadLipsCare);
//face
userRouter.get('/facecareonly', userControllers.loadFaceCare);
//body
userRouter.get('/bodycareonly',userControllers.loadBodyCare)
//hair
userRouter.get('/haircareonly',userControllers.loadHairCare)
//all Products
userRouter.get('/allProducts',userControllers.loadAllProducts)
//user profile
userRouter.get('/myprofile',userControllers.loadMyProfile)
userRouter.get('/editProfile',userControllers.loadEditProfile)
userRouter.post( "/editProfile",userControllers.editProfile)
//add address
userRouter.post('/myprofile',userControllers.addAddress)
//edit address
userRouter.get('/editAddress/:id', userControllers.loadEditAddress);
userRouter.post('/editAddress/:id',userControllers.editAddress)
//delete address
userRouter.get('/deleteAddress/:id',userControllers.deleteAddress); 
//resend otp
userRouter.get('/resendOTP', userControllers.resendOTP);
//forgott password
userRouter.get("/email-reset-otp",userControllers.loadEnterEmail)
userRouter.post("/email-reset-otp",userControllers.loadEnterOtp)
userRouter.post("/forgott-password",userControllers.loadForgottPassword)
userRouter.post("/reset-password",userControllers.resetPassword)
//load cart
userRouter.get("/cart",userControllers.loadAddToCart)
// add to cart
userRouter.post('/addToCart/:id',userControllers.AddToCart)
//remove cartProduct
userRouter.post("/removeProduct",userControllers.removeProduct)
//checkout
userRouter.get("/checkout-page",userControllers.loadCheckOut)
//confirm
userRouter.post("/confirm-order",userControllers.loadConfirmOrder)
//update quntity

userRouter.post("/increaseQuantity",userControllers.updateQuantitys);
userRouter.post("/decreaseQuantity",userControllers.decrementQuantity);


module.exports = userRouter;