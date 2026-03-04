// src/routes/absensi.route.ts
import { Router } from "express";
import * as absensiController from "../controllers/absensi.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", absensiController.create);

router.get("/santri/:santriId", absensiController.getBySantri);

router.get("/halaqah/:halaqahId", absensiController.getByHalaqah);

router.get(
  "/asatidz/rekap",
  roleMiddleware(["kepala_muhafiz", "superadmin"]),
  absensiController.getAsatidzMonthly
);

router.get(
  "/santri/rekap/all",
  roleMiddleware(["kepala_muhafiz", "superadmin"]),
  absensiController.getAllSantriMonthly
);

// V2: Edit absensi (untuk perbaikan human error)
router.patch(
  "/:id",
  roleMiddleware(["muhafiz", "kepala_muhafiz"]),
  absensiController.update,
);

router.patch(
  "/asatidz/:id",
  roleMiddleware(["kepala_muhafiz", "superadmin"]),
  absensiController.updateAsatidz
);

// V2: Input absensi asatidz (hanya kepala_muhafiz)
router.post(
  "/asatidz",
  roleMiddleware(["kepala_muhafiz", "superadmin"]),
  absensiController.createAsatidz,
);



export default router;
