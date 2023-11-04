import cors from "cors"

import "dotenv/config"

import express from "express"

import { errorHandler } from "./middleware/errorHandler"

const PORT = process.env.PORT || 3000
const app = express()

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  secure: true,
}

// Use the CORS middleware with the defined options
app.use(cors(corsOptions))

// Middleware for parsing JSON request bodies
app.use(express.json())

// Route groups
// app.use("/auth", authRoutes)
// app.use("/user", profileUserRoutes)
// app.use("/intent-batch", intentBatchUserRoutes)
// app.use("/strategy", strategyUserRoutes)
// app.use("/admin/intent-batch", intentBatchAdminRoutes)
// app.use("/service", serviceEngineRoutes)
// app.use("/service", serviceEventsRoutes)
// app.use("/service", serviceExecuteRoutes)
// app.use("/service", serviceAxiomRoutes)

// Middleware for error handling
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
