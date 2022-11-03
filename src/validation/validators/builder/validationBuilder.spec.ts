import { ValidationBuilder as sut } from './validationBuilder'
import { RequiredFieldValidation } from '@/validation/validators'

describe('ValidationBuilder', () => {
  test('should return RequiredFieldValidation', () => {
    const validations = sut.field('some_field').required().build()
    expect(validations).toEqual([new RequiredFieldValidation('some_field')])
  })
})
