"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreUser = exports.findAllDeletedMuhafiz = exports.updateUser = exports.softDelete = exports.create = exports.findByEmail = exports.findAllMuhafiz = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const findAllMuhafiz = async () => {
    return await prisma_1.default.user.findMany({
        where: {
            role: "muhafiz",
            deleted_at: null,
        },
        select: {
            id_user: true,
            username: true,
            email: true,
            role: true,
        },
    });
};
exports.findAllMuhafiz = findAllMuhafiz;
const findByEmail = async (email) => {
    return await prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
};
exports.findByEmail = findByEmail;
const create = async (data) => {
    return await prisma_1.default.user.create({
        data: {
            email: data.email,
            username: data.username,
            password: data.password,
            role: data.role,
        },
    });
};
exports.create = create;
const softDelete = async (id) => {
    return await prisma_1.default.user.update({
        where: {
            id_user: id,
        },
        data: {
            deleted_at: new Date(),
        },
        select: {
            id_user: true,
            email: true,
            role: true,
            deleted_at: true,
        },
    });
};
exports.softDelete = softDelete;
const updateUser = async (id, data) => {
    return await prisma_1.default.user.update({
        where: {
            id_user: id,
        },
        data,
        select: {
            id_user: true,
            username: true,
            email: true,
            role: true,
        },
    });
};
exports.updateUser = updateUser;
const findAllDeletedMuhafiz = async () => {
    return await prisma_1.default.user.findMany({
        where: {
            role: "muhafiz",
            NOT: {
                deleted_at: null,
            },
        },
        select: {
            id_user: true,
            username: true,
            email: true,
            deleted_at: true,
        },
    });
};
exports.findAllDeletedMuhafiz = findAllDeletedMuhafiz;
const restoreUser = async (id) => {
    return await prisma_1.default.user.update({
        where: {
            id_user: id,
        },
        data: {
            deleted_at: null,
        },
        select: {
            id_user: true,
            username: true,
            email: true,
            role: true,
        },
    });
};
exports.restoreUser = restoreUser;
