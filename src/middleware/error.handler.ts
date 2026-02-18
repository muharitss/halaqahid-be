import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
