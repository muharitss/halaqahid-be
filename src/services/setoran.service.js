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
exports.getAllSetoran = exports.getSantriHistory = exports.inputSetoran = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const setoranRepo = __importStar(require("../repositories/setoran.repository"));
const inputSetoran = async (user, data) => {
    // Updated kategori validation untuk include INTENS dan BACAAN
    const validKategori = ["MURAJAAH", "ZIYADAH", "INTENS", "BACAAN"];
    if (data.kategori && !validKategori.includes(data.kategori)) {
        const error = new Error(`Kategori harus salah satu dari: ${validKategori.join(", ")}`);
        error.status = 400;
        throw error;
    }
    const santri = await prisma_1.default.santri.findUnique({
        where: {
            id_santri: data.santri_id,
        },
        include: {
            halaqah: true,
        },
    });
    if (!santri) {
        const error = new Error("Santri tidak ditemukan");
        error.status = 404;
        throw error;
    }
    // Permission check: muhafiz hanya bisa input setoran untuk santri di halaqahnya
    // kepala_muhafiz: bypass pengecekan halaqah (bisa input untuk santri mana saja)
    if (user.role === "muhafiz") {
        const halaqahMuhafiz = await prisma_1.default.halaqah.findFirst({
            where: {
                muhafiz_id: Number(user.id),
            },
        });
        if (!halaqahMuhafiz || santri.halaqah_id !== halaqahMuhafiz.id_halaqah) {
            const error = new Error("Akses ditolak: Santri ini bukan anggota halaqah Anda!");
            error.status = 403;
            throw error;
        }
    }
    // kepala_muhafiz dan role lain yang diizinkan: skip pengecekan halaqah
    // Custom tanggal_setoran: gunakan data.tanggal_setoran jika ada, jika tidak gunakan new Date()
    const tanggalSetoran = data.tanggal_setoran
        ? new Date(data.tanggal_setoran)
        : new Date();
    return await setoranRepo.createSetoran({
        ...data,
        tanggal_setoran: tanggalSetoran,
    });
};
exports.inputSetoran = inputSetoran;
const getSantriHistory = async (santriId, user) => {
    const santri = await prisma_1.default.santri.findUnique({
        where: {
            id_santri: santriId,
        },
    });
    if (!santri) {
        const error = new Error("Santri tidak ditemukan");
        error.status = 404;
        throw error;
    }
    if (user.role === "muhafiz") {
        const halaqah = await prisma_1.default.halaqah.findFirst({
            where: {
                muhafiz_id: Number(user.id),
                deleted_at: null,
            },
        });
        if (santri.halaqah_id !== halaqah?.id_halaqah) {
            const error = new Error("Akses ditolak: Santri ini bukan anggota halaqah Anda!");
            error.status = 403;
            throw error;
        }
    }
    return await setoranRepo.getSetoranBySantri(santriId);
};
exports.getSantriHistory = getSantriHistory;
const getAllSetoran = async (startDate, endDate) => {
    return await setoranRepo.getAllSetoran(startDate, endDate);
};
exports.getAllSetoran = getAllSetoran;
