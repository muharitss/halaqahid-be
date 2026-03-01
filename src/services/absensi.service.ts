  import * as absensiRepo from "../repositories/absensi.repository";
  import prisma from "../prisma";

  export const inputAbsensi = async (
    user: { id: number; role: string },
    data: any,
  ) => {
    console.log("DEBUG DATA DARI FE:", data);
    const santriId = Number(data.santri_id);

    if (isNaN(santriId)) {
      const error: any = new Error("santri_id tidak valid atau tidak ditemukan");
      error.status = 400;
      throw error;
    }
    const santri = await prisma.santri.findUnique({
      where: { id_santri: santriId },
    });

    if (!santri) {
      const error: any = new Error("Santri tidak ditemukan");
      error.status = 404;
      throw error;
    }
    if (user.role === "muhafiz") {
      const halaqah = await prisma.halaqah.findFirst({
        where: { muhafiz_id: Number(user.id), deleted_at: null },
      });

      if (!halaqah || santri.halaqah_id !== halaqah.id_halaqah) {
        const error: any = new Error(
          "Akses ditolak: Santri bukan anggota halaqah Anda!",
        );
        error.status = 403;
        throw error;
      }
    }

    const inputDate = data.tanggal ? new Date(data.tanggal) : new Date();
    const startOfDay = new Date(inputDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(inputDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAbsensi = await prisma.absensi.findFirst({
      where: {
        santri_id: santriId,
        tanggal: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existingAbsensi) {
      const error: any = new Error("Santri ini sudah diabsen hari ini!");
      error.status = 400;
      throw error;
    }

    const validStatus = ["HADIR", "IZIN", "SAKIT", "ALFA", "TERLAMBAT"];
    if (!validStatus.includes(data.status)) {
      const error: any = new Error(
        `Status tidak valid. Gunakan: ${validStatus.join(", ")}`,
      );
      error.status = 400;
      throw error;
    }

    return await absensiRepo.createAbsensi({
      santri_id: santriId,
      status: data.status,
      keterangan: data.keterangan || null,
      tanggal: inputDate,
    });
  };

  export const getSantriAbsensiHistory = async (
    santriId: number,
    user: { id: number; role: string },
  ) => {
    const santri = await prisma.santri.findUnique({
      where: { id_santri: santriId },
    });

    if (!santri) {
      const error: any = new Error("Santri tidak ditemukan");
      error.status = 404;
      throw error;
    }

    if (user.role === "muhafiz") {
      const halaqah = await prisma.halaqah.findFirst({
        where: { muhafiz_id: Number(user.id), deleted_at: null },
      });

      if (!halaqah || santri.halaqah_id !== halaqah.id_halaqah) {
        const error: any = new Error(
          "Akses ditolak: Anda tidak berhak melihat absensi santri ini!",
        );
        error.status = 403;
        throw error;
      }
    }

    return await absensiRepo.getAbsensiBySantri(santriId);
  };

  export const updateAbsensi = async (
    id: number,
    user: { id: number; role: string },
    data: any,
  ) => {
    // Cari absensi yang akan diupdate
    const absensi = await prisma.absensi.findUnique({
      where: { id_absensi: id },
      include: {
        santri: true,
      },
    });

    if (!absensi) {
      const error: any = new Error("Absensi tidak ditemukan");
      error.status = 404;
      throw error;
    }

    // Permission check: muhafiz hanya bisa edit absensi santri di halaqahnya
    if (user.role === "muhafiz") {
      const halaqah = await prisma.halaqah.findFirst({
        where: { muhafiz_id: Number(user.id), deleted_at: null },
      });

      if (!halaqah || absensi.santri.halaqah_id !== halaqah.id_halaqah) {
        const error: any = new Error(
          "Akses ditolak: Anda tidak berhak mengedit absensi santri ini!",
        );
        error.status = 403;
        throw error;
      }
    }
    // kepala_muhafiz: bypass pengecekan halaqah

    // Validasi status jika ada
    if (data.status) {
      const validStatus = ["HADIR", "IZIN", "SAKIT", "ALFA", "TERLAMBAT"];
      if (!validStatus.includes(data.status)) {
        const error: any = new Error(
          `Status tidak valid. Gunakan: ${validStatus.join(", ")}`,
        );
        error.status = 400;
        throw error;
      }
    }

    // Update absensi
    return await prisma.absensi.update({
      where: { id_absensi: id },
      data: {
        status: data.status || absensi.status,
        keterangan:
          data.keterangan !== undefined ? data.keterangan : absensi.keterangan,
        tanggal: data.tanggal ? new Date(data.tanggal) : absensi.tanggal,
      },
    });
  };

  /**
   * Input absensi untuk muhafiz/asatidz (oleh kepala_muhafiz)
   */
  export const inputAbsensiAsatidz = async (data: any) => {
    const userId = Number(data.user_id);

    if (isNaN(userId)) {
      const error: any = new Error("user_id tidak valid atau tidak ditemukan");
      error.status = 400;
      throw error;
    }

    // Cek apakah user ada
    const user = await prisma.user.findUnique({
      where: { id_user: userId },
    });

    if (!user) {
      const error: any = new Error("User tidak ditemukan");
      error.status = 404;
      throw error;
    }

    // Validasi status
    const validStatus = ["HADIR", "IZIN", "SAKIT", "ALFA", "TERLAMBAT"];
    if (!validStatus.includes(data.status)) {
      const error: any = new Error(
        `Status tidak valid. Gunakan: ${validStatus.join(", ")}`,
      );
      error.status = 400;
      throw error;
    }

    // Cek apakah sudah ada absensi hari ini untuk user ini
    const inputDate = data.tanggal_absensi
      ? new Date(data.tanggal_absensi)
      : new Date();
    const startOfDay = new Date(inputDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(inputDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAbsensi = await prisma.absensiAsatidz.findFirst({
      where: {
        id_user: userId,
        tanggal_absensi: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existingAbsensi) {
      const error: any = new Error("Muhafiz ini sudah diabsen hari ini!");
      error.status = 400;
      throw error;
    }

    // Simpan absensi asatidz
    return await prisma.absensiAsatidz.create({
      data: {
        id_user: userId,
        status: data.status,
        keterangan: data.keterangan || null,
        tanggal_absensi: inputDate,
      },
    });

    
  };

export const getMonthlyRekapHalaqah = async (
  halaqahId: number,
  user: { id: number; role: string },
  month: number,
  year: number
) => {
  // 1. Validasi Akses (Hanya Muhafiz yang bersangkutan atau Role Atasan)
  if (user.role === "muhafiz") {
    const halaqah = await prisma.halaqah.findFirst({
      where: { id_halaqah: halaqahId, muhafiz_id: Number(user.id) },
    });
    if (!halaqah) {
        const error: any = new Error("Akses ditolak: Ini bukan halaqah Anda");
        error.status = 403;
        throw error;
    }
  }

  // 2. Ambil data mentah dari repository
  const rawData = await absensiRepo.getAbsensiMonthly(halaqahId, month, year);

  // 3. Grouping data per tanggal
  // Kita pastikan format key-nya adalah 'YYYY-MM-DD'
  const grouped = rawData.reduce((acc: any, curr) => {
    // Hilangkan jam/menit/detik, ambil tanggalnya saja
    const dateStr = curr.tanggal.toISOString().split("T")[0];

    if (!acc[dateStr]) acc[dateStr] = [];
    
    acc[dateStr].push({
      santri_id: curr.santri_id,
      status: curr.status,
    });
    
    return acc;
  }, {});

  // 4. Ubah object menjadi array sesuai interface MonthlyAbsensiData di frontend
  return Object.keys(grouped).map((tgl) => ({
    tanggal: tgl,
    data: grouped[tgl],
  }));
};