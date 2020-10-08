module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  setupFiles: ["./tests/setup.js"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/tests/mocks/fileMock.js",
    "\\.(css|less)$": "<rootDir>/tests/mocks/styleMock.js",
  },
  snapshotSerializers: ["jest-serializer-vue"],
};
