const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },
    
    image:{
        type:String,
       
    },
    password:{
        type:String,
        required:true
    },
    is_admin:{
        type:Number,
        required:true
    },
    is_verified:{
        type:Number,
        default:0
    },
    isBlocked: {
        type: Boolean, // You can use a boolean field to indicate if a user is blocked (true) or not (false)
        default: false // By default, the user is not blocked
    },
    addresses: [{
        name:String,
        street: String,
        city: String,
        state: String,
        phone: String,
        pincode:Number
    }]
})

module.exports=mongoose.model('User',userSchema)