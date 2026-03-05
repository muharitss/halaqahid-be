import { Request, Response } from "express";
import { asyncHandler } from "../utils/async.handler";
import * as santriRepo from "../repositories/santri.repository";
import * as absensiRepo from "../repositories/absensi.repository";
import * as halaqahRepo from "../repositories/halaqah.repository";
import * as setoranRepo from "../repositories/setoran.repository";
import { successResponse } from "../utils/response";

export const getPublicHalaqah = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await halaqahRepo.getAllHalaqah();

    const formattedData = data.map((h: any) => ({
      id_halaqah: h.id_halaqah,
      nama_halaqah: h.name_halaqah,
      nama_muhafiz: h.muhafiz?.username || "Tanpa Muhafiz",
      jumlah_santri: h._count?.santri || 0,
    }));

    return successResponse(res, "Data halaqah berhasil diambil", formattedData);
  },
);

export const getPublicAbsensiByHalaqah = asyncHandler(
  async (req: Request, res: Response) => {
    const { halaqahId } = req.params;
    const { date } = req.query;

    const data = await absensiRepo.getAbsensiByHalaqah(
      Number(halaqahId),
      date as string,
    );

    const formattedData = data.map((a: any) => ({
      id_absensi: a.id_absensi,
      nama_santri: a.santri?.nama_santri || "Anonim",
      status: a.status,
      keterangan: a.keterangan || "-",
      tanggal: a.tanggal,
    }));

    return successResponse(
      res,
      "Data absensi halaqah berhasil diambil",
      formattedData,
    );
  },
);

export const getAllSetoranPublic = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await setoranRepo.getAllSetoran();

    const formattedData = data.map((item: any) => ({
      id_setoran: item.id_setoran,
      nama_santri: item.santri?.nama_santri || "Anonim",
      nama_halaqah: item.santri?.halaqah?.name_halaqah || "Tanpa Halaqah",
      surat: item.surat,
      ayat: item.ayat,
      juz: item.juz,
      kategori: item.kategori,
      tanggal: item.tanggal_setoran,
    }));

    return successResponse(
      res,
      "Berhasil mengambil semua data setoran",
      formattedData,
    );
  },
);

export const getPublicSantri = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await santriRepo.getAllSantri(undefined);

    const formattedData = data.map((s: any) => ({
      id_santri: s.id_santri,
      nama_santri: s.nama_santri,
      nomor_telepon: s.nomor_telepon || "-",
      nama_halaqah: s.halaqah?.name_halaqah || "Tanpa Halaqah",
    }));

    return successResponse(
      res,
      "Daftar santri berhasil diambil",
      formattedData,
    );
  },
);


export const getPublicSantriDetail = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { month, year } = req.query;

    // Default ke bulan dan tahun sekarang jika tidak ada query param
    const currentMonth = month ? Number(month) : new Date().getMonth() + 1;
    const currentYear = year ? Number(year) : new Date().getFullYear();

    const santri = await santriRepo.getSantriDetailFull(
      Number(id),
      currentMonth,
      currentYear
    );

    if (!santri) {
      return res.status(404).json({ message: "Santri tidak ditemukan" });
    }

    // Format data agar enak dibaca frontend
    const formattedData = {
      profil: {
        id_santri: santri.id_santri,
        nama_santri: santri.nama_santri,
        nomor_telepon: santri.nomor_telepon || "-",
        target: santri.target,
        nama_halaqah: santri.halaqah?.name_halaqah || "Tanpa Halaqah",
        nama_muhafiz: santri.halaqah?.user?.username || "Belum ditentukan",
      },
      statistik_bulanan: {
        bulan: currentMonth,
        tahun: currentYear,
        total_hadir: santri.absensi.filter(a => a.status === "HADIR").length,
        total_setoran: santri.setoran.length,
      },
      riwayat_absensi: santri.absensi.map(a => ({
        id_absensi: a.id_absensi,
        tanggal: a.tanggal,
        status: a.status,
        keterangan: a.keterangan || "-",
      })),
      riwayat_setoran: santri.setoran.map(s => ({
        id_setoran: s.id_setoran,
        tanggal: s.tanggal_setoran,
        juz: s.juz,
        surat: s.surat,
        ayat: s.ayat,
        kategori: s.kategori,
        keterangan: s.keterangan || "-",
      })),
    };

    return successResponse(
      res,
      "Detail data santri berhasil diambil",
      formattedData
    );
  }
);