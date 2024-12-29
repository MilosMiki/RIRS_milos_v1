module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.svg$": "<rootDir>/__mocks__/fileMock.js",
  },
  testEnvironment: "jsdom",
  setupFiles: [
    "jest-fetch-mock", 
    "dotenv/config" // Add this line to load your .env file
  ],
};
