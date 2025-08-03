import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactPerson: String,
  contactNumber: { type: String, required: true },
  email: String,
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'India' }
  },
 
  createdAt: { type: Date, default: Date.now }
});

const Supplier = mongoose.model('Supplier', supplierSchema);
export default Supplier;
