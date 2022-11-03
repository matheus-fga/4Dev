import { ValidationComposite } from './validationComposite'
import { FieldValidationSpy } from '@/validation/test/mockFieldValidation'

type SutTypes = {
  sut: ValidationComposite
  fieldValidationsSpy: FieldValidationSpy[]
}

const makeSut = (): SutTypes => {
  const fieldValidationsSpy = [
    new FieldValidationSpy('some_field'),
    new FieldValidationSpy('some_field')
  ]
  const sut = new ValidationComposite(fieldValidationsSpy)
  return {
    sut,
    fieldValidationsSpy
  }
}

describe('ValidationComposite', () => {
  test('should return first error found if any validator fails', () => {
    const { sut, fieldValidationsSpy } = makeSut()
    fieldValidationsSpy[0].error = new Error('firstErrorMessage')
    fieldValidationsSpy[1].error = new Error('secondErrorMessage')
    const error = sut.validate('some_field', 'any_value')
    expect(error).toBe('firstErrorMessage')
  })
})
