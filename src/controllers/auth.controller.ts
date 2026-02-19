import { Request, Response } from "express";
import { asyncHandler } from "../utils/async.handler";
import * as authService from "../services/auth.service";
import { successResponse } from "../utils/response";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  return successResponse(res, "Login berhasil", result);
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.registerMuhafiz(req.body);
  return successResponse(res, "Register berhasil", result);
});

export const getAllmuhafiz = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await authService.getAllmuhafiz();
    return successResponse(res, "Data muhafiz berhasil diambil", result);
  }
);

export const deletemuhafiz = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await authService.deleteMuhafiz(Number(id));
    return successResponse(res, "Data muhafiz berhasil dihapus", result);
  }
);

export const updateMuhafiz = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, email } = req.body;

    const result = await authService.updateMuhafiz(Number(id), {
      username,
      email,
    });

    return successResponse(res, "Data muhafiz berhasil diupdate", result);
  }
);

export const impersonate = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await authService.impersonateMuhafiz(Number(id));

  return successResponse(res, "Impersonate berhasil", result);
});

export const listDeletedMuhafiz = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await authService.getDeletedMuhafiz();
    return successResponse(
      res,
      "Daftar muhafiz terhapus berhasil diambil",
      result
    );
  }
);

export const restoreMuhafiz = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await authService.restoreMuhafizAccount(Number(id));
    return successResponse(
      res,
      "Akun muhafiz berhasil diaktifkan kembali",
      result
    );
  }
);

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  // Pastikan middleware auth Anda sudah menyimpan data user di req.user
  // Biasanya: const user = req.user; 
  const userId = (req as any).user.id; 

  const result = await authService.getMe(Number(userId));
  return successResponse(res, "Data profil berhasil diambil", result);
});