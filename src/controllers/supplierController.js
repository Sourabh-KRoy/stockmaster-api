// controllers/supplierController.js
import Supplier from '../model/supplierModel.js';
import {
  isValidMobile,
  isValidEmail,
  isValidPostalCode
} from '../utils/validators.js';

const addSupplier = async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      contactNumber,
      email,
      address
    } = req.body;

    // Manual validations
    const errors = [];

    if (!companyName || companyName.trim().length < 2) {
      errors.push('Company name is required and should be at least 2 characters.');
    }

    if (!contactNumber || !isValidMobile(contactNumber)) {
      errors.push('Contact number must be a valid 10-digit mobile number.');
    }

    if (email && !isValidEmail(email)) {
      errors.push('Email format is invalid.');
    }

    if (address?.postalCode && !isValidPostalCode(address.postalCode)) {
      errors.push('Postal code must be a 6-digit number.');
    }

   

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const supplier = new Supplier({
      companyName: companyName.trim(),
      contactPerson: contactPerson?.trim(),
      contactNumber,
      email,
      address,
  
    });

    await supplier.save();

    res.status(201).json({
      message: 'Supplier added successfully',
      supplier,
    });

  } catch (error) {
    console.error('Error adding supplier:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    const totalSuppliers = suppliers.length;

    if (totalSuppliers === 0) {
      return res.status(404).json({ message: 'No suppliers found.' });
    }

    res.status(200).json({
      totalSuppliers,
      suppliers,
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default {addSupplier,getAllSuppliers};