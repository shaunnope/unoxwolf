import type { JestConfigWithTsJest as Config } from 'ts-jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./.jest/setEnvVars.ts'],
  // setupFilesAfterEnv: ['./.jest/setup.ts'],

  modulePaths: ['<rootDir>/src', '<rootDir>/tests'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
    '^(?:tests)/(.*)$': '<rootDir>/tests/$1',
  },
}

export default config
