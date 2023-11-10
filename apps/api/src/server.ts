import cors from "cors";
import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./docs/swagger-output.json";
import { env } from "./env";
import { errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./routes/auth";
import { intentBatchesRouter } from "./routes/intent-batches";
import { usersRouter } from "./routes/users";


// import intentBatchAdminRoutes from "./routes/admin/intent-batch";
// import serviceAxiomRoutes from "./routes/services/axiom";
// import serviceEventsRoutes from "./routes/services/events";
// import infraIntentBatchRoutes from "./routes/stale/infra/intent-batch";
// import intentBatchUserRoutes from "./routes/stale/user/intent-batch";
// import profileUserRoutes from "./routes/stale/user/profile";
// import strategyUserRoutes from "./routes/stale/user/strategy";

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
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/intent-batches", intentBatchesRouter);
// app.use("/user", profileUserRoutes);
// app.use("/intent-batch", intentBatchUserRoutes);
// app.use("/strategy", strategyUserRoutes);
// app.use("/admin/intent-batch", intentBatchAdminRoutes);
// app.use("/service", serviceEventsRoutes);
// app.use("/service", serviceAxiomRoutes);
// app.use("/infra", infraIntentBatchRoutes);

// Documentation
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware for error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
