import { Response } from "express";

export const successResponse = (
  res: Response,
  message: string,
  data: any,
  pagination?: any,
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination,
  });
};

export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 400,
  errors: any
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
