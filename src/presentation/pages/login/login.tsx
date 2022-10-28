import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
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
  const history = useHistory()
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

    try {
      const account = await authentication.auth({
        email: state.email,
        password: state.password
      })

      localStorage.setItem('accessToken', account.accessToken)
      history.replace('/')
    } catch (error) {
      setErrorState((prevState) => ({
        ...prevState,
        main: error.message
      }))
    } finally {
      setState((prevState) => ({
        ...prevState,
        isLoading: false
      }))
    }
  }

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={{ state, setState, errorState }}>
        <form data-testid="form" className={Styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input type="password" name="password" placeholder="Digite sua senha" />
          <button
            data-testid="submit"
            className={Styles.submit}
            type="submit"
            disabled={!!state.isLoading || !!errorState.email || !!errorState.password}
          >
            Entrar
          </button>
          <Link data-testid="signup" to="/signup" className={Styles.link}>Criar conta</Link>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default Login
