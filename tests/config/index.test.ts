import { isValidEnvironment } from '../../src/config'

describe('Configuration', () => {
    describe('Configuration', () => {
        describe('isValidEnvironment', () => {
            test('should be valid', () => {
                expect(isValidEnvironment('development')).toBeTruthy()
                expect(isValidEnvironment('dev')).toBeTruthy()
            })
            test('should be valid', () => {
                expect(isValidEnvironment('production')).toBeFalsy()
            })
        })
    })
})
