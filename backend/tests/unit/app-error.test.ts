import { describe, it, expect } from "vitest"
import { createAppError, isAppError } from "../../src/shared/errors/app-error.js"

describe("AppError Functional Module", () => {
  it("should create an AppError with default statusCode 400", () => {
    const error = createAppError("Invalid request payload")

    expect(error.message).toBe("Invalid request payload")
    expect(error.statusCode).toBe(400)
    expect(error.isOperational).toBe(true)
  })

  it("should create an AppError with custom statusCode", () => {
    const error = createAppError("Game not found", 404)

    expect(error.message).toBe("Game not found")
    expect(error.statusCode).toBe(404)
    expect(error.isOperational).toBe(true)
  })

  it("should correctly identify an AppError using isAppError type guard", () => {
    const operationalError = createAppError("Unauthorized", 401)
    const standardError = new Error("Generic failure")
    const randomObject = { someKey: "value" }

    expect(isAppError(operationalError)).toBe(true)
    expect(isAppError(standardError)).toBe(false)
    expect(isAppError(randomObject)).toBe(false)
    expect(isAppError(null)).toBe(false)
    expect(isAppError(undefined)).toBe(false)
  })
})
