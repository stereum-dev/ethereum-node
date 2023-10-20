module.exports = {
  moduleFileExtensions: ["js", "json", "vue"],
  roots: ["<rootDir>/src/", "<rootDir>/tests/"],
  // testEnvironment: "jest-environment-jsdom",
  testMatch: ["**/?(*.)+(spec|test|int).[tj]s?(x)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  moduleDirectories: ["node_modules", "src"],
  testEnvironment: "jsdom",
  transformIgnorePatterns: ["node_modules/(?!(sucrase)/)"],
  transform: {
    ".*\\.(vue)$": "@vue/vue3-jest",
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
