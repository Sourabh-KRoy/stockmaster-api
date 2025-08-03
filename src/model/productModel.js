import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: String,
    brand: String,
    quantityInStock: { type: Number, default: 0 },
    price: { type: Number, required: true },
    costPrice: Number,
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});


const Product = mongoose.model('Product', productSchema);
export default Product;
