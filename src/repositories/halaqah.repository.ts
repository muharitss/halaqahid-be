import prisma from "../prisma";

export const createHalaqah = async (
  name_halaqah: string,
  id_muhafiz: number,
) => {
  return await prisma.halaqah.create({
    data: {
      name_halaqah,
      id_muhafiz,
    },
    include: { user: true },
  });
};

export const getAllHalaqah = async () => {
  return await prisma.halaqah.findMany({
    where: {
      deleted_at: null,
    },
    include: {
      user: {
        select: { id_user: true, username: true, email: true },
      },
      santri: {
        where: {
          deleted_at: null,
        },
        select: {
          id_santri: true,
          nama_santri: true,
          nomor_telepon: true,
          target: true,
        },
      },
      _count: {
        select: { santri: { where: { deleted_at: null } } },
      },
    },
  });
};

export const getHalaqahById = async (id: number) => {
  return await prisma.halaqah.findUnique({
    where: {
      id_halaqah: id,
      deleted_at: null,
    },
    include: {
      user: true,
      santri: true,
    },
  });
};

export const updateHalaqah = async (
  id: number,
  data: { name_halaqah: string; id_muhafiz: number },
) => {
  return await prisma.halaqah.update({
    where: { id_halaqah: id },
    data,
  });
};

export const deleteHalaqah = async (id: number) => {
  return await prisma.halaqah.update({
    where: { id_halaqah: id },
    data: {
      deleted_at: new Date(),
    },
  });
};

export const getDeletedHalaqah = async () => {
  return await prisma.halaqah.findMany({
    where: { NOT: { deleted_at: null } },
  });
};

export const restoreHalaqah = async (id: number) => {
  return await prisma.halaqah.update({
    where: {
      id_halaqah: id,
    },
    data: {
      deleted_at: null,
    },
  });
};
