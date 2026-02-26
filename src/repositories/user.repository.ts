import prisma from "../prisma";

export const findAllMuhafiz = async () => {
  return await prisma.user.findMany({
    where: {
      role: "muhafiz",
      deleted_at: null,
    },
    select: {
      id_user: true,
      username: true,
      email: true,
      role: true,
      halaqah: true,
    },
  });
};

export const findByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const create = async (data: any) => {
  return await prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      password: data.password,
      role: data.role,
    },
  });
};

export const softDelete = async (id: number) => {
  return await prisma.user.update({
    where: {
      id_user: id,
    },
    data: {
      deleted_at: new Date(),
    },
    select: {
      id_user: true,
      email: true,
      role: true,
      deleted_at: true,
    },
  });
};

export const updateUser = async (id: number, data: any) => {
  return await prisma.user.update({
    where: {
      id_user: id,
    },
    data,
    select: {
      id_user: true,
      username: true,
      email: true,
      role: true,
    },
  });
};

export const findAllDeletedMuhafiz = async () => {
  return await prisma.user.findMany({
    where: {
      role: "muhafiz",
      NOT: {
        deleted_at: null,
      },
    },
    select: {
      id_user: true,
      username: true,
      email: true,
      deleted_at: true,
    },
  });
};

export const restoreUser = async (id: number) => {
  return await prisma.user.update({
    where: {
      id_user: id,
    },
    data: {
      deleted_at: null,
    },
    select: {
      id_user: true,
      username: true,
      email: true,
      role: true,
    },
  });
};
