import { runInValidEnvironment, isEnable } from '../../src/config'

describe('Expresso > config', () => {
    const validRequest = {
        header: (): boolean => true,
        path: '/api/v1'
    }

    const invalidRequest = {
        header: (): boolean => false,
        path: '/expresso'
    }
    describe('isEnable', () => {
        test('should be true', () => {
            expect(isEnable(validRequest, 'development')).toBeTruthy() //true true
            expect(isEnable(validRequest, 'dev')).toBeTruthy() //true true
        })
        test('should not be false', () => {
            expect(isEnable(validRequest, 'production')).toBeFalsy() //true false
            expect(isEnable(invalidRequest, 'development')).toBeFalsy() //false true
            expect(isEnable(invalidRequest, 'production')).toBeFalsy() //false false
        })
    })
    describe('runInValidEnvironment', () => {
        test('should be valid using default options and correct environment', () => {
            expect(runInValidEnvironment('development')).toBeTruthy()
            expect(runInValidEnvironment('dev')).toBeTruthy()
        })
        test('should be valid using custom values', () => {
            expect(runInValidEnvironment('test', { env: ['test'] })).toBeTruthy()
        })

        test('should be invalid using default options and bad environment', () => {
            expect(runInValidEnvironment('production')).toBeFalsy()
        })

        test('should be invalid using these custom values', () => {
            expect(runInValidEnvironment('test', { env: ['development'] })).toBeFalsy()
        })
    })
})
