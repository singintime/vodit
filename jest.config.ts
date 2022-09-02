export default {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json",
    },
  },
  transformIgnorePatterns: ["node_modules/(?!troublesome-dependency/.*)"],
};
