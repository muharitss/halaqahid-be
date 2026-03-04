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

  // Cek apakah santri ada
  const santri = await prisma.santri.findUnique({
    where: { id_santri: santriId },
  });

  if (!santri) {
    const error: any = new Error("Santri tidak ditemukan");
    error.status = 404;
    throw error;
  }

  // Permission check: muhafiz hanya bisa input absensi santri di halaqahnya
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

  // Validasi status
  const validStatus = ["HADIR", "IZIN", "SAKIT", "ALFA", "TERLAMBAT"];
  if (!validStatus.includes(data.status)) {
    const error: any = new Error(
      `Status tidak valid. Gunakan: ${validStatus.join(", ")}`,
    );
    error.status = 400;
    throw error;
  }

  const inputDate = data.tanggal ? new Date(data.tanggal) : new Date();
  const startOfDay = new Date(inputDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(inputDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Cek apakah sudah ada absensi hari ini untuk santri ini
  const existingAbsensi = await prisma.absensi.findFirst({
    where: {
      santri_id: santriId,
      tanggal: { gte: startOfDay, lte: endOfDay },
    },
  });

  // JIKA SUDAH ADA, LAKUKAN UPDATE (UPSERT LOGIC)
  if (existingAbsensi) {
    return await prisma.absensi.update({
      where: { id_absensi: existingAbsensi.id_absensi },
      data: {
        status: data.status,
        keterangan: data.keterangan || null,
        // tanggal tidak diupdate agar tetap pada tanggal aslinya
      },
    });
  }

  // JIKA BELUM ADA, BARU CREATE
  return await prisma.absensi.create({
    data: {
      santri_id: santriId,
      status: data.status,
      keterangan: data.keterangan || null,
      tanggal: inputDate,
    },
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

 
  export const inputAbsensiAsatidz = async (data: any) => {
  const userId = Number(data.user_id);
  const inputDate = data.tanggal ? new Date(data.tanggal) : new Date();

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

  const startOfDay = new Date(inputDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(inputDate);
  endOfDay.setHours(23, 59, 59, 999);

  const existing = await prisma.absensiAsatidz.findFirst({
    where: {
      id_user: userId,
      tanggal_absensi: { gte: startOfDay, lte: endOfDay }
    }
  });

  if (existing) {
    // JIKA ADA, UPDATE (Fitur Edit)
    return await prisma.absensiAsatidz.update({
      where: { id_absensi: existing.id_absensi },
      data: { 
        status: data.status,
        keterangan: data.keterangan || null 
      }
    });
  }

  // JIKA TIDAK ADA, CREATE
  return await prisma.absensiAsatidz.create({
    data: {
      id_user: userId,
      status: data.status,
      keterangan: data.keterangan || null,
      tanggal_absensi: inputDate
    }
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

export const getMonthlyRekapAsatidz = async (month: number, year: number) => {
  // 1. Ambil data mentah
  const rawData = await absensiRepo.getAbsensiAsatidzMonthly(month, year);

  // 2. Grouping data per tanggal
  const grouped = rawData.reduce((acc: any, curr) => {
    const dateStr = curr.tanggal_absensi.toISOString().split("T")[0];

    if (!acc[dateStr]) acc[dateStr] = [];

    acc[dateStr].push({
      id_absensi: curr.id_absensi,
      id_user: curr.id_user,
      nama_asatidz: curr.user.username,
      status: curr.status,
      keterangan: curr.keterangan
    });

    return acc;
  }, {});

  // 3. Transform ke array
  return Object.keys(grouped).map((tgl) => ({
    tanggal: tgl,
    data: grouped[tgl],
  }));
};

export const updateAbsensiAsatidz = async (
  id: number,
  data: any
) => {
  const absensi = await prisma.absensiAsatidz.findUnique({
    where: { id_absensi: id },
  });

  if (!absensi) {
    const error: any = new Error("Data absensi asatidz tidak ditemukan");
    error.status = 404;
    throw error;
  }

  // Validasi status jika dikirim
  if (data.status) {
    const validStatus = ["HADIR", "IZIN", "SAKIT", "ALFA", "TERLAMBAT"];
    if (!validStatus.includes(data.status)) {
      const error: any = new Error(`Status tidak valid`);
      error.status = 400;
      throw error;
    }
  }

  return await prisma.absensiAsatidz.update({
    where: { id_absensi: id },
    data: {
      status: data.status || absensi.status,
      keterangan: data.keterangan !== undefined ? data.keterangan : absensi.keterangan,
      tanggal_absensi: data.tanggal_absensi ? new Date(data.tanggal_absensi) : absensi.tanggal_absensi,
    },
  });
};

export const getAllMonthlyRekapSantri = async (month: number, year: number) => {
  // 1. Ambil data mentah dari repo
  const rawData = await absensiRepo.getAllSantriAbsensiMonthly(month, year);

  // 2. Grouping per tanggal
  const grouped = rawData.reduce((acc: any, curr) => {
    const dateStr = curr.tanggal.toISOString().split("T")[0];

    if (!acc[dateStr]) acc[dateStr] = [];
    
    acc[dateStr].push({
      id_absensi: curr.id_absensi,
      santri_id: curr.santri_id,
      nama_santri: curr.santri.nama_santri,
      name_halaqah: curr.santri.halaqah?.name_halaqah || "Tanpa Halaqah",
      status: curr.status,
      keterangan: curr.keterangan
    });
    
    return acc;
  }, {});

  // 3. Transform ke format array tanggal
  return Object.keys(grouped).map((tgl) => ({
    tanggal: tgl,
    data: grouped[tgl],
  }));
};