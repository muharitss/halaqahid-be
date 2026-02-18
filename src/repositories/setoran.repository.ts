import prisma from "../prisma";

export const createSetoran = async (data: any) => {
  return await prisma.setoran.create({ data });
};

export const getSetoranBySantri = async (santriId: number) => {
  return await prisma.setoran.findMany({
    where: {
      id_santri: santriId,
    },
    orderBy: {
      tanggal_setoran: "desc",
    },
  });
};

export const getAllSetoran = async (startDate?: Date, endDate?: Date) => {
  const whereClause: any = {
    santri: {
      deleted_at: null,
    },
  };

  // Tambahkan filter tanggal jika parameter diberikan
  if (startDate || endDate) {
    whereClause.tanggal_setoran = {};
    if (startDate) {
      whereClause.tanggal_setoran.gte = startDate;
    }
    if (endDate) {
      whereClause.tanggal_setoran.lte = endDate;
    }
  }

  return await prisma.setoran.findMany({
    where: whereClause,
    include: {
      santri: {
        select: {
          nama_santri: true,
          halaqah: {
            select: {
              name_halaqah: true,
            },
          },
        },
      },
    },
    orderBy: {
      tanggal_setoran: "desc",
    },
  });
};
