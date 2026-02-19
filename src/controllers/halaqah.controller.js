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
exports.restoreHalaqah = exports.listDeletedHalaqah = exports.deleteHalaqah = exports.updateHalaqah = exports.listHalaqah = exports.createHalaqah = void 0;
const async_handler_1 = require("../utils/async.handler");
const halaqahRepository = __importStar(require("../repositories/halaqah.repository"));
const response_1 = require("../utils/response");
exports.createHalaqah = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { name_halaqah, muhafiz_id } = req.body;
    const halaqah = await halaqahRepository.createHalaqah(name_halaqah, muhafiz_id);
    return (0, response_1.successResponse)(res, "Halaqah berhasil dibuat", halaqah);
});
exports.listHalaqah = (0, async_handler_1.asyncHandler)(async (_req, res) => {
    const halaqahs = await halaqahRepository.getAllHalaqah();
    return (0, response_1.successResponse)(res, "Data halaqah berhasil diambil", halaqahs);
});
exports.updateHalaqah = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updated = await halaqahRepository.updateHalaqah(Number(id), req.body);
    return (0, response_1.successResponse)(res, "Halaqah berhasil diupdate", updated);
});
exports.deleteHalaqah = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const deleted = await halaqahRepository.deleteHalaqah(Number(id));
    return (0, response_1.successResponse)(res, "Halaqah berhasil dihapus", deleted);
});
exports.listDeletedHalaqah = (0, async_handler_1.asyncHandler)(async (_req, res) => {
    const deleted = await halaqahRepository.getDeletedHalaqah();
    return (0, response_1.successResponse)(res, "Data halaqah berhasil diambil", deleted);
});
exports.restoreHalaqah = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const restored = await halaqahRepository.restoreHalaqah(Number(id));
    return (0, response_1.successResponse)(res, "Halaqah berhasil dihapus", restored);
});
