import prisma from "../prisma";
import * as setoranRepo from "../repositories/setoran.repository";

export const inputSetoran = async (
  user: { id: number; role: string },
  data: any,
) => {
  // Updated kategori validation untuk include INTENS dan BACAAN
  const validKategori = ["MURAJAAH", "ZIYADAH", "INTENS", "BACAAN"];
  if (data.kategori && !validKategori.includes(data.kategori)) {
    const error: any = new Error(
      `Kategori harus salah satu dari: ${validKategori.join(", ")}`,
    );
    error.status = 400;
    throw error;
  }

  const santri = await prisma.santri.findUnique({
    where: {
      id_santri: data.santri_id,
    },
    include: {
      halaqah: true,
    },
  });

  if (!santri) {
    const error: any = new Error("Santri tidak ditemukan");
    error.status = 404;
    throw error;
  }

  // Permission check: muhafiz hanya bisa input setoran untuk santri di halaqahnya
  // kepala_muhafiz: bypass pengecekan halaqah (bisa input untuk santri mana saja)
  if (user.role === "muhafiz") {
    const halaqahMuhafiz = await prisma.halaqah.findFirst({
      where: {
        id_muhafiz: Number(user.id),
      },
    });
    if (!halaqahMuhafiz || santri.halaqah_id !== halaqahMuhafiz.id_halaqah) {
      const error: any = new Error(
        "Akses ditolak: Santri ini bukan anggota halaqah Anda!",
      );
      error.status = 403;
      throw error;
    }
  }
  // kepala_muhafiz dan role lain yang diizinkan: skip pengecekan halaqah

  // Custom tanggal_setoran: gunakan data.tanggal_setoran jika ada, jika tidak gunakan new Date()
  const tanggalSetoran = data.tanggal_setoran
    ? new Date(data.tanggal_setoran)
    : new Date();

  return await setoranRepo.createSetoran({
    ...data,
    tanggal_setoran: tanggalSetoran,
  });
};

export const getSantriHistory = async (
  santriId: number,
  user: { id: number; role: string },
) => {
  const santri = await prisma.santri.findUnique({
    where: {
      id_santri: santriId,
    },
  });
  if (!santri) {
    const error: any = new Error("Santri tidak ditemukan");
    error.status = 404;
    throw error;
  }

  if (user.role === "muhafiz") {
    const halaqah = await prisma.halaqah.findFirst({
      where: {
        id_muhafiz: Number(user.id),
        deleted_at: null,
      },
    });
    if (santri.halaqah_id !== halaqah?.id_halaqah) {
      const error: any = new Error(
        "Akses ditolak: Santri ini bukan anggota halaqah Anda!",
      );
      error.status = 403;
      throw error;
    }
  }
  return await setoranRepo.getSetoranBySantri(santriId);
};

export const getAllSetoran = async (startDate?: Date, endDate?: Date) => {
  return await setoranRepo.getAllSetoran(startDate, endDate);
};
