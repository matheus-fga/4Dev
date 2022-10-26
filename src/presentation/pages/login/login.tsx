import React, { useState, useEffect } from 'react'
import Styles from './login-styles.scss'

import { LoginHeader, Footer, Input, FormStatus } from '@/presentation/components'

import Context from '@/presentation/contexts/form/formContext'

import { Validation } from '@/presentation/protocols/validation'
import { Authentication } from '@/domain/usecases'

type LoginProps = {
  validation: Validation
  authentication: Authentication
}

const Login: React.FC<LoginProps> = ({ validation, authentication }: LoginProps) => {
  const [state, setState] = useState({
    isLoading: false,
    email: '',
    password: ''
  })

  const [errorState, setErrorState] = useState({
    email: '',
    main: '',
    password: ''
  })

  useEffect(() => {
    if (validation) {
      setErrorState((prevState) => ({
        ...prevState,
        email: validation.validate('email', state.email)
      }))
    }
  }, [state.email])

  useEffect(() => {
    if (validation) {
      setErrorState((prevState) => ({
        ...prevState,
        password: validation.validate('password', state.password)
      }))
    }
  }, [state.password])

  async function handleSubmit (event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    if (state.isLoading || errorState.email || errorState.password) return

    setState((prevState) => ({
      ...prevState,
      isLoading: true
    }))

    await authentication.auth({
      email: state.email,
      password: state.password
    })
  }

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={{ state, setState, errorState }}>
        <form data-testid="form" className={Styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input type="password" name="password" placeholder="Digite sua senha" />
          <button data-testid="submit" className={Styles.submit} type="submit" disabled={!!errorState.email || !!errorState.password}>Entrar</button>
          <span className={Styles.link}>Criar conta</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default Login
