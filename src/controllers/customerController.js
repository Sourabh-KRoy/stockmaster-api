// src/controllers/customerController.js
import Customer from "../model/customerModel.js";

const findCustomer = async (req, res) => {
  const { name, contactNumber, email } = req.query;

  try {
    const query = {
      $or: []
    };

    if (name) query.$or.push({ name: name });
    if (contactNumber) query.$or.push({ contactNumber: contactNumber });
    if (email) query.$or.push({ email: email });

    if (query.$or.length === 0) {
      return res.status(400).json({ message: "Please provide name, contactNumber, or email to search." });
    }

    const customer = await Customer.findOne(query);

    if (customer) {
      return res.status(200).json({ exists: true, customer });
    } else {
      return res.status(200).json({ exists: false, customer: null });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { name, isDelivery, contactNumber, email, address } = req.body;

    // Validate name
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ message: "Customer name is required" });
    }

    if (isDelivery) {
      if (!contactNumber || !email || !address) {
        return res.status(400).json({
          message: "For delivery, contact number, email, and address are required.",
        });
      }

      // Check for duplicate customer using contactNumber or email
      const existingCustomer = await Customer.findOne({
        $or: [{ contactNumber }, { email }],
      });

      if (existingCustomer) {
        return res.status(400).json({
          message: "A customer with the same contact number or email already exists.",
        });
      }
    }

    const customerData = {
      name: name.trim(),
      isDelivery: Boolean(isDelivery),
    };

    if (isDelivery) {
      customerData.contactNumber = contactNumber.trim();
      customerData.email = email.trim();
      customerData.address = address.trim();
    }

    const customer = new Customer(customerData);
    await customer.save();

    res.status(201).json({ message: "Customer created", customer });
  } catch (err) {
    res.status(500).json({ message: "Error creating customer", error: err.message });
  }
};


export default {createCustomer,findCustomer}