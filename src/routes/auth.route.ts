import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { successResponse } from "../utils/response";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

router.post("/login", authController.login);

router.get("/me", authMiddleware, authController.getMe);

router.post(
  "/register",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  authController.register
);

router.get(
  "/muhafiz",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  authController.getAllmuhafiz
);

router.delete(
  "/muhafiz/:id",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  authController.deletemuhafiz
);

router.patch(
  "/muhafiz/:id",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  authController.updateMuhafiz
);

router.post(
  "/impersonate/:id",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  authController.impersonate
);

router.get(
  "/muhafiz/deleted",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  authController.listDeletedMuhafiz
);

router.patch(
  "/muhafiz/restore/:id",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  authController.restoreMuhafiz
);

export default router;
