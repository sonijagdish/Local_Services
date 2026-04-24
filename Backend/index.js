import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import process from "node:process";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import promotionRoutes from "./routes/promotionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`[Primary Protocol] Thread initialized. System identifies ${numCPUs} logical CPU cores.`);
  console.log(`[Load Balancer] Deploying ${numCPUs} worker nodes for parallel request processing...`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.warn(`[Fault Tolerance] Worker node ${worker.process.pid} expired (code: ${code}). Rebooting node...`);
    cluster.fork();
  });

} else {
  // Workers share the same TCP connection
  connectDB();

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({
        message: "Local Service API Running",
        node: process.pid,
        status: "load-balanced"
    });
  });

  app.use("/api/users", userRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/promotions", promotionRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/payment", paymentRoutes);
  app.use("/api/ai", aiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`[Worker Node] Node ID ${process.pid} integrated on Port ${PORT}`);
  });
}