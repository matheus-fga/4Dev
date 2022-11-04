import { ValidationBuilder as sut } from './validationBuilder'
import { RequiredFieldValidation, EmailValidation, MinLengthValidation } from '@/validation/validators'

describe('ValidationBuilder', () => {
  test('should return RequiredFieldValidation', () => {
    const validations = sut.field('some_field').required().build()
    expect(validations).toEqual([new RequiredFieldValidation('some_field')])
  })

  test('should return EmailValidation', () => {
    const validations = sut.field('some_field').email().build()
    expect(validations).toEqual([new EmailValidation('some_field')])
  })

  test('should return MinLengthValidation', () => {
    const validations = sut.field('some_field').min(6).build()
    expect(validations).toEqual([new MinLengthValidation('some_field', 6)])
  })
})
