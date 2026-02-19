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
exports.restoreSantri = exports.deleteSantri = exports.updateSantri = exports.createSantri = exports.getSantri = void 0;
const async_handler_1 = require("../utils/async.handler");
const santriService = __importStar(require("../services/santri.service"));
const response_1 = require("../utils/response");
exports.getSantri = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const result = await santriService.getSantriList(user);
    return (0, response_1.successResponse)(res, "Daftar santri berhasil di ambil", result);
});
exports.createSantri = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const data = req.body;
    const result = await santriService.createNewSantri(user, data);
    return (0, response_1.successResponse)(res, "Santri berhasil ditambahkan", result);
});
exports.updateSantri = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const data = req.body;
    const result = await santriService.updateExistingSantri(Number(id), user, data);
    return (0, response_1.successResponse)(res, "Santri berhasil diupdate", result);
});
exports.deleteSantri = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await santriService.deleteSantri(Number(id), user);
    return (0, response_1.successResponse)(res, "Santri berhasil dihapus", result);
});
exports.restoreSantri = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const result = await santriService.restoreSantriAccount(Number(id));
    return (0, response_1.successResponse)(res, "Santri berhasil di-restore", result);
});
