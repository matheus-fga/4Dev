import { InvalidFieldError } from '@/validation/errors'
import { MinLengthValidation } from './minLengthValidation'

describe('minLengthValidation', () => {
  test('should return error if value is too short', () => {
    const sut = new MinLengthValidation('field', 5)
    const error = sut.validate('1234')
    expect(error).toEqual(new InvalidFieldError())
  })
})
