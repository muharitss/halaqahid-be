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
exports.getMe = exports.restoreMuhafizAccount = exports.getDeletedMuhafiz = exports.impersonateMuhafiz = exports.updateMuhafiz = exports.deleteMuhafiz = exports.registerMuhafiz = exports.login = exports.getAllmuhafiz = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepo = __importStar(require("../repositories/user.repository"));
const prisma_1 = __importDefault(require("../prisma"));
const getAllmuhafiz = async () => {
    return await userRepo.findAllMuhafiz();
};
exports.getAllmuhafiz = getAllmuhafiz;
const login = async (data) => {
    const user = await prisma_1.default.user.findFirst({
        where: {
            OR: [
                {
                    email: data.email,
                },
                {
                    username: data.username,
                },
            ],
            deleted_at: null,
        },
    });
    if (!user || !(await bcryptjs_1.default.compare(data.password, user.password))) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is missing");
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id_user, role: user.role }, jwtSecret, {
        expiresIn: "7d",
    });
    const { password: _, ...userResponse } = user;
    return { user: userResponse, token };
};
exports.login = login;
const registerMuhafiz = async (data) => {
    const existingUser = await prisma_1.default.user.findUnique({
        where: {
            email: data.email,
            username: data.username,
        },
    });
    if (existingUser) {
        const error = new Error("User already exists");
        error.status = 400;
        throw error;
    }
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
    const newUser = await userRepo.create({
        email: data.email,
        username: data.username,
        password: hashedPassword,
        role: "muhafiz",
    });
    const { password: _, ...userResponse } = newUser;
    return userResponse;
};
exports.registerMuhafiz = registerMuhafiz;
const deleteMuhafiz = async (id) => {
    const user = await prisma_1.default.user.findUnique({
        where: {
            id_user: id,
        },
    });
    if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }
    return await userRepo.softDelete(id);
};
exports.deleteMuhafiz = deleteMuhafiz;
const updateMuhafiz = async (id, data) => {
    const user = await prisma_1.default.user.findUnique({ where: { id_user: id } });
    if (!user) {
        const error = new Error("User tidak ditemukan");
        error.status = 404;
        throw error;
    }
    if (data.username && data.username !== user.username) {
        const existingUser = await prisma_1.default.user.findUnique({
            where: { username: data.username },
        });
        if (existingUser) {
            const error = new Error("Username already exists");
            error.status = 400;
            throw error;
        }
    }
    return await userRepo.updateUser(id, data);
};
exports.updateMuhafiz = updateMuhafiz;
const impersonateMuhafiz = async (muhafizId) => {
    const user = await prisma_1.default.user.findUnique({ where: { id_user: muhafizId } });
    if (!user || user.deleted_at || user.role !== "muhafiz") {
        const error = new Error("Muhafiz tidak ditemukan atau bukan merupakan muhafiz");
        error.status = 404;
        throw error;
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is missing");
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id_user, role: user.role }, jwtSecret, {
        expiresIn: "7d",
    });
    const { password: _, ...userResponse } = user;
    return { user: userResponse, token };
};
exports.impersonateMuhafiz = impersonateMuhafiz;
const getDeletedMuhafiz = async () => {
    return await userRepo.findAllDeletedMuhafiz();
};
exports.getDeletedMuhafiz = getDeletedMuhafiz;
const restoreMuhafizAccount = async (id) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id_user: id },
    });
    if (!user) {
        const error = new Error("User tidak ditemukan");
        error.status = 404;
        throw error;
    }
    if (user.role !== "muhafiz") {
        const error = new Error("User tersebut bukan merupakan muhafiz");
        error.status = 400;
        throw error;
    }
    if (user.deleted_at === null) {
        const error = new Error("User ini sudah dalam status aktif");
        error.status = 400;
        throw error;
    }
    return await userRepo.restoreUser(id);
};
exports.restoreMuhafizAccount = restoreMuhafizAccount;
const getMe = async (id) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id_user: id },
    });
    if (!user || user.deleted_at) {
        const error = new Error("User tidak ditemukan");
        error.status = 404;
        throw error;
    }
    const { password: _, ...userResponse } = user;
    return userResponse;
};
exports.getMe = getMe;
