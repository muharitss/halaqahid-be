import prisma from "../prisma";

export const createAbsensi = async (data: any) => {
  const { santri_id, ...rest } = data;
  return await prisma.absensi.create({
    data: {
      ...rest,
      santri: {
        connect: { id_santri: Number(santri_id) },
      },
    },
  });
};

export const getAbsensiBySantri = async (santriId: number) => {
  return await prisma.absensi.findMany({
    where: {
      santri_id: santriId,
      santri: {
        deleted_at: null,
      },
    },
    orderBy: {
      tanggal: "desc",
    },
  });
};

export const getAbsensiByHalaqah = async (halaqahId: number, date?: string) => {
  const targetDate = date ? new Date(date) : new Date();

  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  return await prisma.absensi.findMany({
    where: {
      santri: {
        halaqah_id: halaqahId,
        deleted_at: null,
      },
      tanggal: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      santri: {
        select: {
          nama_santri: true,
        },
      },
    },
    orderBy: {
      tanggal: "desc",
    },
  });
};
