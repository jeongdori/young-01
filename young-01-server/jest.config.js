module.exports = {
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@config/(.*)$': '<rootDir>/src/config/$1',
        '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
        '^@modules/(.*)$': '<rootDir>/src/modules/$1',
        '^@routes/(.*)$': '<rootDir>/src/routes/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    },
};
