import { asyncHandler } from "../utils/async.handler";
import { Request, Response } from "express";
import * as halaqahRepository from "../repositories/halaqah.repository";
import { successResponse } from "../utils/response";

export const createHalaqah = asyncHandler(
  async (req: Request, res: Response) => {
    const { name_halaqah, muhafiz_id } = req.body;
    const halaqah = await halaqahRepository.createHalaqah(
      name_halaqah,
      muhafiz_id
    );
    return successResponse(res, "Halaqah berhasil dibuat", halaqah);
  }
);

export const listHalaqah = asyncHandler(
  async (_req: Request, res: Response) => {
    const halaqahs = await halaqahRepository.getAllHalaqah();
    return successResponse(res, "Data halaqah berhasil diambil", halaqahs);
  }
);

export const updateHalaqah = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = await halaqahRepository.updateHalaqah(Number(id), req.body);
    return successResponse(res, "Halaqah berhasil diupdate", updated);
  }
);

export const deleteHalaqah = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await halaqahRepository.deleteHalaqah(Number(id));
    return successResponse(res, "Halaqah berhasil dihapus", deleted);
  }
);

export const listDeletedHalaqah = asyncHandler(
  async (_req: Request, res: Response) => {
    const deleted = await halaqahRepository.getDeletedHalaqah();
    return successResponse(res, "Data halaqah berhasil diambil", deleted);
  }
);

export const restoreHalaqah = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const restored = await halaqahRepository.restoreHalaqah(Number(id));
    return successResponse(res, "Halaqah berhasil dihapus", restored);
  }
);

export const getHalaqahDetail = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const halaqah = await halaqahRepository.getHalaqahById(Number(id));

    if (!halaqah) {
      return res.status(404).json({
        success: false,
        message: "Halaqah tidak ditemukan",
      });
    }

    return successResponse(res, "Detail halaqah berhasil diambil", halaqah);
  }
);
