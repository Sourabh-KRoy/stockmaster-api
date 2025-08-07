import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import cookieParser from "cookie-parser";

// Routes
import healthCheckRoute from "./src/routes/healthCheckRoute.js";
import authRoute from "./src/routes/authroute.js";
import adminRoute from "./src/routes/adminRoute.js";
import purchaseOrderRoute from "./src/routes/purchaseOrderRoute.js";
import supplierRoute from "./src/routes/supplierRoute.js";
import inventryRoute from "./src/routes/inventryRoute.js";

// Controllers & Models
import notificationController from "./src/controllers/notificationController.js";
import Store from "./src/model/storeModel.js";

import cron from "cron";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ MongoDB connection
connectDB();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS configuration (for frontend on localhost:5173)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://stockmaster-nine.vercel.app",
      true,
    ], // <-- frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ API Routes
app.get("/", healthCheckRoute);
app.use("/health", healthCheckRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/product-purchase", purchaseOrderRoute);
app.use("/api/supplier", supplierRoute);
app.use("/api/product", inventryRoute);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// ✅ Daily cron job to update inactive stores
const job = new cron.CronJob("0 0 * * *", async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const inactiveStores = await Store.find({
      lastActive: { $lt: thirtyDaysAgo },
    });

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

    console.log("✅ Cron: Inactive stores updated");
  } catch (error) {
    console.error("❌ Cron error:", error);
  }
});

// ✅ Start the cron job
job.start();
