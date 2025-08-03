import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    isDelivery: { type: Boolean, default: false },
    contactNumber: {
        type: String,
        required: function () { return this.isDelivery; }
    },
    email: {
        type: String,
        lowercase: true,
        required: function () { return this.isDelivery; }
    },
    address: {
        street: {
            type: String,
            required: function () { return this.isDelivery; }
        },
        city: String,
        state: String,
        postalCode: String,
        country: { type: String, default: 'India' }
    },
    gstNumber: String,
    createdAt: { type: Date, default: Date.now }
});

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
