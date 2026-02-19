"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputAbsensiAsatidz = exports.updateAbsensi = exports.getSantriAbsensiHistory = exports.inputAbsensi = void 0;
const absensiRepo = __importStar(require("../repositories/absensi.repository"));
const prisma_1 = __importDefault(require("../prisma"));
const inputAbsensi = async (user, data) => {
    console.log("DEBUG DATA DARI FE:", data);
    const santriId = Number(data.santri_id);
    if (isNaN(santriId)) {
        const error = new Error("santri_id tidak valid atau tidak ditemukan");
        error.status = 400;
        throw error;
    }
    const santri = await prisma_1.default.santri.findUnique({
        where: { id_santri: santriId },
    });
    if (!santri) {
        const error = new Error("Santri tidak ditemukan");
        error.status = 404;
        throw error;
    }
    if (user.role === "muhafiz") {
        const halaqah = await prisma_1.default.halaqah.findFirst({
            where: { muhafiz_id: Number(user.id), deleted_at: null },
        });
        if (!halaqah || santri.halaqah_id !== halaqah.id_halaqah) {
            const error = new Error("Akses ditolak: Santri bukan anggota halaqah Anda!");
            error.status = 403;
            throw error;
        }
    }
    const inputDate = data.tanggal ? new Date(data.tanggal) : new Date();
    const startOfDay = new Date(inputDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(inputDate);
    endOfDay.setHours(23, 59, 59, 999);
    const existingAbsensi = await prisma_1.default.absensi.findFirst({
        where: {
            santri_id: santriId,
            tanggal: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
    });
    if (existingAbsensi) {
        const error = new Error("Santri ini sudah diabsen hari ini!");
        error.status = 400;
        throw error;
    }
    const validStatus = ["HADIR", "IZIN", "SAKIT", "ALFA", "TERLAMBAT"];
    if (!validStatus.includes(data.status)) {
        const error = new Error(`Status tidak valid. Gunakan: ${validStatus.join(", ")}`);
        error.status = 400;
        throw error;
    }
    return await absensiRepo.createAbsensi({
        santri_id: santriId,
        status: data.status,
        keterangan: data.keterangan || null,
        tanggal: inputDate,
    });
};
exports.inputAbsensi = inputAbsensi;
const getSantriAbsensiHistory = async (santriId, user) => {
    const santri = await prisma_1.default.santri.findUnique({
        where: { id_santri: santriId },
    });
    if (!santri) {
        const error = new Error("Santri tidak ditemukan");
        error.status = 404;
        throw error;
    }
    if (user.role === "muhafiz") {
        const halaqah = await prisma_1.default.halaqah.findFirst({
            where: { muhafiz_id: Number(user.id), deleted_at: null },
        });
        if (!halaqah || santri.halaqah_id !== halaqah.id_halaqah) {
            const error = new Error("Akses ditolak: Anda tidak berhak melihat absensi santri ini!");
            error.status = 403;
            throw error;
        }
    }
    return await absensiRepo.getAbsensiBySantri(santriId);
};
exports.getSantriAbsensiHistory = getSantriAbsensiHistory;
/**
 * Update absensi dengan permission check berdasarkan role
 * - muhafiz: hanya bisa edit absensi santri di halaqahnya
 * - kepala_muhafiz: bypass check, bisa edit semua absensi
 */
const updateAbsensi = async (id, user, data) => {
    // Cari absensi yang akan diupdate
    const absensi = await prisma_1.default.absensi.findUnique({
        where: { id_absensi: id },
        include: {
            santri: true,
        },
    });
    if (!absensi) {
        const error = new Error("Absensi tidak ditemukan");
        error.status = 404;
        throw error;
    }
    // Permission check: muhafiz hanya bisa edit absensi santri di halaqahnya
    if (user.role === "muhafiz") {
        const halaqah = await prisma_1.default.halaqah.findFirst({
            where: { muhafiz_id: Number(user.id), deleted_at: null },
        });
        if (!halaqah || absensi.santri.halaqah_id !== halaqah.id_halaqah) {
            const error = new Error("Akses ditolak: Anda tidak berhak mengedit absensi santri ini!");
            error.status = 403;
            throw error;
        }
    }
    // kepala_muhafiz: bypass pengecekan halaqah
    // Validasi status jika ada
    if (data.status) {
        const validStatus = ["HADIR", "IZIN", "SAKIT", "ALFA", "TERLAMBAT"];
        if (!validStatus.includes(data.status)) {
            const error = new Error(`Status tidak valid. Gunakan: ${validStatus.join(", ")}`);
            error.status = 400;
            throw error;
        }
    }
    // Update absensi
    return await prisma_1.default.absensi.update({
        where: { id_absensi: id },
        data: {
            status: data.status || absensi.status,
            keterangan: data.keterangan !== undefined ? data.keterangan : absensi.keterangan,
            tanggal: data.tanggal ? new Date(data.tanggal) : absensi.tanggal,
        },
    });
};
exports.updateAbsensi = updateAbsensi;
/**
 * Input absensi untuk muhafiz/asatidz (oleh kepala_muhafiz)
 */
const inputAbsensiAsatidz = async (data) => {
    const userId = Number(data.user_id);
    if (isNaN(userId)) {
        const error = new Error("user_id tidak valid atau tidak ditemukan");
        error.status = 400;
        throw error;
    }
    // Cek apakah user ada
    const user = await prisma_1.default.user.findUnique({
        where: { id_user: userId },
    });
    if (!user) {
        const error = new Error("User tidak ditemukan");
        error.status = 404;
        throw error;
    }
    // Validasi status
    const validStatus = ["HADIR", "IZIN", "SAKIT", "ALFA", "TERLAMBAT"];
    if (!validStatus.includes(data.status)) {
        const error = new Error(`Status tidak valid. Gunakan: ${validStatus.join(", ")}`);
        error.status = 400;
        throw error;
    }
    // Cek apakah sudah ada absensi hari ini untuk user ini
    const inputDate = data.tanggal_absensi
        ? new Date(data.tanggal_absensi)
        : new Date();
    const startOfDay = new Date(inputDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(inputDate);
    endOfDay.setHours(23, 59, 59, 999);
    const existingAbsensi = await prisma_1.default.absensiAsatidz.findFirst({
        where: {
            id_user: userId,
            tanggal_absensi: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
    });
    if (existingAbsensi) {
        const error = new Error("Muhafiz ini sudah diabsen hari ini!");
        error.status = 400;
        throw error;
    }
    // Simpan absensi asatidz
    return await prisma_1.default.absensiAsatidz.create({
        data: {
            id_user: userId,
            status: data.status,
            keterangan: data.keterangan || null,
            tanggal_absensi: inputDate,
        },
    });
};
exports.inputAbsensiAsatidz = inputAbsensiAsatidz;
