import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response";

export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return errorResponse(res, "User tidak terautentikasi", 401, null);
    }

    if (!roles.includes(user.role)) {
      return errorResponse(
        res,
        `Akses ditolak: Role ${user.role} tidak diizinkan`,
        403,
        null
      );
    }

    next();
  };
};
