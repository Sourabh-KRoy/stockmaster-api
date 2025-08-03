import Admin from '../model/adminModel.js';
import bcrypt from 'bcryptjs';
import Store from '../model/storeModel.js';

const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password'); 
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        res.status(200).json({ admin });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}


const addOperator = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password'); 
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingOperator = await Admin.find({ email });
        if (existingOperator.length > 0) {
            return res.status(400).json({ message: 'Operator with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); 

        const newOperator = new Admin({
            name,
            email,
            password: hashedPassword, 
            role: 'operator',
            createdBy: req.admin.id, 
        });

        await newOperator.save();

        //need to remove password from response
        newOperator.password = undefined;

        res.status(201).json({ message: 'Operator added successfully', operator: newOperator });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

const getInactiveStores = async (req, res) => {
    try {       
        const inactiveStores = await Store.find({ isActive: false }).populate('adminId', 'name email');
        if (!inactiveStores || inactiveStores.length === 0) {
            return res.status(404).json({ message: 'No inactive stores found' });
        }

        res.status(200).json({ inactiveStores });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

export default {
    getAdminProfile, 
    addOperator,
    getInactiveStores
};

