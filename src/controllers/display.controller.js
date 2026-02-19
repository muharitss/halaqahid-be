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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicSantri = exports.getAllSetoranPublic = exports.getPublicAbsensiByHalaqah = exports.getPublicHalaqah = void 0;
const async_handler_1 = require("../utils/async.handler");
const santriRepo = __importStar(require("../repositories/santri.repository"));
const absensiRepo = __importStar(require("../repositories/absensi.repository"));
const halaqahRepo = __importStar(require("../repositories/halaqah.repository"));
const setoranRepo = __importStar(require("../repositories/setoran.repository"));
const response_1 = require("../utils/response");
exports.getPublicHalaqah = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await halaqahRepo.getAllHalaqah();
    const formattedData = data.map((h) => ({
        id_halaqah: h.id_halaqah,
        nama_halaqah: h.name_halaqah,
        nama_muhafiz: h.muhafiz?.username || "Tanpa Muhafiz",
        jumlah_santri: h._count?.santri || 0,
    }));
    return (0, response_1.successResponse)(res, "Data halaqah berhasil diambil", formattedData);
});
exports.getPublicAbsensiByHalaqah = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { halaqahId } = req.params;
    const { date } = req.query;
    const data = await absensiRepo.getAbsensiByHalaqah(Number(halaqahId), date);
    const formattedData = data.map((a) => ({
        id_absensi: a.id_absensi,
        nama_santri: a.santri?.nama_santri || "Anonim",
        status: a.status,
        keterangan: a.keterangan || "-",
        tanggal: a.tanggal,
    }));
    return (0, response_1.successResponse)(res, "Data absensi halaqah berhasil diambil", formattedData);
});
exports.getAllSetoranPublic = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await setoranRepo.getAllSetoran();
    const formattedData = data.map((item) => ({
        id_setoran: item.id_setoran,
        nama_santri: item.santri?.nama_santri || "Anonim",
        nama_halaqah: item.santri?.halaqah?.name_halaqah || "Tanpa Halaqah",
        surat: item.surat,
        ayat: item.ayat,
        juz: item.juz,
        kategori: item.kategori,
        tanggal: item.tanggal_setoran,
    }));
    return (0, response_1.successResponse)(res, "Berhasil mengambil semua data setoran", formattedData);
});
exports.getPublicSantri = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await santriRepo.getAllSantri(undefined);
    const formattedData = data.map((s) => ({
        id_santri: s.id_santri,
        nama_santri: s.nama_santri,
        nomor_telepon: s.nomor_telepon || "-",
        nama_halaqah: s.halaqah?.name_halaqah || "Tanpa Halaqah",
    }));
    return (0, response_1.successResponse)(res, "Daftar santri berhasil diambil", formattedData);
});
