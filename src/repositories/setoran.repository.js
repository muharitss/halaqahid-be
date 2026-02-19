"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSetoran = exports.getSetoranBySantri = exports.createSetoran = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const createSetoran = async (data) => {
    return await prisma_1.default.setoran.create({ data });
};
exports.createSetoran = createSetoran;
const getSetoranBySantri = async (santriId) => {
    return await prisma_1.default.setoran.findMany({
        where: {
            id_santri: santriId,
        },
        orderBy: {
            tanggal_setoran: "desc",
        },
    });
};
exports.getSetoranBySantri = getSetoranBySantri;
const getAllSetoran = async (startDate, endDate) => {
    const whereClause = {
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
    return await prisma_1.default.setoran.findMany({
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
exports.getAllSetoran = getAllSetoran;
