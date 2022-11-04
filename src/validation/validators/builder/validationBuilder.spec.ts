import { ValidationBuilder as sut } from './validationBuilder'
import { RequiredFieldValidation, EmailValidation } from '@/validation/validators'

describe('ValidationBuilder', () => {
  test('should return RequiredFieldValidation', () => {
    const validations = sut.field('some_field').required().build()
    expect(validations).toEqual([new RequiredFieldValidation('some_field')])
  })

  test('should return EmailValidation', () => {
    const validations = sut.field('some_field').email().build()
    expect(validations).toEqual([new EmailValidation('some_field')])
  })
})
