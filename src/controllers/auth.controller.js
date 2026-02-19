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
exports.getMe = exports.restoreMuhafiz = exports.listDeletedMuhafiz = exports.impersonate = exports.updateMuhafiz = exports.deletemuhafiz = exports.getAllmuhafiz = exports.register = exports.login = void 0;
const async_handler_1 = require("../utils/async.handler");
const authService = __importStar(require("../services/auth.service"));
const response_1 = require("../utils/response");
exports.login = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await authService.login(req.body);
    return (0, response_1.successResponse)(res, "Login berhasil", result);
});
exports.register = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await authService.registerMuhafiz(req.body);
    return (0, response_1.successResponse)(res, "Register berhasil", result);
});
exports.getAllmuhafiz = (0, async_handler_1.asyncHandler)(async (_req, res) => {
    const result = await authService.getAllmuhafiz();
    return (0, response_1.successResponse)(res, "Data muhafiz berhasil diambil", result);
});
exports.deletemuhafiz = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const result = await authService.deleteMuhafiz(Number(id));
    return (0, response_1.successResponse)(res, "Data muhafiz berhasil dihapus", result);
});
exports.updateMuhafiz = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;
    const result = await authService.updateMuhafiz(Number(id), {
        username,
        email,
    });
    return (0, response_1.successResponse)(res, "Data muhafiz berhasil diupdate", result);
});
exports.impersonate = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const result = await authService.impersonateMuhafiz(Number(id));
    return (0, response_1.successResponse)(res, "Impersonate berhasil", result);
});
exports.listDeletedMuhafiz = (0, async_handler_1.asyncHandler)(async (_req, res) => {
    const result = await authService.getDeletedMuhafiz();
    return (0, response_1.successResponse)(res, "Daftar muhafiz terhapus berhasil diambil", result);
});
exports.restoreMuhafiz = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const result = await authService.restoreMuhafizAccount(Number(id));
    return (0, response_1.successResponse)(res, "Akun muhafiz berhasil diaktifkan kembali", result);
});
exports.getMe = (0, async_handler_1.asyncHandler)(async (req, res) => {
    // Pastikan middleware auth Anda sudah menyimpan data user di req.user
    // Biasanya: const user = req.user; 
    const userId = req.user.id;
    const result = await authService.getMe(Number(userId));
    return (0, response_1.successResponse)(res, "Data profil berhasil diambil", result);
});
