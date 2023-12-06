const AdminCategory = require("../model/categoryModel");
const bcrypt = require("bcrypt");


const loadcategorypage = async (req, res) => {
    try {
        // res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        // res.render('page-categories')
        const categories = await AdminCategory.find({});
        res.render('page-categories', { categories:categories, data: "hy" });
    } catch (error) {
        console.log(error);
    }
}

const addcategory = async (req, res) => {
    try {
        const categories = await AdminCategory.find();

        const categoryName = req.body.name;
        const offerPercentage=req.body.offerPercentage

        // Check if a category with the same name (case-insensitive) already exists
        const existingCategory = await AdminCategory.findOne({ name: { $regex: new RegExp('^' + categoryName + '$', 'i') } });

        if (existingCategory) {
            // Category already exists (case-insensitive)
            const message = 'Category already exists!';
            // Use SweetAlert for the alert
            return res.render('page-categories', { categories: categories, message });
        } else {
            const newCategory = new AdminCategory({
                name: categoryName,
                offerPercentage:offerPercentage
            });

            // Save the new category to the database
            await newCategory.save();

            const successMessage = 'Category added successfully';
            // Use SweetAlert for the success message
            res.redirect("/page-categories")
        }
    } catch (error) {
        console.log(error);
        // Handle errors and render an error page or display an error message
    }
}





const loadAddCategory=async (req,res)=>{
    try {
        res.render("categoryCreation")
    } catch (error) {
        console.log(error);
    }
}





const loadEditCategory = async (req, res) => {
    try {
        const { id } = req.params
        const category = await AdminCategory.findById(id)

         res.render('page-edit-category', { category:category })
    } catch (error) {
        console.log(error);
    }
}


const editCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name,offerPercentage } = req.body; // Extract the 'name' directly from the request body
        // Update the category with the new name
        await AdminCategory.findByIdAndUpdate(id, { name ,offerPercentage});
        const categories=await AdminCategory.find({})

        res.redirect("/page-categories")
    } catch (error) {
        console.log(error);
    }
};



const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        await AdminCategory.deleteOne({ _id: id });
        const categories=await AdminCategory.find({})

        res.redirect("/page-categories")
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    addcategory,
    loadcategorypage,
    loadAddCategory,
    loadEditCategory,
    editCategory,
    deleteCategory


}