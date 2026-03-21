import "reflect-metadata";
import "express-async-errors";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error-handler";
import { authRoutes } from "./route/auth-routes";
import { productRoutes } from "./route/product-routes";

const app = express();

app.use(cors());
app.use(cookieParser())
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);

app.use(errorHandler);
app.use("*", (_, res) => {
  res.status(404).json({ error: "Route not found" });
});

export { app };
