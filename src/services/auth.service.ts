import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userRepo from "../repositories/user.repository";
import prisma from "../prisma";

export const getAllmuhafiz = async () => {
  return await userRepo.findAllMuhafiz();
};

export const login = async (data: any) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: data.email,
        },
        {
          username: data.username,
        },
      ],
      deleted_at: null,
    },
  });

  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    const error: any = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is missing");
  }

  const token = jwt.sign({ id: user.id_user, role: user.role }, jwtSecret, {
    expiresIn: "7d",
  });

  const { password: _, ...userResponse } = user;

  return { user: userResponse, token };
};

export const registerMuhafiz = async (data: any) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
      username: data.username,
    },
  });
  if (existingUser) {
    const error: any = new Error("User already exists");
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newUser = await userRepo.create({
    email: data.email,
    username: data.username,
    password: hashedPassword,
    role: "muhafiz",
  });

  const { password: _, ...userResponse } = newUser;
  return userResponse;
};

export const deleteMuhafiz = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id_user: id,
    },
  });

  if (!user) {
    const error: any = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return await userRepo.softDelete(id);
};

export const updateMuhafiz = async (
  id: number,
  data: { username?: string; email?: string }
) => {
  const user = await prisma.user.findUnique({ where: { id_user: id } });
  if (!user) {
    const error: any = new Error("User tidak ditemukan");
    error.status = 404;
    throw error;
  }

  if (data.username && data.username !== user.username) {
    const existingUser = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUser) {
      const error: any = new Error("Username already exists");
      error.status = 400;
      throw error;
    }
  }
  return await userRepo.updateUser(id, data);
};

export const impersonateMuhafiz = async (muhafizId: number) => {
  const user = await prisma.user.findUnique({ where: { id_user: muhafizId } });

  if (!user || user.deleted_at || user.role !== "muhafiz") {
    const error: any = new Error(
      "Muhafiz tidak ditemukan atau bukan merupakan muhafiz"
    );
    error.status = 404;
    throw error;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is missing");
  }

  const token = jwt.sign({ id: user.id_user, role: user.role }, jwtSecret, {
    expiresIn: "7d",
  });

  const { password: _, ...userResponse } = user;

  return { user: userResponse, token };
};

export const getDeletedMuhafiz = async () => {
  return await userRepo.findAllDeletedMuhafiz();
};

export const restoreMuhafizAccount = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id_user: id },
  });

  if (!user) {
    const error: any = new Error("User tidak ditemukan");
    error.status = 404;
    throw error;
  }

  if (user.role !== "muhafiz") {
    const error: any = new Error("User tersebut bukan merupakan muhafiz");
    error.status = 400;
    throw error;
  }

  if (user.deleted_at === null) {
    const error: any = new Error("User ini sudah dalam status aktif");
    error.status = 400;
    throw error;
  }

  return await userRepo.restoreUser(id);
};
