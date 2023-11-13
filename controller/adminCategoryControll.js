const AdminCategory = require("../model/categoryModel");
const bcrypt = require("bcrypt");


const loadcategorypage = async (req, res) => {
    try {
        // res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        // res.render('page-categories')
        const categories = await AdminCategory.find();
        res.render('page-categories', { categories, data: "hy" });
    } catch (error) {
        console.log(error);
    }
}

const addcategory = async (req, res) => {
    try {
        const categories = await AdminCategory.find();
        res.render('page-categories', { categories, data: "hy" });

        const categoryName = req.body.name;

        // Check if a category with the same name (case-insensitive) already exists
        const existingCategory = await AdminCategory.findOne({ name: { $regex: new RegExp('^' + categoryName + '$', 'i') } });

        if (existingCategory) {
            // Category already exists (case-insensitive)
            return res.render('page-categories', { message: 'Category already exists!', categories });
        } else {
            const newCategory = new AdminCategory({
                name: categoryName
            });

            // Save the new category to the database
            const categoryData = await newCategory.save();

            res.render('page-categories', { categoryData, data: 'Category added successfully', categories });
        }
    } catch (error) {
        console.log(error);
        // Handle errors and render an error page or display an error message
    }
}



const displayCategory = async (req, res) => {
    try {
        const categories = await AdminCategory.find();

        if (categories && categories.length) {
            res.render('page-categories', {  data: 'Category added successfully' });
        } else {
            res.render('page-categories', { data: 'No categories found' });
        }
    } catch (error) {
        console.error(error);
    }
}





const loadEditCategory = async (req, res) => {
    try {
        const { id } = req.params
        const category = await AdminCategory.findById(id)

        return res.render('page-edit-category', { category })
    } catch (error) {
        console.log(error);
    }
}


const editCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body; // Extract the 'name' directly from the request body
        // Update the category with the new name
        await AdminCategory.findByIdAndUpdate(id, { name });
        return res.redirect('/page-categories');
    } catch (error) {
        console.log(error);
    }
};



const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        await AdminCategory.deleteOne({ _id: id });
        return res.redirect('/addcategory')
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    addcategory,
    loadcategorypage,
    displayCategory,
    loadEditCategory,
    editCategory,
    deleteCategory


}