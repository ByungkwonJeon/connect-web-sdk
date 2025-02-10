/**
 * Jest Configuration for Connect Web SDK
 * Ensures TypeScript and ES modules work correctly in Jest.
 */

module.exports = {
    // Specifies the root directory for Jest to scan for tests
    roots: ["<rootDir>/tests"],

    // Transforms TypeScript files using ts-jest
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },

    // Module file extensions Jest will recognize
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "mjs"],

    // Automatically clear mock calls and instances before every test
    clearMocks: true,

    // Enables detailed coverage reporting
    collectCoverage: true,

    // Specifies directories to include in coverage reports
    collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/index.ts"],

    // Configures the coverage report output
    coverageDirectory: "coverage",

    // Specifies the test environment explicitly
    testEnvironment: "jest-environment-jsdom",

    // Ensures Jest can work with ES Modules
    extensionsToTreatAsEsm: [".ts"],

    // Specifies test file patterns
    testMatch: ["**/tests/**/*.test.(ts|tsx)"],

    // Logs additional debugging information if needed
    verbose: true
};