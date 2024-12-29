module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.svg$": "<rootDir>/__mocks__/fileMock.js",
  },
  testEnvironment: "jsdom",
  setupFiles: ["jest-fetch-mock"], // Add this line
};