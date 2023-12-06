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



const editProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await AdminProduct.findById(id) .populate('category')
        const categories = await AdminCategory.find(); // Fetch categories

        if (req.method === 'POST') {
            const { name, price, category, description, stock , discountPercentage} = req.body;

            // Handle file upload using multer middleware
            const upload = multer({ 
                storage: storage,
                fileFilter: function (req, file, cb) {
                    if (file.fieldname === 'image') {
                        // Allow only specific file types if needed
                        // For example, allow only images
                        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                            return cb(new Error('Only image files are allowed!'), false);
                        }
                    }
                    cb(null, true);
                }
            }).array('image', 10);
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
                product.stock = stock; // Add this line to handle the stock field
                product.discountPercentage=discountPercentage

                await product.save();
                return res.redirect('/page-product-list');
            });
        } else {
            res.render('page-edit-product', { product ,categories:categories});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

  



const addProduct = async (req, res) => {
    try {
        const upload = multer({ storage: storage }).array('image', 5);

        upload(req, res, async function (err) {
            if (err) {
                console.error(err);
                return res.status(400).send('File upload error.');
            }

            const { name, price, category, description, stock, isOffered, discountPercentage } = req.body;
            console.log(req.body);
            const image = req.files.map(file => ({ url: file.filename }));

            const newProduct = new AdminProduct({
                image: image,
                name: name,
                price: price,
                category: category,
                description: description,
                stock: stock, 
                isOffered: isOffered,
                discountPercentage: discountPercentage, // Ensure the correct assignment
            });

            await newProduct.save();

            return res.redirect('/page-product-list')
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


   

const loadProductList = async (req, res) => {
    try {
      // Get the page parameter from the query string
      const page = parseInt(req.query.page) || 1;
      const perPage = 8; // Number of products per page
  
      // Fetch total count of products
      const totalProducts = await AdminProduct.countDocuments();
  
      // Calculate total pages
      const totalPages = Math.ceil(totalProducts / perPage);
  
      // Fetch paginated products from the database
      const products = await AdminProduct.find()
      .populate('category') // Add this line to populate the 'category' field
        .skip((page - 1) * perPage)
        .limit(perPage);
  
      // Render the view with the paginated products and pagination information
      return res.render('page-products-list', {
        products,
        currentPage: page,
        totalPages,
      });
    } catch (error) {
      console.log(error);
      // Handle the error appropriately
      return res.status(500).render('page-error-404', { error });
    }
  };
  

  const updateProductStatus = async (req, res) => {
    try {
        const productId = req.params.id;
        const { status } = req.body;

        // Find the product by ID
        const product = await AdminProduct.findById(productId);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Update the isDeleted status based on the user's choice
        if (status === "activate") {
            product.isDeleted = false;
        } else if (status === "softDelete") {
            product.isDeleted = true;
        } else {
            return res.status(400).json({ error: "Invalid status" });
        }

        // Save the updated product
        await product.save();

        return res.redirect('/page-product-list'); // Redirect to the product list page or adjust as needed
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



module.exports = {  
    loadAddProductPage,
    addProduct,
    loadProductList,
    deleteProduct,
    editProduct,
    updateProductStatus

}