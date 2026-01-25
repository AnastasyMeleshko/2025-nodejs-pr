/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    testMatch: ['**/*.test.ts'],
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/server.ts',
        '!src/routes/**',
        '!src/db/**',
        '!src/logger/**',
        '!src/swagger/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
};
