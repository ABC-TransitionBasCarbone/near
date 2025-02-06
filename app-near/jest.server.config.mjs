import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const customJestServerConfig = {
  testEnvironment: "jest-environment-node",
  testMatch: ["**/src/server/**/*.spec.ts"],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: true }], // Transpile TypeScript with ts-jest
    "^.+\\.js$": "babel-jest", // transform js file in jest digest file
  },
  transformIgnorePatterns: [
    '/node_modules/',
  ],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleDirectories: ['node_modules', '<rootDir>'],
};

export default createJestConfig(customJestServerConfig);