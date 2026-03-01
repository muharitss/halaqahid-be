// src/routes/absensi.route.ts
import { Router } from "express";
import * as absensiController from "../controllers/absensi.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", absensiController.create);

router.get("/santri/:santriId", absensiController.getBySantri);

router.get("/muhafiz/:muhafizId", absensiController.getByMuhafiz);

router.get("/halaqah/:halaqahId", absensiController.getByHalaqah);

// V2: Edit absensi (untuk perbaikan human error)
router.patch(
  "/:id",
  roleMiddleware(["muhafiz", "kepala_muhafiz"]),
  absensiController.update,
);

// V2: Input absensi asatidz (hanya kepala_muhafiz)
router.post(
  "/asatidz",
  roleMiddleware(["kepala_muhafiz", "superadmin"]),
  absensiController.createAsatidz,
);



export default router;
