import React from 'react'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import faker from 'faker'

import Login from './login'

import { ValidationSpy, AuthenticationSpy } from '@/presentation/test'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (validationError?: string): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const validationSpy = new ValidationSpy()
  validationSpy.errorMessage = validationError
  const sut = render(<Login validation={validationSpy} authentication={authenticationSpy} />)
  return {
    sut,
    validationSpy,
    authenticationSpy
  }
}

const simulateValidSubmit = (
  sut: RenderResult,
  email: string = faker.internet.email(),
  password: string = faker.internet.password()
): void => {
  fillLoginForm(sut, email, password)
  const submitButton = sut.getByTestId('submit')
  fireEvent.click(submitButton)
}

const fillLoginForm = (
  sut: RenderResult,
  email: string = faker.internet.email(),
  password: string = faker.internet.password()
): void => {
  fillEmailField(sut, email)
  fillPasswordField(sut, password)
}

const fillEmailField = (sut: RenderResult, email: string = faker.internet.email()): void => {
  const emailInput = sut.getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}

const fillPasswordField = (sut: RenderResult, password: string = faker.internet.password()): void => {
  const passwordInput = sut.getByTestId('password')
  fireEvent.input(passwordInput, { target: { value: password } })
}

const simulateFieldStatus = (
  sut: RenderResult,
  fieldName: string,
  fieldTitle: string,
  fieldContent: string
): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(fieldTitle)
  expect(fieldStatus.textContent).toBe(fieldContent)
}

describe('Login component', () => {
  afterEach(cleanup)

  test('should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut(validationError)
    const loadingWrap = sut.getByTestId('loading-wrap')
    expect(loadingWrap.childElementCount).toBe(0)
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)
    simulateFieldStatus(sut, 'email', validationError, '🔴')
    simulateFieldStatus(sut, 'password', validationError, '🔴')
  })

  test('should call validation with correct email value', () => {
    const { sut, validationSpy } = makeSut()
    const email = faker.internet.email()
    fillEmailField(sut, email)
    expect(validationSpy.fieldName).toBe('email')
    expect(validationSpy.fieldValue).toBe(email)
  })

  test('should call validation with correct password value', () => {
    const { sut, validationSpy } = makeSut()
    const password = faker.internet.password()
    fillPasswordField(sut, password)
    expect(validationSpy.fieldName).toBe('password')
    expect(validationSpy.fieldValue).toBe(password)
  })

  test('should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut(validationError)
    fillEmailField(sut)
    simulateFieldStatus(sut, 'email', validationError, '🔴')
  })

  test('should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut(validationError)
    fillPasswordField(sut)
    simulateFieldStatus(sut, 'password', validationError, '🔴')
  })

  test('should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut()
    fillEmailField(sut)
    simulateFieldStatus(sut, 'email', 'Tudo certo!', '✔️')
  })

  test('should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut()
    fillPasswordField(sut)
    simulateFieldStatus(sut, 'password', 'Tudo certo!', '✔️')
  })

  test('should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    fillLoginForm(sut)
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(false)
  })

  test('should show spinner on submit button click', () => {
    const { sut } = makeSut()
    simulateValidSubmit(sut)
    const spinner = sut.getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })

  test('should call Authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    simulateValidSubmit(sut, email, password)
    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  test('should call Authentication only once', () => {
    const { sut, authenticationSpy } = makeSut()
    simulateValidSubmit(sut)
    const submitButton = sut.getByTestId('submit')
    fireEvent.click(submitButton)
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = makeSut(validationError)
    fillEmailField(sut)
    const form = sut.getByTestId('form')
    fireEvent.submit(form)
    expect(authenticationSpy.callsCount).toBe(0)
  })
})
