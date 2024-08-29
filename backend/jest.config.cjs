module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  setupFiles: ["dotenv/config"],
  testEnvironmentOptions: {
    env: {
      DRIZZLE_DATABASE_URL:
        "postgresql://username:password@test-db-host:5432/test_database",
      JWT_SECRET: "your_test_jwt_secret",
    },
  },
};
