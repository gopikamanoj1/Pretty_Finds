const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controller/adminController');
const adminCategoryControll= require('../controller/adminCategoryControll')
const adminUserControll= require('../controller/adminUserController')
const adminProductControll= require('../controller/adminProductController')
const adminOrderController=require("../controller/adminOrderController")
const adminSalesController=require("../controller/adminSalesController")
const adminCouponController=require("../controller/adminCouponController")
const adminBannerController=require("../controller/bannerController")

const bodyParser=require("body-parser")
const path=require("path")
const session=require("express-session")
adminRouter.use(express.static("public"))
const adminAuth = require("../middleware/adminAuth"); // Assuming you have defined this middleware

const admin=require("../config/config")

adminRouter.use(session({
    secret: admin.adminSession,
    resave: false,
    saveUninitialized: true,
}));


adminRouter.get('/admin',adminAuth.isLogout,adminController.adminLoad)
adminRouter.post('/adminlogin',adminController.adminlogin)
adminRouter.get('/admindashboard',adminAuth.isLogin,adminController.loadDashboard);
adminRouter.get("/logout",adminController.adminLogout)

//** category ** //
adminRouter.get('/page-categories',adminAuth.isLogin,adminCategoryControll.loadcategorypage)
//add category
adminRouter.get("/addcategory",adminCategoryControll.loadAddCategory)
adminRouter.post('/addcategory',adminCategoryControll.addcategory)

//**  edit category ** //
adminRouter.get('/loadeditcategory/:id',adminCategoryControll.loadEditCategory)
adminRouter.post('/loadeditcategory/:id',adminCategoryControll.editCategory)

//** delete category ** //
adminRouter.get('/deletecategory/:id',adminCategoryControll.deleteCategory);
// adminRouter.post('/deletecategory',adminCategoryControll.displayCategory);

//**  products ** //
adminRouter.get('/loadaddproduct',adminProductControll.loadAddProductPage)
adminRouter.post('/loadaddproduct',adminProductControll.addProduct);
adminRouter.get('/page-product-list',adminProductControll.loadProductList);
adminRouter.post('/updateProductStatus/:id',adminProductControll.updateProductStatus)

//** delete products ** //
adminRouter.get('/deleteProduct/:id',adminProductControll.deleteProduct)

//** edit products ** //
adminRouter.get('/editProduct/:id',adminProductControll.editProduct)
adminRouter.post('/editProduct/:id',adminProductControll.editProduct)

//** user **//
// adminRouter.get('/page-user-list',adminUserControll.loadUserList)
adminRouter.get('/page-user-list',adminAuth.isLogin,adminUserControll.displayUserlist)
adminRouter.get('/page-user-detail/:id',adminUserControll.UserDETAILS)
adminRouter.get('/block-user/:id',adminUserControll.blockUser)
adminRouter.post('/block-user/:id',adminUserControll.blockUser)
adminRouter.post("/unblock/:id",adminUserControll.unblockUser )
// admin_route.post("/search",auth.isLogin,adminController.searchUser)
//order
adminRouter.get('/pageOrders',adminOrderController.loadPageOrder)
//order details
adminRouter.get("/page-orderDetails/:id",adminOrderController.loadOrderDetails)
//filter
adminRouter.post("/admin/fetchData/:time",adminAuth.isLogin,adminController.fetchDataGraph)
//sales report
adminRouter.get("/salesReport",adminSalesController.LoadSalesReport)
//daily
adminRouter.get("/dailyOrder",adminSalesController.LoadDailyReport)
//weekly
adminRouter.get("/weeklyOrder",adminSalesController.loadWeeklyReport)
//yearly
adminRouter.get("/yearlyOrder",adminSalesController.loadYearlyReport);
//date
adminRouter.post("/updateOrdersByDate",adminSalesController.OrdersByDate)
//change status
adminRouter.post("/changeStatus", adminSalesController.changeStatus);
//filterByStatus
adminRouter.get("/filterByStatus",adminSalesController.filterByStatus)
//addCoupen
adminRouter.get("/addCoupon",adminCouponController.loadCoupenPage)
adminRouter.post("/addCoupon",adminCouponController.createCoupon)
//edit coupon 
adminRouter.get("/editCoupon/:id",adminCouponController.loadEditCoupon)
 adminRouter.post("/editCoupon",adminCouponController.editCoupon)

//delete coupon 
adminRouter.get("/deleteCoupon/:id",adminCouponController.deleteCoupon)
//apply Coupon
// adminRouter.get("/addCoupon",adminCouponController.createCoupon)
//banners
adminRouter.get("/banners",adminBannerController.loadBanners)
adminRouter.get('/addBanners',adminBannerController.loadAddBanners)
adminRouter.post('/addBanner',adminBannerController.addBanners)



module.exports = adminRouter;
