import cors from "cors";
import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./docs/swagger-output.json";
import { env } from "./env";
import { errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./routes/auth";
import { axiomQueryRouter } from "./routes/axiom-query";
import { emailPreferencesRouter } from "./routes/email-preferences";
import { intentBatchesRouter } from "./routes/intent-batches";
import { strategiesRouter } from "./routes/strategies";
import { usersRouter } from "./routes/users";

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
app.use("/email-preferences", emailPreferencesRouter);
app.use("/intent-batches", intentBatchesRouter);
app.use("/strategies", strategiesRouter);
app.use("/axiom-query", axiomQueryRouter);

// Documentation
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware for error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
