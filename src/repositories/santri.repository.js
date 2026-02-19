"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeletedSantriById = exports.restoreSantri = exports.updateSantri = exports.deleteSantri = exports.getSantriById = exports.getAllSantri = exports.createSantri = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const createSantri = async (data) => {
    return await prisma_1.default.santri.create({ data });
};
exports.createSantri = createSantri;
const getAllSantri = async (halaqahId) => {
    return await prisma_1.default.santri.findMany({
        where: {
            deleted_at: null,
            ...(halaqahId ? { halaqah_id: halaqahId } : {}),
        },
        include: { halaqah: true },
    });
};
exports.getAllSantri = getAllSantri;
const getSantriById = async (id) => {
    return await prisma_1.default.santri.findUnique({
        where: {
            id_santri: id,
            deleted_at: null,
        },
    });
};
exports.getSantriById = getSantriById;
const deleteSantri = async (id) => {
    return await prisma_1.default.santri.update({
        where: {
            id_santri: id,
        },
        data: {
            deleted_at: new Date(),
        },
    });
};
exports.deleteSantri = deleteSantri;
const updateSantri = async (id, data) => {
    return await prisma_1.default.santri.update({
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
exports.updateSantri = updateSantri;
const restoreSantri = async (id) => {
    return await prisma_1.default.santri.update({
        where: {
            id_santri: id,
        },
        data: {
            deleted_at: null,
        },
    });
};
exports.restoreSantri = restoreSantri;
const getDeletedSantriById = async (id) => {
    return await prisma_1.default.santri.findFirst({
        where: {
            id_santri: id,
            NOT: { deleted_at: null },
        },
    });
};
exports.getDeletedSantriById = getDeletedSantriById;
