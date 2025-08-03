// server.js or index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import cookieParser from 'cookie-parser';
import healthCheckRoute from './src/routes/healthCheckRoute.js';
import authRoute from './src/routes/authroute.js';
import adminRoute from './src/routes/adminRoute.js'

import purchaseOrderRoute from './src/routes/purchaseOrderRoute.js'
import supplierRoute from './src/routes/supplierRoute.js'
import inventryRoute from './src/routes/inventryRoute.js'
import notificationController from './src/controllers/notificationController.js';




dotenv.config();

const app = express();
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Define all routes here
app.get('/', healthCheckRoute);
app.use('/health', healthCheckRoute);
app.use('/api/auth', authRoute);
app.use('/api/admin',adminRoute);
app.use('/api/product-purchase',purchaseOrderRoute)
app.use('/api/supplier',supplierRoute)
app.use('/api/product',inventryRoute)

// Port
const PORT = process.env.PORT || 3001;

// MongoDB Connection
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


// Mention all cron jobs here if any

// write a cron job to run every day at 12:00 AM to update the lastActive field of all stores
import cron from 'cron';
import Store from './src/model/storeModel.js';
const job = new cron.CronJob('0 0 * * *', async () => {
    try {
        // Update lastActive field for all stores
        // If store is inactive for more than 30 days, set isActive to false
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const inactiveStores = await Store.find({ lastActive: { $lt: thirtyDaysAgo } });

        for (const store of inactiveStores) {
            store.isActive = false;
            await store.save();

            await notificationController.createNotification(
                "Sorry, but due to inactivity your store has been marked as inactive. Please request Super Admin to set it active again.",
                "Store marked as inactive",
                "warning",
                false,
                store.adminId,
                null
            );
        }

        console.log('Last active field updated for all stores');
    } catch (error) {
        console.error('Error updating last active field:', error);
    }
});
