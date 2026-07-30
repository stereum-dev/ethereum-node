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
  transformIgnorePatterns: ["node_modules/(?!(sucrase|uuid)/)"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx|mjs)$": "babel-jest",
    // ".*\\.(ts)$": "ts-jest"
  },
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  // Coverage is opt-in via the --coverage flag (test:unit / test:coverage pass it),
  // so integration/other runs don't pay the cost. .vue files are excluded because
  // there is no vue transformer here — instrumenting them makes babel try to parse
  // <template> as JS and throw "jsx isn't enabled" for every component.
  collectCoverageFrom: ["src/**/*.js", "!src/main.js"],
  coverageReporters: ["text", "json", "html"],
};
