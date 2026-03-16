/**
 * __tests__/calculatorService.test.js
 * Jest unit tests for the CAPM calculator service.
 * Tests future value computation with known inputs.
 */
import { computeRate, computeFutureValue } from "../services/calculatorService.js";

describe("calculatorService", () => {
  describe("computeRate", () => {
    it("returns riskFreeRate when beta is 0", () => {
      expect(computeRate(0, 0.10, 0.04)).toBeCloseTo(0.04);
    });

    it("returns expectedReturn when beta is 1", () => {
      expect(computeRate(1, 0.10, 0.04)).toBeCloseTo(0.10);
    });

    it("computes CAPM rate correctly with typical inputs", () => {
      // r = 0.0425 + 1.02 * (0.0843 - 0.0425) = 0.0425 + 1.02 * 0.0418 = 0.0851
      const rate = computeRate(1.02, 0.0843, 0.0425);
      expect(rate).toBeCloseTo(0.08514, 4);
    });

    it("handles beta > 1 (more volatile than market)", () => {
      const rate = computeRate(1.5, 0.10, 0.04);
      // r = 0.04 + 1.5 * (0.10 - 0.04) = 0.04 + 0.09 = 0.13
      expect(rate).toBeCloseTo(0.13);
    });

    it("handles negative expected return", () => {
      const rate = computeRate(1.0, -0.05, 0.04);
      // r = 0.04 + 1.0 * (-0.05 - 0.04) = 0.04 - 0.09 = -0.05
      expect(rate).toBeCloseTo(-0.05);
    });
  });

  describe("computeFutureValue", () => {
    it("returns principal when years is 0", () => {
      expect(computeFutureValue(10000, 0.10, 0)).toBeCloseTo(10000);
    });

    it("computes discrete compounding P * (1 + r)^t", () => {
      // 10000 * (1.10)^1 = 11000
      expect(computeFutureValue(10000, 0.10, 1)).toBeCloseTo(11000);
    });

    it("compounds correctly over multiple years", () => {
      // 10000 * (1.08)^5 = 14693.28
      expect(computeFutureValue(10000, 0.08, 5)).toBeCloseTo(14693.28, 0);
    });

    it("handles fractional years", () => {
      // 10000 * (1.10)^0.5 = 10488.09
      expect(computeFutureValue(10000, 0.10, 0.5)).toBeCloseTo(10488.09, 0);
    });

    it("handles negative rate (loss)", () => {
      // 10000 * (1 + (-0.05))^1 = 9500
      expect(computeFutureValue(10000, -0.05, 1)).toBeCloseTo(9500);
    });
  });
});
