import Product from "../model/productModel.js";

const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category', { store: req.admin.storeId });

        if (!categories || categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No categories found for this store',
                data: [],
            });
        }

        categories = categories.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

        res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            data: categories,
        });

    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const storeId = req.admin.storeId;
        const products = await Product.find({store:storeId});

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No product found for this store',
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            data: products,
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
        });
    }
};


const addProducts = async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}





export default { getCategories, getAllProducts,addProducts}