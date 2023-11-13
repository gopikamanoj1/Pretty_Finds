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
})

module.exports=mongoose.model('Category',categoryschema)