import { Router } from "express";
import * as displayController from "../controllers/display.controller";

const router = Router();

router.get(
  "/absensi/halaqah/:halaqahId",
  displayController.getPublicAbsensiByHalaqah,
);
router.get("/halaqah", displayController.getPublicHalaqah);
router.get("/setoran/all", displayController.getAllSetoranPublic);
router.get("/santri", displayController.getPublicSantri);

export default router;
