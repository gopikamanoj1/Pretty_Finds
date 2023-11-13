const Admin = require("../model/adminModel");
const bcrypt = require("bcrypt");


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

const loadDashboard=async(req,res)=>{
    try{
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            const userData=await Admin.find({is_admin:0})
            res.render("index",{users:userData})
        
    }catch(err){
        console.log(err.message)
    }
}


const adminLogout=async(req,res)=>{
    try{
        req.session.destroy()
        res.redirect("/admin")
        }catch(err){
        console.log(err.message)
    }
}



module.exports={
    adminLoad,
    adminlogin,
    loadDashboard,
    adminLogout
}