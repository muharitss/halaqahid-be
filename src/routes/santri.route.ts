import { Router } from "express";
import * as santriController from "../controllers/santri.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", santriController.getSantri);
router.post("/", santriController.createSantri);
router.patch("/:id", santriController.updateSantri);
router.delete("/:id", santriController.deleteSantri);
router.patch("/:id/restore", santriController.restoreSantri);

export default router;
