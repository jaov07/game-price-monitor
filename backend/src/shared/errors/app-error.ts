export interface AppError {
    readonly message: string
    readonly statusCode: number
    readonly isOperational: true
}

export function createAppError(message: string, statusCode = 400): AppError {
    return {
        message,
        statusCode,
        isOperational: true,
    }
}

export function isAppError(error: unknown): error is AppError {
    return (
        typeof error === "object" &&
        error !== null &&
        "isOperational" in error &&
        (error as { isOperational: unknown }).isOperational === true
    )
}