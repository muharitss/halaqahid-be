import { Response } from "express";
import { asyncHandler } from "../utils/async.handler";
import { successResponse } from "../utils/response";
import * as absensiService from "../services/absensi.service";
import * as absensiRepo from "../repositories/absensi.repository";

export const create = asyncHandler(async (req: any, res: Response) => {
  const result = await absensiService.inputAbsensi(req.user, req.body);

  return successResponse(
    res,
    "Absensi berhasil dicatat",
    result,
    undefined,
    201,
  );
});

export const getBySantri = asyncHandler(async (req: any, res: Response) => {
  const { santriId } = req.params;

  const result = await absensiService.getSantriAbsensiHistory(
    Number(santriId),
    req.user,
  );

  return successResponse(
    res,
    "History absensi santri berhasil diambil",
    result,
  );
});

export const getByHalaqah = asyncHandler(async (req: any, res: Response) => {
  const { halaqahId } = req.params;
  const { date } = req.query;

  const result = await absensiRepo.getAbsensiByHalaqah(
    Number(halaqahId),
    date as string,
  );

  return successResponse(res, "Data absensi halaqah berhasil diambil", result);
});

export const update = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;

  const result = await absensiService.updateAbsensi(
    Number(id),
    req.user,
    req.body,
  );

  return successResponse(res, "Absensi berhasil diupdate", result);
});

export const createAsatidz = asyncHandler(async (req: any, res: Response) => {
  const result = await absensiService.inputAbsensiAsatidz(req.body);

  return successResponse(
    res,
    "Absensi asatidz berhasil dicatat",
    result,
    undefined,
    201,
  );
});
