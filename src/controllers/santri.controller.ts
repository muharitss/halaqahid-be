import { Request, Response } from "express";
import { asyncHandler } from "../utils/async.handler";
import * as santriService from "../services/santri.service";
import { successResponse } from "../utils/response";

export const getSantri = asyncHandler(async (req: any, res: Response) => {
  const user = req.user;
  const result = await santriService.getSantriList(user);

  return successResponse(res, "Daftar santri berhasil di ambil", result);
});

export const createSantri = asyncHandler(async (req: any, res: Response) => {
  const user = req.user;
  const data = req.body;
  const result = await santriService.createNewSantri(user, data);

  return successResponse(res, "Santri berhasil ditambahkan", result);
});

export const updateSantri = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const data = req.body;

  const result = await santriService.updateExistingSantri(
    Number(id),
    user,
    data
  );
  return successResponse(res, "Santri berhasil diupdate", result);
});

export const deleteSantri = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  const result = await santriService.deleteSantri(Number(id), user);
  return successResponse(res, "Santri berhasil dihapus", result);
});

export const restoreSantri = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await santriService.restoreSantriAccount(Number(id));
    return successResponse(res, "Santri berhasil di-restore", result);
  }
);
