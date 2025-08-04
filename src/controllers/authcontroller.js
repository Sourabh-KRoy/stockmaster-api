// controllers/adminController.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../model/adminModel.js";
import Store from "../model/storeModel.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

//signup controller
const signup = async (req, res) => {
  const { name, email, password, storeName, storeAddress, storeContact } =
    req.body;
  try {
    if (
      !name ||
      !email ||
      !password ||
      !storeName ||
      !storeAddress ||
      !storeContact
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if store already exists
    const existingStore = await Store.findOne({ name: storeName });
    if (existingStore) {
      return res
        .status(400)
        .json({ message: "Store with that name already exists" });
    }

    // Create new admin
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({ name, email, password: hashedPassword });

    //create store
    const store = new Store({
      name: storeName,
      contact: storeContact,
      address: storeAddress,
      isActive: true,
      lastActive: Date.now(),
      adminId: admin._id,
    });

    await store.save();
    admin.storeId = store._id;
    await admin.save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// login controller
const login = async (req, res) => {
  let { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    /*
        if(admin.isFirstLogin === true  && admin.role === 'operator') {
            return res.status(403).json({ message: 'Please change your password first' });
        }
        */

    const token = jwt.sign(
      { id: admin._id, role: admin.role, storeId: admin.storeId },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Required for 'SameSite: None'
      sameSite: "None", // Allows cross-origin cookies
      maxAge: 24 * 60 * 60 * 1000,
      path: "/"
    });

    const adminObj = admin.toObject();
    delete adminObj.password;

    res.json({ message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.isFirstLogin = false; // Set to false after first login
    await admin.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { signup, login, logout, changePassword };
