const mongoose=require('mongoose');

const categoryschema=mongoose.Schema({

   name:{
    type:String,
    required:true
   },
   image: [
      {
          url: {
              type: String,
              required: true,
          }
      }
  ]
  ,
  offerPercentage:{
    type:Number,
    default:0
  }
})

module.exports=mongoose.model('Category',categoryschema)