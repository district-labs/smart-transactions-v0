import 'dotenv/config'
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import profileUserRoutes from "./routes/user/profile";
import intentBatchAdminRoutes from "./routes/admin/intent-batch";
import intentBatchUserRoutes from "./routes/user/intent-batch";
import strategyUserRoutes from "./routes/user/strategy";
import serviceEngineRoutes from "./routes/services/engine";
import serviceEventsRoutes from "./routes/services/events";
import serviceExecuteRoutes from "./routes/services/execution";
import { errorHandler } from "./middleware/errorHandler";

const PORT = process.env.PORT || 3000;
const app = express();
// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN, 
  credentials: true,
  secure: true,
};

// Use the CORS middleware with the defined options
app.use(cors(corsOptions));

// Middleware for parsing JSON request bodies
app.use(express.json());

// Route groups
app.use("/auth", authRoutes);
app.use("/user", profileUserRoutes);
app.use("/intent-batch", intentBatchUserRoutes);
app.use("/strategy", strategyUserRoutes);
app.use("/admin/intent-batch", intentBatchAdminRoutes);
app.use("/service", serviceEngineRoutes);
app.use("/service", serviceEventsRoutes);
app.use("/service", serviceExecuteRoutes);

// API documentation endpoint
app.get("/docs", (req, res) => {
  res.send("Placeholder message for the API documentation");
});

// Middleware for error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
