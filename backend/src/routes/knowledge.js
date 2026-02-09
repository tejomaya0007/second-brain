import { Router } from "express";
import * as ctrl from "../controllers/knowledgeController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// All knowledge routes require authentication
router.use(auth);

// Notebook routes (legacy compatibility)
router.get("/", ctrl.getAll);
router.get("/search", ctrl.search);
router.get("/:id", ctrl.getById);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

// AI helpers
router.post("/chat", ctrl.chat);
router.post("/summarize", ctrl.summarizeNote);
router.post("/tags", ctrl.generateNoteTags);

// Page routes
router.post("/pages", ctrl.createPage);
router.get("/pages/:id", ctrl.getPage);
router.put("/pages/:id", ctrl.updatePage);
router.delete("/pages/:id", ctrl.deletePage);

export default router;
