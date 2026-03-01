import { Router } from "express";
import * as halaqahController from "../controllers/halaqah.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

router.use(authMiddleware, roleMiddleware(["superadmin"]));

router.post("/", halaqahController.createHalaqah);
router.get("/", halaqahController.listHalaqah);
router.get("/:id", halaqahController.getHalaqahDetail);
router.patch("/:id", halaqahController.updateHalaqah);
router.delete("/:id", halaqahController.deleteHalaqah);
router.get("/deleted", halaqahController.listDeletedHalaqah);
router.patch("/restore/:id", halaqahController.restoreHalaqah);

export default router;
