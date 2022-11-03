import { RequiredFieldValidation } from './requiredFieldValidation'
import { RequiredFieldError } from '@/validation/errors'

describe('RequiredFieldValidation', () => {
  test('should return error if filed is empty', () => {
    const sut = new RequiredFieldValidation('email')
    const error = sut.validate('')
    expect(error).toEqual(new RequiredFieldError())
  })
})
