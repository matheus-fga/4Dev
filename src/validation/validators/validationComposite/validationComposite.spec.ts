import { ValidationComposite } from './validationComposite'
import { FieldValidationSpy } from '@/validation/test/mockFieldValidation'

describe('ValidationComposite', () => {
  test('should return first found error if any validator fails', () => {
    const fieldValidationSpy = new FieldValidationSpy('some_field')
    fieldValidationSpy.error = new Error('firstErrorMessage')
    const fieldValidationSpy2 = new FieldValidationSpy('some_field')
    fieldValidationSpy2.error = new Error('secondErrorMessage')
    const sut = new ValidationComposite([
      fieldValidationSpy,
      fieldValidationSpy2
    ])
    const error = sut.validate('some_field', 'any_value')
    expect(error).toBe('firstErrorMessage')
  })
})
