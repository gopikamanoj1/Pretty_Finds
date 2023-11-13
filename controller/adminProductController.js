const AdminProduct = require("../model/productModel");
const AdminCategory = require("../model/categoryModel");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const path = require('path');





const loadAddProductPage = async (req, res) => {
    try {
        const categories = await AdminCategory.find();
        // console.log(categories, "lll");
        res.render('page-form-product', { categories, });
        // res.render('page-form-product',{cat:categories})
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); // Define the destination directory for uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Define the file name with the original extension
    }
});

const addProduct = async (req, res) => {
    try {
        const upload = multer({ storage: storage }).array('image', 10); // Set the field name to 'image' and allow up to 10 files

        upload(req, res, async function (err) {
            if (err) {
                console.error(err);
                return res.status(400).send('File upload error.');
            }
            const { name, price, category, description, stock } = req.body; // Include 'stock' in the destructuring
            const image = req.files.map(file => ({ url: file.filename }));
            const newProduct = new AdminProduct({
                image: image,
                name: name,
                price: price,
                category: category,
                description: description,
                stock: stock, // Add 'stock' to the newProduct object
            });
            const products = await newProduct.save();
            if (products) {
                console.log(products, "jjjjjjj");
                res.render('page-products-list', { products: products });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};



const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        await AdminProduct.deleteOne({ _id: id });
        res.redirect('/page-product-list')
    } catch (error) {
        console.log(error);
    }
}

const editProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await AdminProduct.findById(id);
        const categories = await AdminCategory.find();

        if (req.method === 'POST') {
            const { name, price, category, description } = req.body;

            // Handle file upload using multer middleware
            const upload = multer({ storage: storage }).single('image');
            upload(req, res, async function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error uploading image");
                }

                if (req.file) {
                    product.image.url = req.file.filename;
                }

                product.name = name;
                product.price = price;
                product.category = category;
                product.description = description;

                await product.save();
                return res.redirect('/page-product-list');
            });
        } else {
            res.render('page-edit-product', { product, categories });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};


const displayProduct = async (req, res) => {
    try {
        const products = await AdminProduct.find()
            .populate('category')
            .exec();
        if (products) {
            res.render('page-products-list', { products, data: "hgffdgfdgfc" });
        }
    } catch (error) {
        console.log(error);
    }
}




module.exports = {
    loadAddProductPage,
    addProduct,
    displayProduct,
    deleteProduct,
    editProduct

}