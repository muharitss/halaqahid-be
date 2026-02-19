"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreHalaqah = exports.getDeletedHalaqah = exports.deleteHalaqah = exports.updateHalaqah = exports.getHalaqahById = exports.getAllHalaqah = exports.createHalaqah = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const createHalaqah = async (name_halaqah, muhafiz_id) => {
    return await prisma_1.default.halaqah.create({
        data: {
            name_halaqah,
            muhafiz_id,
        },
        include: { user: true },
    });
};
exports.createHalaqah = createHalaqah;
const getAllHalaqah = async () => {
    return await prisma_1.default.halaqah.findMany({
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
exports.getAllHalaqah = getAllHalaqah;
const getHalaqahById = async (id) => {
    return await prisma_1.default.halaqah.findUnique({
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
exports.getHalaqahById = getHalaqahById;
const updateHalaqah = async (id, data) => {
    return await prisma_1.default.halaqah.update({
        where: { id_halaqah: id },
        data,
    });
};
exports.updateHalaqah = updateHalaqah;
const deleteHalaqah = async (id) => {
    return await prisma_1.default.halaqah.update({
        where: { id_halaqah: id },
        data: {
            deleted_at: new Date(),
        },
    });
};
exports.deleteHalaqah = deleteHalaqah;
const getDeletedHalaqah = async () => {
    return await prisma_1.default.halaqah.findMany({
        where: { NOT: { deleted_at: null } },
    });
};
exports.getDeletedHalaqah = getDeletedHalaqah;
const restoreHalaqah = async (id) => {
    return await prisma_1.default.halaqah.update({
        where: {
            id_halaqah: id,
        },
        data: {
            deleted_at: null,
        },
    });
};
exports.restoreHalaqah = restoreHalaqah;
