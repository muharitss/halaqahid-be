"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAbsensiByHalaqah = exports.getAbsensiBySantri = exports.createAbsensi = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const createAbsensi = async (data) => {
    const { santri_id, ...rest } = data;
    return await prisma_1.default.absensi.create({
        data: {
            ...rest,
            santri: {
                connect: { id_santri: Number(santri_id) },
            },
        },
    });
};
exports.createAbsensi = createAbsensi;
const getAbsensiBySantri = async (santriId) => {
    return await prisma_1.default.absensi.findMany({
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
exports.getAbsensiBySantri = getAbsensiBySantri;
const getAbsensiByHalaqah = async (halaqahId, date) => {
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);
    return await prisma_1.default.absensi.findMany({
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
exports.getAbsensiByHalaqah = getAbsensiByHalaqah;
