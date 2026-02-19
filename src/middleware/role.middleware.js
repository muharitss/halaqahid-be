"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const response_1 = require("../utils/response");
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return (0, response_1.errorResponse)(res, "User tidak terautentikasi", 401, null);
        }
        if (!roles.includes(user.role)) {
            return (0, response_1.errorResponse)(res, `Akses ditolak: Role ${user.role} tidak diizinkan`, 403, null);
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
