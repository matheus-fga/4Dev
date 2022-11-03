import { InvalidFieldError } from '@/validation/errors'
import { MinLengthValidation } from './minLengthValidation'
import faker from 'faker'

const makeSut = (): MinLengthValidation => new MinLengthValidation(faker.database.column(), 6)

describe('minLengthValidation', () => {
  test('should return error if value is too short', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.alphaNumeric(5))
    expect(error).toEqual(new InvalidFieldError())
  })

  test('should return falsy if value is >= expected length', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.alphaNumeric(6))
    expect(error).toBeFalsy()
  })
})
