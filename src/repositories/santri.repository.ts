import prisma from "../prisma";

export const createSantri = async (data: {
  nama_santri: string;
  nomor_telepon: string;
  target: any;
  halaqah_id: number;
}) => {
  return await prisma.santri.create({ data });
};

export const getAllSantri = async (halaqahId?: number) => {
  return await prisma.santri.findMany({
    where: {
      deleted_at: null,
      ...(halaqahId ? { halaqah_id: halaqahId } : {}),
    },
    include: { halaqah: true },
  });
};

export const getSantriById = async (id: number) => {
  return await prisma.santri.findUnique({
    where: {
      id_santri: id,
      deleted_at: null,
    },
  });
};

export const deleteSantri = async (id: number) => {
  return await prisma.santri.update({
    where: {
      id_santri: id,
    },
    data: {
      deleted_at: new Date(),
    },
  });
};

export const updateSantri = async (id: number, data: any) => {
  return await prisma.santri.update({
    where: {
      id_santri: id,
    },
    data: {
      nama_santri: data.nama_santri,
      nomor_telepon: data.nomor_telepon,
      target: data.target,
      halaqah_id: data.halaqah_id,
    },
    include: {
      halaqah: true,
    },
  });
};

export const restoreSantri = async (id: number) => {
  return await prisma.santri.update({
    where: {
      id_santri: id,
    },
    data: {
      deleted_at: null,
    },
  });
};

export const getDeletedSantriById = async (id: number) => {
  return await prisma.santri.findFirst({
    where: {
      id_santri: id,
      NOT: { deleted_at: null },
    },
  });
};
