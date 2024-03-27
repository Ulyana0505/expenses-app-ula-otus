const esModules = ["nanoid"].join("|");

/** @type {import("jest").Config} */
const config = {
  verbose: true,
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^.+\\.svg$": "jest-svg-transformer",
    "^.+\\.(css|less|scss)$": "identity-obj-proxy",
    "^nanoid(/(.*)|$)": "nanoid$1"
  },
  transform: {
    "\\.[jt]sx?$": "babel-jest"
  },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*"],
  clearMocks: true,
  globals: {
    window: {},
    jest: true
  },
  roots: ["tests"]
};

module.exports = config;
