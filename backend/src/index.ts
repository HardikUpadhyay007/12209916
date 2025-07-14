import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import urlRoutes from "./routes/urlRoutes";
import { loggingMiddleware } from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";
import { redirectToUrl } from "./controllers/urlController";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);

// Routes
app.get("/:shortcode", redirectToUrl);
app.use("/api", urlRoutes);

// Error Handling
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log("working");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
