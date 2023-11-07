import cors from "cors";
import "dotenv/config";
import express from "express";
import { env } from "./env";
import { errorHandler } from "./middleware/errorHandler";
import intentBatchAdminRoutes from "./routes/admin/intent-batch";
import authRoutes from "./routes/auth";
import infraIntentBatchRoutes from "./routes/infra/intent-batch";
import serviceAxiomRoutes from "./routes/services/axiom";
import serviceEventsRoutes from "./routes/services/events";
import intentBatchUserRoutes from "./routes/user/intent-batch";
import profileUserRoutes from "./routes/user/profile";
import strategyUserRoutes from "./routes/user/strategy";

const PORT = env.PORT;
const app = express();
// CORS configuration
const corsOptions = {
  origin: env.CORS_ORIGIN,
  credentials: true,
  secure: process.env.NODE_ENV === "production" ? true : false,
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
app.use("/service", serviceEventsRoutes);
app.use("/service", serviceAxiomRoutes);
app.use("/infra", infraIntentBatchRoutes);

// API documentation endpoint
app.get("/docs", (req, res) => {
  res.send("Placeholder message for the API documentation");
});

// Middleware for error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
