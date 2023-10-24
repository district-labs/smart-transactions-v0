import 'dotenv/config'
import express from "express";
import cors from "cors";
import intentBatchAdminRoutes from "./routes/admin/intent-batch";
import intentBatchUserRoutes from "./routes/user/intent-batch";
import { errorHandler } from "./middleware/errorHandler";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors()) // include before other routes

// Middleware for parsing JSON request bodies
app.use(express.json());

// Route groups
app.use("/intent-batch", intentBatchUserRoutes);
app.use("/admin/intent-batch", intentBatchAdminRoutes);

// API documentation endpoint
app.get("/docs", (req, res) => {
  res.send("Placeholder message for the API documentation");
});

// Middleware for error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
