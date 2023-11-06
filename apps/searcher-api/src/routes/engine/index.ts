import { Router } from "express"

import { engineController } from "../../controllers/engine"

const engineRoutes = Router()

engineRoutes.get("/engine/:id", engineController.executeIntentBatchSingle)

export { engineRoutes }
