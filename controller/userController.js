const User = require("../model/userModel");
const AdminProduct = require("../model/productModel");
const AdminCategory = require("../model/categoryModel");
const Order = require("../model/orderModel");
const randomstring = require("randomstring");
var nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
// const { log } = require("util");
const Cart = require("../model/cartModel");
const Coupon = require("../model/couponModel");
const Wallet = require("../model/walletModel");
const uuid = require("uuid");
const Banners = require("../model/bannerModel");
const Wishlist = require("../model/wishListModel");



const Razorpay = require("razorpay");
const { makeRazorpayPayment } = require("../utils/razorypay");
const razorpay = new Razorpay({
  key_id: "rzp_test_tNMVjP0jtH4ZlP",
  key_secret: "4MoJ10O8fIWCAhLIpd",
});

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (err) {
    res.render("page-404")
    console.log(err.message);
  }
};

const landing = async (req, res) => {
  try {
    const products = await AdminProduct.find().limit(8);
    const banners=await Banners.find()
    return res.render("index-3", { products: products ,banners:banners});
  } catch (error) {
    res.render("page-404")

    console.log(error);   
    res.status(500).send("Internal Server Error");
  }
};
  

// const bannerNavigation =async (req,res)=>{

// }





const login = async (req, res) => {
  try {
    const banners=await Banners.find()

    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.render("page-login",{banners:banners});
  } catch (err) {
    res.render("page-404")

    console.log(err.message);
  }
};

const register = async (req, res) => {
  try {
    const banners=await Banners.find()

    return res.status(200).render("page-register",{banners:banners});
  } catch (error) {
    res.render("page-404")

    console.log(error);
  }
};

const verifyUser = async (req, res) => { 
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email: email });
    const banners=await Banners.find()


    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password); 
      console.log(password, userData.password);
      console.log(passwordMatch,"passwordMatch");
      if(userData.isBlocked===false){
        if (passwordMatch) {
            const products = await AdminProduct.find().limit(8);
    
            const cartCount = await getCartProductCount(req.session.user_id);
    
            req.session.user_id = userData._id;
            console.log("User logged in successfully.");
    
            return res.render("index-3", {
              logged: "user logged   ",
              products: products,
              cartCount: cartCount,
              banners:banners
              
            });
          }else {
            return res.render("page-login", {
              message: "INVALID USERNAME OR PASSWORD!",
            });
          }
        }  
        else {
          return res.render("page-login", {
            message: "User Not Exist",
          });
        }
      }
       
  } catch (err) {
    res.render("page-404")

    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
};










const Swal = require("sweetalert2");
const productModel = require("../model/productModel");



// const userRegister = async (req, res) => {
//     try {
//       const checkEmail = await User.findOne({ email: req.body.email });
  
//       if (checkEmail) {
//         // Email already exists, display validation message
//         return res.render("page-register", {
//           message: "Email already exists. Try again",
//         });
//       } 


//     else {
//         // Check if a referral code is provided
//         const referralCode = req.body.myRefferalCode || "";
  
//         // Validate the referral code if provided
//         if (referralCode !== "") {
//           const isValidReferralCode = await isValidReferralCodeFunction(referralCode);


//           if (!isValidReferralCode) {
//             // Show SweetAlert for an invalid referral code
//             Swal.fire({
//               icon: "error",
//               title: "Invalid Referral Code",
//               text: "The referral code you provided is invalid. Please try again.",
//             });
  
//             return res.render("page-register", {
//               message: "Invalid referral code. Try again",
//             });
//           }
//         }

  
//         otp = randomstring.generate({
//           length: 6,
//           charset: "numeric",
//         });
  
//         const transporter = nodemailer.createTransport({
//           service: "gmail",
//           auth: {
//             user: "muhzinsidhiq333@gmail.com",
//             pass: "iiue xtwn lkkf jfps",
//           },
//         });
  
//         const mailOptions = {
//           from: "muhzinsidhiq333@gmail.com",
//           to: req.body.email,
//           subject: "OTP Verification",
//           text: `Your OTP code is: ${otp}`,
//         };
  
//         transporter.sendMail(mailOptions, (error, info) => {
//           if (error) {
//             console.log("Email send error: " + error);
//             return res.status(500).json({ error: "Failed to send OTP" });
//           } else {
//             console.log("Email sent: " + info.response);
//             // Redirect to the OTP verification page
//             return res.status(200).redirect("/page-verify-otp");
//           }
//         });
  
//         const randomReferralCode = generateRandomReferralCode();
  
//         // Update the user's information with the generated referral code
//         // await User.findOneAndUpdate( 
//         //   { email: req.body.email },
//         //   { $set: { myRefferalCode: randomReferralCode } },
//         //   { new: true }
//         // );
//         console.log(randomReferralCode,"randomReferralCoderandomReferralCode");

//         const sPassword = await securePassword(req.body.password);
  
//         const userData = {
//           username: req.body.username,
//           email: req.body.email,
//           password: sPassword,
//           // other user data...  
//           myRefferalCode: randomReferralCode, // Assuming you want to save it as user_referral_code too
//         };
  
//     console.log(userData,"userDatauserData||||||||||||||||||");
  
//         req.session.userData = userData;


//         const referralCodeOwner = await User.findOne({ myRefferalCode: referralCode });
//          const user_id=referralCodeOwner._id
//         //  console.log(user_id,"usereeeee ");
//         // console.log(referralCodeOwner,"referralCodeOwnerppppppppppppppppppppp");
//         const wallet=await Wallet.findOne({userId:user_id })
//             // console.log(wallet,"wallettttttttttttttttttttttttttttttttttttttttttt");
//        if (wallet) {
//          // Update the wallet of the referral code owner with 100 rupees
//          wallet.balance += 100;

       
//             const transaction = {
//               date: new Date(),
//               type: "recived",
//               from: "Refferal code ",
//               amount: 100,
//             };
//             console.log(transaction, "traa....");
//             wallet.transactions.push(transaction);
    
//             await wallet.save();  
          

//        }
     
//       }
//     } 
    
//     catch (err) { 
//       res.render("page-404")

//       console.error(err.message);
//       return res.status(500).send("Internal Server Error");
//     }
//   };  
     

var otp;
const userRegister = async (req, res) => {
  try {
      const checkEmail = await User.findOne({ email: req.body.email });

      if (checkEmail) {
          // Email already exists, display validation message
          return res.render("page-register", {
              message: "Email already exists. Try again",
          });
      } else {
          // Check if a referral code is provided
          const referralCode = req.body.myRefferalCode || "";

          // Validate the referral code if provided
          if (referralCode !== "") {
              const isValidReferralCode = await isValidReferralCodeFunction(referralCode);

              if (!isValidReferralCode) {
                  // Show SweetAlert for an invalid referral code
                  Swal.fire({
                      icon: "error",
                      title: "Invalid Referral Code",
                      text: "The referral code you provided is invalid. Please try again.",
                  });

                  return res.render("page-register", {
                      message: "Invalid referral code. Try again",
                  });
              }
          }

           otp = randomstring.generate({
              length: 6,
              charset: "numeric",
          });

          const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                  user: "muhzinsidhiq333@gmail.com",
                  pass: "iiue xtwn lkkf jfps",
              },
          });

          const mailOptions = {
              from: "muhzinsidhiq333@gmail.com",
              to: req.body.email,
              subject: "OTP Verification",
              text: `Your OTP code is: ${otp}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  console.log("Email send error: " + error);
                  return res.status(500).json({ error: "Failed to send OTP" });
              } else {
                  console.log("Email sent: " + info.response);
                  // Redirect to the OTP verification page
                  return res.status(200).redirect("/page-verify-otp");
              }
          });

          const randomReferralCode = generateRandomReferralCode();

          const sPassword = await securePassword(req.body.password);

          const userData = {  
              username: req.body.username,
              email: req.body.email,
              password: sPassword,
              myRefferalCode: randomReferralCode,
              wallet:0 
          };

          console.log(userData, "userDatauserData||||||||||||||||||");

          req.session.userData = userData;

          const referralCodeOwner = await User.findOne({ myRefferalCode: referralCode });

          if (referralCodeOwner) {
              const user_id = referralCodeOwner._id;
              const wallet = await Wallet.findOne({ userId: user_id });

              if (wallet) {
                  // Update the wallet of the referral code owner with 100 rupees
                  wallet.balance += 100;

                  const transaction = {
                      date: new Date(),
                      type: "recived",
                      from: "Refferal code ",
                      amount: 100,
                  };

                  console.log(transaction, "traa....");
                  wallet.transactions.push(transaction);

                  await wallet.save();
              }
          } else {
              console.log("Referral code owner not found");
              // Handle the case where referralCodeOwner is null
          }

          // Continue with the rest of your code...
      }
  } catch (err) {
      console.error(err.message);
      return res.status(500).send("Internal Server Error");
  }
};

       
  

const isValidReferralCodeFunction = async (referralCode) => {
  try {
    // Check if any user in the database has the provided referral code
    const userWithReferralCode = await User.findOne({myRefferalCode:referralCode});
    console.log(userWithReferralCode,"userWithReferralCodeuserWithReferralCode");

    // Return true if a user with the referral code is found, indicating it's valid
    return !!userWithReferralCode;
  } catch (error) {
    res.render("page-404")

    console.error("Error validating referral code:", error);
    return false; // Consider it as invalid in case of an error
  }
};
const generateRandomReferralCode = () => {
  return randomstring.generate({
    length: 8,
    charset: "alphanumeric",
  });
};







//HOME
const loadhome = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.user_id });
    const products = await AdminProduct.find().limit(8);
    const banners=await Banners.find()


    if (userData) {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

      // Assuming you have a function to get the cart count
      const cartCount = await getCartProductCount(req.session.user_id);

      console.log("Cart Count:", cartCount);
      res.render("index-3", {
        user: userData,
        logged: "user logged   ",
        products: products,
        cartCount: cartCount || 0,
        banners:banners
      });
    } 
    
    else {
      res.redirect("/");
    }
  } catch (err) {
    res.render("page-404")

    console.log(err.message);
    res.status(500).send("Internal Server Error");
  }
};

const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    return res.redirect("/page-login");
  } catch (error) {
    console.log(error.message);
  }
};

const loadverifyUserOTP = async (req, res) => {
  try {
    if (req.session.user_id) {
      res.redirect("/index-3");
    } else {
      // Calculate the remaining time in seconds (adjust the value as needed)
      const remainingTimeInSeconds = 60; // Change this value based on your requirements

      // Render the "page-verify-otp" view with the remaining time
      res.render("page-verify-otp", { remainingTime: remainingTimeInSeconds });
    }
  } catch (error) {
    res.render("page-404")

    console.log(error);
  }
};

const verificationOtp = async (req, res) => {
  try {
    const enteredOTP = req.body.otp;
    console.log(enteredOTP,"enteredOTPenteredOTP");
    
    // Check if the entered OTP matches the one passed as a parameter
    if (enteredOTP === otp || enteredOTP === rotp) {
      // Ensure that userData is defined in req.session
      const userData = req.session.userData;
      const user_id=req.session.user_id

      const user = new User({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        is_admin: userData.is_admin,
        myRefferalCode:userData.myRefferalCode 
        // Add other properties as needed
      });

      await user.save();
      console.log(user);
      let walletData = {
        userId:user._id,
        balance:0,
        transactions:[] 
      }

     await Wallet.insertMany([walletData])

      return res.render("success-login", { logged: "user logged   " });
    } else {
      // Invalid OTP
      res.render("page-verify-otp", { message: "invalid OTP" });
    }
  } catch (error) {
    res.render("page-404")
  }
};  
 
var rotp;
const resendOTP = async (req, res) => {
  try {
    // Generate a new OTP (same code you used during registration)
    rotp = randomstring.generate({
      length: 6,
      charset: "numeric",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "muhzinsidhiq333@gmail.com",
        pass: "iiue xtwn lkkf jfps",
      },
    });

    const mailOptions = {
      from: "muhzinsidhiq333@gmail.com",
      to: req.session.userData.email, // Use the email from the user's session
      subject: "Resend OTP Verification",
      text: `Your new OTP code is: ${rotp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Email send error: " + error);
        res.status(500).json({ error: "Failed to send OTP" });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).redirect("/page-verify-otp");
      }
    });
  } catch (err) {
    res.render("page-404")

    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
};

const success = async (req, res) => {
  try {
    return res.status(200).render("success-login");
  } catch (error) {
    res.render("page-404")

    console.log(error);
  }
};

const loadSingleProductPage = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await AdminProduct.findById(id).populate("category");

    // Assuming you have a function to calculate the discounted price
    const discountedPrice = calculateDiscountedPrice(
      product.price,
      product.discountPercentage
    );
    const discountPercentage = product.discountPercentage;

    console.log(
      discountedPrice,
      "discountedPrice----------------------------------"
    );
    const user_id=req.session.user_id
    
    // let logged
    if(user_id){
      res.render("single-product-page", {
        logged:"user logged",
        product,
        discountedPrice,
        discountPercentage,
      });
    }else{
      res.render("single-product-page", {
        product,
        discountedPrice,
        discountPercentage,
      });
    }
    // res.render("single-product-page", {
    //   product,
    //   discountedPrice,
    //   discountPercentage,
    // });
  } catch (error) {
    res.render("page-404")

    console.log(error);
  }
};

function calculateDiscountedPrice(originalPrice, discountPercentage) {
  const discountAmount = (discountPercentage / 100) * originalPrice;
  const discountedPrice = originalPrice - discountAmount;
  return discountedPrice.toFixed(2); // Adjust the precision as needed
}

const loadLipsCare = async (req, res) => {
  try {
    // Find the 'lips care' category by its name
    const lipsCareCategory = await AdminCategory.findOne({
      _id: "6542743d9867a953f1762ac9",
    });
    // const categoryOffer = lipsCareCategory.offer || null;

console.log(lipsCareCategory.offerPercentage,"oooooooffffffffffffffff");

const categoryOffer=lipsCareCategory.offerPercentage

    if (!lipsCareCategory) {
      return res.status(404).send("Lips Care category not found");
    }

    // Get the sort parameter from the query string
    const sortBy = req.query.sortBy || "featured";

    // Define the sort criteria based on the sortBy parameter
    let sortCriteria;
    if (sortBy === "lowToHigh") {
      sortCriteria = { price: 1 }; // Ascending order
    } else if (sortBy === "highToLow") {
      sortCriteria = { price: -1 }; // Descending order
    } else {
      // Default to sorting by 'featured' or any other default criteria
      sortCriteria = {
        /* your default sorting criteria */
      };
    }

    // Find products that belong to the 'lips care' category using its ObjectId and apply sorting
    const lipsCareProducts = await AdminProduct.find({
      category: lipsCareCategory._id,
    }).sort(sortCriteria);

    if (lipsCareProducts.length === 0) {
      return res.status(404).send("Lips Care products not found");
    }

    // Calculate discounted price and discount percentage for each product
    const productsWithDiscount = lipsCareProducts.map((product) => ({
      ...product.toObject(),
      discountedPrice: calculateDiscountedPrice(
        product.price,
        product.discountPercentage
      ),
      discountPercentage: product.discountPercentage,
    }));
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    const user_id=req.session.user_id
    
    // let logged
    if(user_id){
      res.render("lipscare", { logged:"user logged",products: productsWithDiscount, sortBy: sortBy ,lipsCareCategory:lipsCareCategory});
    }else{
      res.render("lipscare", { products: productsWithDiscount, sortBy: sortBy ,lipsCareCategory:lipsCareCategory});

    } 
    // Render the 'lipscare' EJS template and pass the products and sortBy as variables
    // res.render("lipscare", { logged:"user logged",products: productsWithDiscount, sortBy: sortBy ,lipsCareCategory:lipsCareCategory});
  } catch (error) {
    res.render("page-404")

    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};



const loadFaceCare = async (req, res) => {
  try {
    // Find the 'face care' category by its name
    const faceCareCategory = await AdminCategory.findOne({
      _id: "653bd88ad77542c16cd64b13",
    });
    console.log(faceCareCategory, "gpoooo");
    if (!faceCareCategory) {
      return res.status(404).send("Face Care category not found");
    }

    // Get the sort parameter from the query string
    const sortBy = req.query.sortBy || "featured";

    // Define the sort criteria based on the sortBy parameter
    let sortCriteria;
    if (sortBy === "lowToHigh") {
      sortCriteria = { price: 1 }; // Ascending order
    } else if (sortBy === "highToLow") {
      sortCriteria = { price: -1 }; // Descending order
    } else {
      // Default to sorting by 'featured' or any other default criteria
      sortCriteria = {
        /* your default sorting criteria */
      };
    }
    // Find products that belong to the 'face care' category using its ObjectId
    const faceCareProducts = await AdminProduct.find({
      category: faceCareCategory._id,
    }).sort(sortCriteria);

    if (faceCareProducts.length === 0) {
      return res.status(404).send("Face Care products not found");
    }

    // Calculate discounted price and discount percentage for each product
    const productsWithDiscount = faceCareProducts.map((product) => ({
      ...product.toObject(),
      discountedPrice: calculateDiscountedPrice(
        product.price,
        product.discountPercentage
      ),
      discountPercentage: product.discountPercentage,
    }));
    const user_id=req.session.user_id
    
    // let logged
    if(user_id){
      res.render("facecare", {logged: "user logged   ", products: productsWithDiscount, sortBy: sortBy });

    }else{
      res.render("facecare", { products: productsWithDiscount, sortBy: sortBy });

    }
    // Render the 'facecare' EJS template and pass the products as a variable
    // res.render("facecare", {logged: "user logged   ", products: productsWithDiscount, sortBy: sortBy });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const loadBodyCare = async (req, res) => {
  try {
    // Find the 'body care' category by its name
    const bodyCareCategory = await AdminCategory.findOne({
      _id: "653b5d46daca97646f21abac",
    });

    // Get the sort parameter from the query string
    const sortBy = req.query.sortBy || "featured";

    // Define the sort criteria based on the sortBy parameter
    let sortCriteria;
    if (sortBy === "lowToHigh") {
      sortCriteria = { price: 1 }; // Ascending order
    } else if (sortBy === "highToLow") {
      sortCriteria = { price: -1 }; // Descending order
    } else {
      // Default to sorting by 'featured' or any other default criteria
      sortCriteria = {
        /* your default sorting criteria */
      };
    }

    // Find products that belong to the 'body care' category using its ObjectId and apply sorting
    const bodyCareProducts = await AdminProduct.find({
      category: bodyCareCategory._id,
    }).sort(sortCriteria);

    if (bodyCareProducts.length === 0) {
      return res.status(404).send("Body Care products not found");
    }


      // Calculate discounted price and discount percentage for each product
      const productsWithDiscount = bodyCareProducts.map((product) => ({
        ...product.toObject(),
        discountedPrice: calculateDiscountedPrice(
          product.price,
          product.discountPercentage
        ),
        discountPercentage: product.discountPercentage,
      }));
      const user_id=req.session.user_id
    
      // let logged
      if(user_id){
        res.render("bodycare", {logged: "user logged   ", products: productsWithDiscount, sortBy: sortBy });

      }else{
        res.render("bodycare", {products: productsWithDiscount, sortBy: sortBy });

      }
    // Render the 'bodycare' EJS template and pass the products and sortBy as variables
    // res.render("bodycare", {logged: "user logged   ", products: productsWithDiscount, sortBy: sortBy });
  } catch (error) {
    res.render("page-404")

    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const loadHairCare = async (req, res) => {
  try {
    // Find the 'hair care' category by its name
    const hairCareCategory = await AdminCategory.findOne({
      _id: "653b59fd3bebb46642473acf",
    });

    if (!hairCareCategory) {
      return res.status(404).send("Hair Care category not found");
    }

    // Get the sort parameter from the query string
    const sortBy = req.query.sortBy || "featured";

    // Define the sort criteria based on the sortBy parameter
    let sortCriteria;
    if (sortBy === "lowToHigh") {
      sortCriteria = { price: 1 }; // Ascending order
    } else if (sortBy === "highToLow") {
      sortCriteria = { price: -1 }; // Descending order
    } else {
      // Default to sorting by 'featured' or any other default criteria
      sortCriteria = {
        /* your default sorting criteria */
      };
    }

    // Find products that belong to the 'hair care' category using its ObjectId and apply sorting
    const hairCareProducts = await AdminProduct.find({
      category: hairCareCategory._id,
    }).sort(sortCriteria);

    if (hairCareProducts.length === 0) {
      return res.status(404).send("Hair Care products not found");
    }
    // Calculate discounted price and discount percentage for each product
    const productsWithDiscount = hairCareProducts.map((product) => ({
      ...product.toObject(),
      discountedPrice: calculateDiscountedPrice(
        product.price,
        product.discountPercentage
      ),
      discountPercentage: product.discountPercentage,
    }));
    const user_id=req.session.user_id
    
    // let logged
    if(user_id){
      res.render("haircare", {logged: "user logged   ", products: productsWithDiscount, sortBy: sortBy });

    }else{
      res.render("haircare", { products: productsWithDiscount, sortBy: sortBy });

    }
    // Render the 'haircare' EJS template and pass the products and sortBy as variables
    // res.render("haircare", {logged: "user logged   ", products: productsWithDiscount, sortBy: sortBy });
  } catch (error) {
    res.render("page-404")

    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const loadAllProducts = async (req, res) => {
  try {
    // Get the page parameter from the query string
    const page = parseInt(req.query.page) || 1;
    const perPage = 8; // Number of products per page

    // Get the sort parameter from the query string
    const sortBy = req.query.sortBy || "featured";

    // Define the sort criteria based on the sortBy parameter
    let sortCriteria;
    if (sortBy === "lowToHigh") {
      sortCriteria = { price: 1 }; // Ascending order
    } else if (sortBy === "highToLow") {
      sortCriteria = { price: -1 }; // Descending order
    } else {
      // Default to sorting by 'featured' or any other default criteria
      sortCriteria = {
        /* your default sorting criteria */
      };
    }

    // Fetch total count of products
    const totalProducts = await AdminProduct.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalProducts / perPage);

    // Fetch paginated products from the database and apply sorting
    const products = await AdminProduct.find()
      .sort(sortCriteria)
      .skip((page - 1) * perPage)
      .limit(perPage);

   
      // Calculate discounted price and discount percentage for each product
      const productsWithDiscount = products.map((product) => ({
        ...product.toObject(),
        discountedPrice: calculateDiscountedPrice(
          product.price,
          product.discountPercentage
        ),
        discountPercentage: product.discountPercentage,
      }));
    // Render the view with the paginated products and pagination information
    const user_id=req.session.user_id
    
    // let logged
    if(user_id){
      return res.render("allProducts", {
        logged: "user logged   ",
        products:productsWithDiscount,
        sortBy,
        currentPage: page,
        totalPages,
      });
    }else{
      return res.render("allProducts", {
        products:productsWithDiscount,
        sortBy,
        currentPage: page,
        totalPages,
      });
    }

   
  } catch (error) {
    res.render("page-404")

    console.log(error);
    // Handle the error appropriately
    return res.status(500).send("Internal Server Error");
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
      res.render("myAddress", {
        user: userData,
        addresses: userData.addresses,
        orders: userOrders,
      });
    }
  } catch (error) {
    res.render("page-404")

    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const loadMyProfile = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const userData = await User.findById(userId);


    if (!userId||userData.isBlocked===true){
      return res.render("page-login")
   }

    
    console.log(userData,"userDatauserDatauserData");

   
    const userOrders = await Order.find({ user: userId });

    if (userData) {
      res.render("user-account", {
        logged: "user logged   ",
        user: userData,
        addresses: userData.addresses,
        orders: userOrders,
      });
    }
  } catch (error) {
    res.render("page-404")
  
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};



const loadEditProfile = async (req, res) => {
  try {
    const userId = req.session.user_id; // Assuming req.session.user_id contains a valid ObjectId
    const userData = await User.findById(userId);

    if (userData) {
      res.render("edit-profile", { user: userData });
    }
  } catch (error) {
    res.render("page-404")

    console.log(error);
  }
};

const editProfile = async (req, res) => {
  try {
    const id = req.query.id; // or req.body.id if passed as a form field
    const name = req.body.name; // assuming name is passed in the request body
    // Update the user's name
    await User.findByIdAndUpdate(id, { name });

    res.redirect("/myprofile");
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
    res.render("page-404")

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
    res.redirect("/loadmyaddress");
  } catch (error) {
    res.render("page-404")

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
    res.render("page-404")

    console.log(error);
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

    const addressIndex = user.addresses.findIndex(
      (address) => address._id.toString() === addressId
    );
    if (addressIndex === -1) {
      // Handle the case when the address is not found
      return res.status(404).send("Address not found");
    }

    // Remove the address from the user's addresses array
    user.addresses.splice(addressIndex, 1);

    // Save the updated user document
    await user.save();

    res.redirect("/loadmyaddress"); // Redirect back to the user account page or any other desired page after deleting.
  } catch (error) {
    res.render("page-404")

    console.error(error);
    // Handle errors appropriately, e.g., render an error page or provide an error response
    res.status(500).send("Internal Server Error");
  }
};

const loadEnterEmail = async (req, res) => {
  try {
    res.render("email-reset-otp");
  } catch (error) {
    res.render("page-404")

    console.log(error);
  }
};

var cotp;
const loadEnterOtp = async (req, res) => {
  try {
    const email = req.body.email;

    // Generate a random OTP
    cotp = randomstring.generate({
      length: 4, // Adjust the length as needed
      charset: "numeric", // Generate a numeric OTP
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "muhzinsidhiq333@gmail.com", // Your Gmail address
        pass: "iiue xtwn lkkf jfps", // Your Gmail password or an app-specific password
      },
    });

    // Create email data
    const mailOptions = {
      from: "muhzinsidhiq333@gmail.com", // Your Gmail address
      to: email, // User's email
      subject: "OTP Verification",
      text: `Your OTP code is: ${cotp}`,
    };

    // Send the email with OTP
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email send error: " + error);
        res.status(500).json({ error: "Failed to send OTP" });
      } else {
        console.log("Email sent: " + info.response);
        res.render("enterOTP");
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const loadForgottPassword = async (req, res) => {
  try {
    const enteredOTP = req.body.otp;

    // Check if the entered OTP matches the one generated
    if (enteredOTP === cotp || enteredOTP === rotp) {
      res.render("forgott-password");
    } else {
      res.render("enterOTP", { message: "please check the OTP" });
    } 
  } catch (error) {
    res.render("page-404")

    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const newPassword = req.body.password;

    const passwordHash = await securePassword(newPassword);
    const userEmail = req.body.email; // Assuming the user provides their email
    console.log(userEmail, "123");
    const result = await User.updateOne(
      { email: userEmail },
      { $set: { password: passwordHash } }
    );

    console.log(result, "vvv");

    const successMessage = "Password reset successful.";
    res.render("forgott-password", { successMessage });
  } catch (error) {
    res.render("page-404")

    console.log(error);
    res.status(500).json({ message: "Error updating user information" });
  }
};

const loadAddToCart = async (req, res) => {
  try {
    let userId = req.session.user_id;
    const userdata = await User.findById(userId);

    if (!userId||userdata.isBlocked===true){
      return res.render("page-login")
   }
  
    // Check if the user is not logged in
    // if (!userdata) {
    //   // Redirect to the login page
    //   return res.redirect("/page-login");
    // }

    else{
      let cart = await Cart.findOne({ user: userId }).populate(
        "products.productId"
      );
      let products = cart?.products;
      // console.log(products,"productssssssssssssss");
    for (let i=0;i<products.length;i++){
      // console.log(products[i].productId.discountPercentage,"(products[i].productId.discountPercentagggggggggggggggggggggggge");
      if(products[i].productId.discountPercentage!==0){
  
        products[i].productId.price=calculateDiscountedPrice(products[i].productId.price,products[i].productId.discountPercentage)
      }
    }
  
      // Check if the cart is empty
      const isCartEmpty = !products || products.length === 0;
  
      // Calculate the total cart amount
      const totalAmount = calculateCartTotal(products).toFixed(2);
      console.log(totalAmount,"totalAmountttttttttttttttttt");
  
      cart.total = totalAmount;
      console.log( cart.total," cart.totalllllllllllllll");
      await cart.save();
      console.log(cart);
if(userId){
  res.render("cart-page", {
    logged:"user logged",
    products,
    userdata,
    cart,
    isCartEmpty,
    totalAmount,
  });
}else{
    res.render("cart-page", {
        products,
        userdata,
        cart,
        isCartEmpty,
        totalAmount,
      });

}
    
    }





  } catch (error) {
    res.render("page-404")

    console.log(error);
    // Handle other errors as needed
    res.status(500).send("Internal Server Error");
  }
};

const AddToCart = async (req, res) => {
  try {
    const userId = req.session.user_id;
    if (!userId){
      res.render("page-login")
   }

    const productId = req.params.id;
    let userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
      // If the user's cart doesn't exist, create a new cart
      let discount = 0;
      const newCart = new Cart({ user: userId, products: [] });
      await newCart.save();
      userCart = newCart;
    }

    const productIndex = userCart?.products.findIndex(
      (product) => product.productId == productId
    );
    console.log(productIndex,"productIndexxxxxxxxxxxxxxxxxxxxx");
    if (productIndex === -1) {
      // If the product is not in the cart, add it
      userCart.products.push({ productId, quantity: 1 });
    } else {
      // If the product is already in the cart, increase its quantity by 1
      userCart.products[productIndex].quantity += 1;
    }

  
    await userCart.save();
    res.redirect("/cart");


  } catch (error) {
    res.render("page-404")

    console.log(error);
  }
};



const removeProduct = async (req, res) => {
  try {
    const userId = req.session.user_id; // Check the actual structure of req.user
    const productId = req.body.productId;

    // Find the user's cart
    const userCart = await Cart.findOne({ user: userId });

    // If the user has a cart
    if (userCart) {
      // Remove the product from the cart's products array
      userCart.products = userCart.products.filter(
        (product) => product.productId.toString() !== productId
      );

      await userCart.save();

      return res.redirect("/cart");
    } else {
      return res.status(404).send("User does not have a cart");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const loadCheckOut = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const user = await User.findById({ _id: user_id });
    const wallet = await Wallet.find({ userId: user_id });
    const addresses = user.addresses;
    // const products = await AdminProduct.find();


    // Assuming you have a separate Cart model to store user's cart data
    const cart = await Cart.findOne({ user: user_id }).populate(
      "products.productId"
    );
    let products = cart?.products;

   for (let i=0;i<products.length;i++){
      // console.log(products[i].productId.discountPercentage,"(products[i].productId.discountPercentagggggggggggggggggggggggge");
      if(products[i].productId.discountPercentage!==0){
  
        products[i].productId.price=calculateDiscountedPrice(products[i].productId.price,products[i].productId.discountPercentage)
      }
    }

    // Assuming you have a Coupon model to fetch coupons
    const coupons = await Coupon.find(); // Fetch all coupons, adjust as needed

    // Assuming you have a Product model to fetch products 



    res.render("checkout-page", {
      addresses: addresses,
      cart: cart,
      products: products,
      coupons: coupons,
      wallet,
    });
  } catch (error) {
    console.log(error);
  }
};

// const calculateCartTotal = (products) => {
//   let total = 0;
//   products.forEach((product) => {
//     total += product.quantity * product.productId.price;
//   });
//   return total;
// };

const calculateCartTotal = (products, categoryOffer) => {
  let total = 0;

  products.forEach((product) => {
    if (product.productId && product.productId.price !== undefined) {
      total += product.quantity * product.productId.price;
    }
  });

  // Include category offer calculation if available
  if (categoryOffer !== undefined) {
    total *= (100 - categoryOffer) / 100;
  }

  return total;
};



const loadConfirmOrder = async (req, res) => { 
  try {
    const userId = req.session.user_id;
    const selectedAddressId = req.body.addresses;

    // Fetch user's cart
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.productId"
    );
    const cartProducts = Array.isArray(cart.products) ? cart.products : [];

    if (req.body.payment_option === "wallet") {
      // Fetch the user's wallet
      const userWallet = await Wallet.findOne({ userId });
      console.log(userWallet.balance, "userWallet____________________________");

      if (!userWallet) {
        return res.status(200).json({ error: "User's wallet not found." });
      }

      // Calculate the total order amount
      const orderAmount = calculateCartTotal(cartProducts);
      console.log(orderAmount, "orderAmount..............");

      // Check if the wallet balance is sufficient
      if (userWallet.balance >= orderAmount) {
        // Deduct the order amount from the wallet balance
        userWallet.balance -= orderAmount;

        // Update wallet transactions
        userWallet.transactions.push({
          date: new Date(),
          type: "debit",
          amount: orderAmount,
          description: "Order payment",
        });

        // Save the updated wallet information
        await userWallet.save();
      } else {
        // Insufficient balance in the wallet
        return res
          .status(200)
          .json({ error: "Insufficient balance in your wallet." });
      }
    }

    // Create an order with the products from the cart
    const orderItems = cartProducts.map((product) => ({
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
      paymentType: req.body.payment_option,
    });

    await order.save();

    if (req.body.payment_option === "wallet") {
      await Order.findOneAndUpdate(
        { _id: order._id },
        { $set: { paymentStatus: "complete" } }
      );
    }

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
      makeRazorpayPayment(order._id, order.total)
        .then(async (response) => {
          console.log(response), "resloved";
          const updatedOrder = await Order.findOneAndUpdate(
            { _id: order._id },
            { $set: { paymentId: response.id } },
            { new: true }
          );
          console.log("razorpay payment method");
          return res
            .status(200)
            .json({ status: "razorpay", data: response, order: updatedOrder });
        })
        .catch((err) => {
          console.log(err, "rejected");
          return res
            .status(500)
            .json({ status: "false", message: "something went wrong" });
        });
    }

    if (order?.paymentType === "wallet") {
      return res
        .status(200)
        .json({
          status: "wallet",
          message: "Order has been placed with cash on delivery",
          paymentOption: "wallet",
        });
    }
    if (order?.paymentType === "cod") {
      return res
        .status(200)
        .json({
          status: "success",
          message: "Order has been placed with cash on delivery",
          paymentOption: "cod",
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// const calculateCartTotal = (cartProducts) => {
//     return cartProducts.reduce((total, product) => {
//       return total + product.subTotal;
//     }, 0);
//   };

const updateQuantitys = async (req, res, next) => {
  const userId = req.session.user_id;
  const cartItemId = req.body.cartItemId;

  try {
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.productId"
    );
    //   const product = await products.findById({ _id: cartItemId });

    const cartIndex = cart.products.findIndex((item) =>
      item.productId.equals(cartItemId)
    );

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
        maxQuantity,
      });
    }

    await cart.save();

    const total =
      cart.products[cartIndex].quantity *
      cart.products[cartIndex].productId.price;
    const quantity = cart.products[cartIndex].quantity;

    console.log(total, quantity, "pppp");

    res.json({
      success: true,
      message: "Quantity updated successfully.",
      total: parseInt(total),
      quantity,
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
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.productId"
    );
    const cartIndex = cart.products.findIndex((item) =>
      item.productId.equals(cartItemId)
    );

    if (cartIndex === -1) {
      return res.json({ success: false, message: "Cart item not found." });
    }

    cart.products[cartIndex].quantity -= 1;
    await cart.save();

    console.log(cart, "uuuu");
    const total =
      cart.products[cartIndex].quantity *
      cart.products[cartIndex].productId.price;
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
};

const searchProducts = async (req, res) => {
  try {
    const searchTerm = req.query.q; // Assuming the search query is passed as a query parameter 'q'

    // Perform a case-insensitive search for products with names that match the search term
    const products = await AdminProduct.find({
      name: { $regex: new RegExp(searchTerm, "i") },
    });

    // Render the search results in the 'search-results' view
    return res.render("search-results", {
      products: products,
      searchTerm: searchTerm,
      logged: "user logged   ",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const orderDetails = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const orderId = req.params.id;

    const order = await Order.findById(orderId)
      .populate({
        path: 'items.product',
        select: 'name image',
      })
      .exec();

    const user = await User.findById(userId);

    if (order) {
      const products = order.items.map((item) => ({
        productId: item.product,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      res.render("orderDetails", {
        order: order,
        user: user,
        products: products,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};


const loadOrder = async (req, res) => {
  try {
    // Assuming you fetch the orders from the database here, adjust as needed
    const orders = await Order.find({ user: req.session.user_id });

    // Assuming you have a function to get the cart count
    const cartCount = await getCartProductCount(req.session.user_id);

    res.render("ordersList", { orders, cartCount: cartCount });
  } catch (error) {
    console.log(error);
    // Handle errors appropriately, e.g., render an error page or provide an error response
    res.status(500).send("Internal Server Error");
  }
};

const getCartProductCount = async (userId) => {
  try {
    // Find the user's cart by userId
    const userCart = await Cart.findOne({ user: userId });

    if (!userCart) {
      return 0; // If the cart doesn't exist, return 0 products
    }

    // Sum the quantities of all products in the cart
    const productCount = userCart.products.reduce((sum, product) => {
      return sum + product.quantity;
    }, 0);

    return productCount;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const cancelReason = req.body.cancelReason;
    const user_id = req.session.user_id;

    // Fetch the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order is already canceled
    if (order.status === "Cancel") {
      return res.status(400).json({ message: "Order is already canceled" });
    }

    // Update order status to 'Cancel'
    order.status = "Cancel";

    // Save the cancellation reason
    order.reasonForCancel = cancelReason;

    // Save the updated order
    await order.save();

    if (order.paymentType === "razorypay" || order.paymentType === "wallet") {
      const wallet = await Wallet.findOne({ userId: user_id });
      if (!wallet) {
        const transaction = {
          date: new Date(),
          type: "recived",
          from: `Order cancelled ${order._id}`,
          amount: order.total,
        };
        console.log(transaction);
        const newUserWallet = new Wallet({
          userId: user_id,
          balance: order.total,
          transactions: [transaction],
        });
        await newUserWallet.save();
      } else {
        wallet.balance += order.total;
        const transaction = {
          date: new Date(),
          type: "recived",
          from: `Order cancelled ${order._id}`,
          amount: order.total,
        };
        console.log(transaction, "traa....");
        wallet.transactions.push(transaction);

        await wallet.save();
      }
    }

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

    res.status(200).json({ message: "Order Cancelled!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const returnOrder = async (req, res) => {
  try {
    const userId = req.session.user_id;

    const orderId = req.params.id;
    const reasonForReturn = req.query.reason;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).render("errorPage", { error: "Order not found" });
    }

    if (order.status === "Returned") {
      return res
        .status(400)
        .json({ error: "Order has already been returned." });
    }

    if (order.status !== "Delivered") {
      return res
        .status(400)
        .json({ error: "Order must be delivered to be eligible for return." });
    }

    // Assuming order.amount represents the original amount of the order
    const returnedAmount = order.amount;

    // Update order status to 'Returned'
    order.status = "Returned";

    // Save the reason for return
    order.reasonForReturn = reasonForReturn;

    // Save the updated order
    await order.save();

    // Now, you can add the returned amount to the user's wallet
    const user = await User.findById(userId); // Replace 'userId' with the actual field in your Order model

    if (!user) {
      return res.status(404).render("errorPage", { error: "User not found" });
    }

    if (order.paymentType === "cod") {
      const wallet = await Wallet.findOne({ userId: userId });
      if (!wallet) {
        const transaction = {
          date: new Date(),
          type: "recived",
          from: `Order returned ${order._id}`,
          amount: order.total,
        };
        console.log(transaction);
        const newUserWallet = new Wallet({
          userId: userId,
          balance: order.total,
          transactions: [transaction],
        });
        await newUserWallet.save();
      } else {
        wallet.balance += order.total;
        const transaction = {
          date: new Date(),
          type: "recived",
          from: `Order returned ${order._id}`,
          amount: order.total,
        };
        console.log(transaction, "traa....");
        wallet.transactions.push(transaction);

        await wallet.save();
      }
    }

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

    res.status(200).json({ message: "Order Cancelled!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkStatusForReturn = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Fetch the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if return is already requested
    const isReturnRequested = order.status === "Delivered";

    res.json({ isReturnRequested });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const loadRazorpay = async (req, res) => {
  try {
    // Implement logic to create a Razorpay order
    const options = {
      amount: 50000, // Amount in paise (e.g., 50000 paise = ₹500)
      currency: "INR",
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleVerifyPayment = async (req, res) => {
  try {
    console.log(req.body, "body");
    const order = await Order.findOneAndUpdate(
      { paymentId: req.body?.order?.id },
      { $set: { paymentStatus: "complete" } },
      { new: true }
    );
    console.log(order);
    res
      .status(200)
      .json({ status: "success", message: "Successfully verified payment..." });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const loadConfirmPage = async (req, res) => {
  try {
    console.log("got to confirm page");

    res.render("confirmPage");
  } catch (error) {
    res.status(500).json({ error: "Somthing went wrong..." });
  }
};

const applyCoupon = async (req, res) => {
  try {
    const couponCode = req.body.couponCode;

    const user_id = req.session.user_id;
    console.log(couponCode,"couponCode");


    // Retrieve the coupon details from the database
    const couponFind = await Coupon.findOne({ couponCode: couponCode });
    // console.log(couponFind,"couponFindjjjjjjjjjjjjjjjjjjjjjjjjj");

    const userCoupon = await User.findById({ _id: user_id });

    // Check if the userCoupon is not found
    if (!userCoupon) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }  

    // Check if the coupon is valid and not expired
    if (!couponFind || couponFind.activeCoupon === false) {
      return res.json({
        success: false,
        message: couponFind ? "Coupon Deactivated" : "Coupon not found",
      });
    }

    const currentDate = new Date();
    const expirationDate = new Date(couponFind.couponexpiry);

    if (currentDate > expirationDate) {
      return res.json({
        success: false,
        message: "Coupon Expired",
      });
    }
    // Check if the coupon has already been used by the user
    if (couponFind.usedBy.includes(user_id)) {
      return res.json({
        success: false,
        message: "Coupon Already Used",
      });
    }

    // Mark the coupon as used for the user
    couponFind.usedBy.push(user_id);
    await couponFind.save();

    const cart = await Cart.find({ user: user_id });
    cart.coupon = couponCode;
    if (cart) {
    } else {
      console.error("Cart not found");
      // Handle the case when the cart is not found
    }

    console.log(cart, "cart");

    // Send the response with coupon details and updated total amount
    const Total = calculateUpdatedTotalAmount(
      cart[0].total,
      couponFind.discountPercentage
    );
    const response = {
      success: true,
      message: "Coupon Applied Successfully",
      coupon: couponFind,
      total: Total,
    };

    const updatedCart = await Cart.findOneAndUpdate(
      { user: user_id },
      { $set: { coupon: couponCode } },
      { new: true }
    );

    // Add SweetAlert success message
    res.status(200).json(response);
  } catch (error) {
    console.error("Error applying coupon:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// Function to calculate the updated total amount with the discount from the coupon
function calculateUpdatedTotalAmount(total, discountPercentage) {
  const discountedAmount = (discountPercentage / 100) * total;
  console.log(discountedAmount, "discountedAmount---=========9999090");
  return total - discountedAmount;
}

const loadWallet = async (req, res) => {
  try {
    const userId = req.session.user_id; // Adjust this line based on how you get the userId from the request
    const wallet = await getWalletTransactions(userId);

    if (wallet && Array.isArray(wallet.transactions)) {
      // Pass transactions to the EJS template
      res.render("wallet", { wallet: wallet });
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};

const getWalletTransactions = async (userId) => {
  try {
    const wallet = await Wallet.findOne({ userId });
    return wallet;
  } catch (error) {
    throw error;
  }
};



const loadWishList = async (req, res) => {
  try {
    const userId = req.session.user_id; // Adjust this line based on how you get the userId from the request
    const userdata = await User.findById(userId);

    if (!userId||userdata.isBlocked===true){
      res.render("page-login")
   }
   else{
    const wishlist = await Wishlist.findOne({ user:userId });
    const products = await Promise.all(wishlist.product.map(async(item)=>{
      return productModel.findById(item.item)
    }))
    console.log(products);
    if (!wishlist) {
        // If the wishlist is empty, you can handle it accordingly
        return res.render('wishList', { wishlist: { products: [] } });
    }

    res.render('wishList', { products ,logged:"user logged"});
   }
   

  } catch (error) {
      console.error(error);
      res.status(500).render('page-404', { error: 'Internal Server Error' });
  }
};

const addToWishList = async (req, res) => {
  try {
  const productId = req.params.id;
  const userId = req.session.user_id;
  const userdata = await User.findById(userId);

  if (!userId||userdata.isBlocked===true){
    return res.render("page-login")
 }else{
  const product = await AdminProduct.findById(productId);
  console.log(product,"product00000000000000");
  const wishlist = await Wishlist.findOne({ user: userId });
  console.log(wishlist,"wishlist9999999999");

  if (!wishlist) {
      // If the wishlist doesn't exist, create a new one
      const newWishlist = new Wishlist({
          user: userId,
          product: [{ item: product._id, quantity: 1 }]
      });
      await newWishlist.save();

      res.status(200).json({ error: false, message: 'Product added to wishlist' });
  } else {
      const productExistIndex = wishlist.product.findIndex((item) => item.item.equals(product._id));

      if (productExistIndex !== -1) {
          // Product already exists in the wishlist, increment quantity
          await Wishlist.updateOne(
              { user: userId, 'product.item': product._id },
              { $inc: { 'product.$.quantity': 1 } }
          );
      } else {
          // Product doesn't exist in the wishlist, add it
          wishlist.product.push({ item: product._id, quantity: 1 });
          await wishlist.save();
      }

      // res.status(200).json({ error: false, message: 'Product added to wishlist' });
      res.redirect('/WishList')
  }

 }


  





  } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Internal server error occurred' });
  }
};


const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.session.user_id;
  
    const productId = req.params.id;

    // Find the user's wishlist
    const userWishlist = await Wishlist.findOne({ user: userId });

    // If the user has a wishlist
    if (userWishlist) {
      // Ensure products is initialized and is an array
      userWishlist.product = userWishlist.product || [];

      // Remove the product from the wishlist's products array
      userWishlist.product = userWishlist.product.filter(
        (product) => product.item.toString() !== productId
      );

      // Save the updated wishlist
      await userWishlist.save();

      // Redirect to the wishlist page (adjust the route accordingly)
      return res.redirect("/wishlist");
    } else {
      // User does not have a wishlist
      return res.status(404).send("User does not have a wishlist");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};






module.exports = {
  landing,
  login,
  register,
  userRegister,
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
  returnOrder,
  checkStatusForReturn,
  loadRazorpay,
  handleVerifyPayment,
  loadConfirmPage,
  applyCoupon,
  loadWallet,
  loadWishList,
  addToWishList,
  removeFromWishlist,

};
