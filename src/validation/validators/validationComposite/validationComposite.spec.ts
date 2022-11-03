import { ValidationComposite } from './validationComposite'
import { FieldValidationSpy } from '@/validation/test/mockFieldValidation'

describe('ValidationComposite', () => {
  test('should return error if any validator fails', () => {
    const fieldValidationSpy = new FieldValidationSpy('some_field')
    const fieldValidationSpy2 = new FieldValidationSpy('some_field')
    fieldValidationSpy2.error = new Error('errorMessage')
    const sut = new ValidationComposite([
      fieldValidationSpy,
      fieldValidationSpy2
    ])
    const error = sut.validate('some_field', 'any_value')
    expect(error).toBe('errorMessage')
  })
})
