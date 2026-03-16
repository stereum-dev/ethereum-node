module.exports = {
  moduleFileExtensions: ["js", "json", "vue"],
  roots: ["<rootDir>/src/"],
  // testEnvironment: "jest-environment-jsdom",
  testMatch: ["**/?(*.)+(spec|test|int).[tj]s?(x)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  moduleDirectories: ["node_modules", "src"],
  testEnvironment: "jsdom",
  transformIgnorePatterns: ["node_modules/(?!(sucrase)/)"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx|mjs)$": "babel-jest",
    // ".*\\.(ts)$": "ts-jest"
  },
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,vue}", "!src/main.js"],
  coverageReporters: ["text", "json", "html"],
};
