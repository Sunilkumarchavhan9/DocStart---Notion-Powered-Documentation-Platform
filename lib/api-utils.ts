import { NextResponse } from "next/server";
import { z } from "zod";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(error: unknown, defaultMessage = "Internal server error") {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message, 
        details: error.details 
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Validation failed", 
        details: error.errors 
      },
      { status: 400 }
    );
  }

  console.error("API Error:", error);
  return NextResponse.json(
    { success: false, error: defaultMessage },
    { status: 500 }
  );
}

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
} 