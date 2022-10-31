import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import 'jest-localstorage-mock'
import faker from 'faker'

import Login from './login'
import { InvalidCredentialsError } from '@/domain/errors'

import { ValidationSpy, AuthenticationSpy } from '@/presentation/test'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const history = createMemoryHistory({ initialEntries: ['/login'] })

const makeSut = (validationError?: string): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const validationSpy = new ValidationSpy()
  validationSpy.errorMessage = validationError
  const sut = render(
    <Router history={history}>
      <Login validation={validationSpy} authentication={authenticationSpy} />
    </Router>
  )
  return {
    sut,
    validationSpy,
    authenticationSpy
  }
}

const simulateValidSubmit = async (
  sut: RenderResult,
  email: string = faker.internet.email(),
  password: string = faker.internet.password()
): Promise<void> => {
  fillLoginForm(sut, email, password)
  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
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

const testFieldStatus = (
  sut: RenderResult,
  fieldName: string,
  fieldTitle: string,
  fieldContent: string
): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(fieldTitle)
  expect(fieldStatus.textContent).toBe(fieldContent)
}

const testLoadingWrapChildCount = (sut: RenderResult, expectedCount: number): void => {
  const loadingWrap = sut.getByTestId('loading-wrap')
  expect(loadingWrap.childElementCount).toBe(expectedCount)
}

const testElementExists = (sut: RenderResult, fieldName: string): void => {
  const el = sut.getByTestId(fieldName)
  expect(el).toBeTruthy()
}

const testElementTextContent = (sut: RenderResult, fieldName: string, expectedContent: string): void => {
  const el = sut.getByTestId(fieldName)
  expect(el.textContent).toBe(expectedContent)
}

const testButtonIsDisabled = (sut: RenderResult, buttonLabel: string, isDisabled: boolean): void => {
  const button = sut.getByTestId(buttonLabel) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

describe('Login component', () => {
  afterEach(cleanup)
  beforeEach(() => {
    localStorage.clear()
  })

  test('should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut(validationError)
    testLoadingWrapChildCount(sut, 0)
    testButtonIsDisabled(sut, 'submit', true)
    testFieldStatus(sut, 'email', validationError, '🔴')
    testFieldStatus(sut, 'password', validationError, '🔴')
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
    testFieldStatus(sut, 'email', validationError, '🔴')
  })

  test('should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut(validationError)
    fillPasswordField(sut)
    testFieldStatus(sut, 'password', validationError, '🔴')
  })

  test('should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut()
    fillEmailField(sut)
    testFieldStatus(sut, 'email', 'Tudo certo!', '✔️')
  })

  test('should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut()
    fillPasswordField(sut)
    testFieldStatus(sut, 'password', 'Tudo certo!', '✔️')
  })

  test('should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    fillLoginForm(sut)
    testButtonIsDisabled(sut, 'submit', false)
  })

  test('should show spinner on submit button click', async () => {
    const { sut } = makeSut()
    await simulateValidSubmit(sut)
    testElementExists(sut, 'spinner')
  })

  test('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmit(sut, email, password)
    expect(authenticationSpy.params).toEqual({ email, password })
  })

  test('should call Authentication only once', async () => {
    const { sut, authenticationSpy } = makeSut()
    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('should not call Authentication if form is invalid', async () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = makeSut(validationError)
    await simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('should present error if Authentication fails', async () => {
    jest.useFakeTimers()
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
    await simulateValidSubmit(sut)
    testElementTextContent(sut, 'main-error', error.message)
    testLoadingWrapChildCount(sut, 1)
  })

  test('should add accessToken to localstorage and navigates to main page on success', async () => {
    const { sut, authenticationSpy } = makeSut()
    await simulateValidSubmit(sut)
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'accessToken',
      authenticationSpy.account.accessToken
    )
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('should redirect to singUp page', () => {
    const { sut } = makeSut()
    const register = sut.getByTestId('signup')
    fireEvent.click(register)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
