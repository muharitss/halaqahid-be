"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || "Internal server error";
    console.error(`[Error Handler] ${statusCode} - ${message}`);
    return res.status(statusCode).json({
        success: false,
        message: message,
        errors: {
            statusCode: statusCode,
            ...(process.env.NODE_ENV === "development" && {
                detail: err.stack || err,
            }),
        },
    });
};
exports.errorHandler = errorHandler;
