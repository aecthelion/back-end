module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: ".test.ts$",
  rootDir: "src",
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/$1",
    "^@models/(.*)$": "<rootDir>/models/$1",
    "^@utils/(.*)$": "<rootDir>/utils/$1",
  },
};
