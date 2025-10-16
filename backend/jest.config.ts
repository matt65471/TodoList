// jest.config.ts
module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
  testMatch: ["**/?(*.)+(spec|test).ts"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/server.ts"],
  verbose: true
};
