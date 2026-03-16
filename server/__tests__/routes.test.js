/**
 * __tests__/routes.test.js
 * Jest integration tests for Express API routes.
 * Tests /api/funds, /api/future-value, and /api/compare endpoints.
 * External APIs (Newton Analytics, Yahoo Finance) are mocked.
 */
import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";

// Mock axios before importing app so betaService/returnService use the mock
const mockGet = jest.fn();
jest.unstable_mockModule("axios", () => ({
  default: { get: mockGet },
}));

const { default: app } = await import("../app.js");

// Helper: configure mocked API responses for a given ticker
function mockExternalAPIs(beta = 1.02, closes = [100, 110]) {
  mockGet.mockImplementation((url) => {
    if (url.includes("newtonanalytics.com")) {
      return Promise.resolve({ data: { data: beta } });
    }
    if (url.includes("finance.yahoo.com")) {
      return Promise.resolve({
        data: {
          chart: {
            result: [{ indicators: { quote: [{ close: closes }] } }],
          },
        },
      });
    }
    return Promise.reject(new Error("Unexpected URL: " + url));
  });
}

beforeEach(() => {
  mockGet.mockReset();
});

describe("GET /api/funds", () => {
  it("returns 200 with an array of funds", async () => {
    const res = await request(app).get("/api/funds");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(25);
  });

  it("each fund has rank, symbol, and fund_name", async () => {
    const res = await request(app).get("/api/funds");
    const fund = res.body[0];
    expect(fund).toHaveProperty("rank");
    expect(fund).toHaveProperty("symbol");
    expect(fund).toHaveProperty("fund_name");
  });
});

describe("GET /api/future-value", () => {
  it("returns 400 when params are missing", async () => {
    const res = await request(app).get("/api/future-value");
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("returns 400 when ticker is missing", async () => {
    const res = await request(app).get("/api/future-value?investment=10000&duration=365");
    expect(res.status).toBe(400);
  });

  it("calculates future value correctly with mocked APIs", async () => {
    // beta=1.02, closes=[100, 110] -> expectedReturn=0.10
    mockExternalAPIs(1.02, [100, 110]);

    const res = await request(app).get(
      "/api/future-value?ticker=VFIAX&investment=10000&duration=365"
    );

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("futureValue");
    expect(res.body).toHaveProperty("rate");
    expect(res.body).toHaveProperty("beta");
    expect(res.body).toHaveProperty("expectedReturn");
    expect(res.body).toHaveProperty("riskFreeRate");
    expect(res.body).toHaveProperty("fundName");

    // Verify CAPM math: r = 0.0425 + 1.02*(0.10 - 0.0425) = 0.10115
    // FV = 10000 * (1 + 0.10115)^1 = 11011.50
    expect(res.body.rate).toBeCloseTo(0.10115, 4);
    expect(res.body.futureValue).toBeCloseTo(11011.5, 0);
    expect(res.body.beta).toBe(1.02);
    expect(res.body.expectedReturn).toBe(0.1);
  });

  it("returns 500 when external API fails", async () => {
    mockGet.mockRejectedValue(new Error("API down"));

    const res = await request(app).get(
      "/api/future-value?ticker=FAKE&investment=10000&duration=365"
    );

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("calculation failed");
  });
});

describe("GET /api/compare", () => {
  it("returns 400 when params are missing", async () => {
    const res = await request(app).get("/api/compare");
    expect(res.status).toBe(400);
  });

  it("compares multiple tickers", async () => {
    mockExternalAPIs(1.0, [100, 112]);

    const res = await request(app).get(
      "/api/compare?tickers=VFIAX&tickers=FXAIX&investment=10000&duration=365"
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty("ticker");
    expect(res.body[0]).toHaveProperty("futureValue");
  });

  it("handles single ticker as string", async () => {
    mockExternalAPIs(0.95, [100, 108]);

    const res = await request(app).get(
      "/api/compare?tickers=VFIAX&investment=5000&duration=730"
    );

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("returns error entry for failed ticker without crashing", async () => {
    mockGet.mockRejectedValue(new Error("API down"));

    const res = await request(app).get(
      "/api/compare?tickers=FAKE&investment=10000&duration=365"
    );

    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty("error");
  });
});
