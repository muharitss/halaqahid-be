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
exports.restoreSantriAccount = exports.deleteSantri = exports.updateExistingSantri = exports.createNewSantri = exports.getSantriList = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const santriRepo = __importStar(require("../repositories/santri.repository"));
const getSantriList = async (user) => {
    let halaqahId;
    if (user.role === "muhafiz") {
        const halaqah = await prisma_1.default.halaqah.findFirst({
            where: { muhafiz_id: user.id, deleted_at: null },
        });
        if (!halaqah)
            throw new Error("Anda belum memiliki halaqah");
        halaqahId = halaqah.id_halaqah;
    }
    return await santriRepo.getAllSantri(halaqahId);
};
exports.getSantriList = getSantriList;
const createNewSantri = async (user, data) => {
    let finalHalaqahId = data.halaqah_id;
    if (user.role === "muhafiz") {
        const halaqah = await prisma_1.default.halaqah.findFirst({
            where: {
                muhafiz_id: user.id,
                deleted_at: null,
            },
        });
        if (!halaqah)
            throw new Error("Akses ditolak: Anda tidak memiliki halaqah!");
        finalHalaqahId = halaqah.id_halaqah;
    }
    return await santriRepo.createSantri({ ...data, halaqah_id: finalHalaqahId });
};
exports.createNewSantri = createNewSantri;
const updateExistingSantri = async (id, user, data) => {
    const santri = await santriRepo.getSantriById(id);
    if (!santri)
        throw new Error("Santri tidak ditemukan");
    if (user.role === "muhafiz") {
        const halaqah = await prisma_1.default.halaqah.findFirst({
            where: { muhafiz_id: user.id, deleted_at: null },
        });
        if (santri.halaqah_id !== halaqah?.id_halaqah) {
            const error = new Error("Akses ditolak: Santri ini bukan anggota halaqah Anda!");
            error.statusCode = 403;
            throw error;
        }
        delete data.halaqah_id;
    }
    return await santriRepo.updateSantri(id, data);
};
exports.updateExistingSantri = updateExistingSantri;
const deleteSantri = async (id, user) => {
    const santri = await santriRepo.getSantriById(id);
    if (!santri)
        throw new Error("Santri tidak ditemukan!!");
    if (user.role === "muhafiz") {
        const halaqah = await prisma_1.default.halaqah.findFirst({
            where: { muhafiz_id: user.id, deleted_at: null },
        });
        if (santri.halaqah_id !== halaqah?.id_halaqah) {
            const error = new Error("Akses ditolak: Santri ini bukan anggota halaqah Anda!");
            error.statusCode = 403;
            throw error;
        }
    }
    return await santriRepo.deleteSantri(id);
};
exports.deleteSantri = deleteSantri;
const restoreSantriAccount = async (id) => {
    const santri = await santriRepo.getDeletedSantriById(id);
    if (!santri)
        throw new Error("Santri tidak ditemukan di tempat sampah!!");
    return await santriRepo.restoreSantri(id);
};
exports.restoreSantriAccount = restoreSantriAccount;
