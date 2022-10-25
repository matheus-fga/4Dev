import React, { useState, useEffect } from 'react'
import Styles from './login-styles.scss'

import { LoginHeader, Footer, Input, FormStatus } from '@/presentation/components'

import Context from '@/presentation/contexts/form/formContext'

import { Validation } from '@/presentation/protocols/validation'

type LoginProps = {
  validation: Validation
}

const Login: React.FC<LoginProps> = ({ validation }: LoginProps) => {
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
    setErrorState((prevState) => ({
      ...prevState,
      email: validation.validate('email', state.email)
    }))
  }, [state.email])

  useEffect(() => {
    setErrorState((prevState) => ({
      ...prevState,
      password: validation.validate('password', state.password)
    }))
  }, [state.password])

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={{ state, setState, errorState }}>
        <form className={Styles.form}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input type="password" name="password" placeholder="Digite sua senha" />
          <button data-testid="submit" className={Styles.submit} type="submit" disabled>Entrar</button>
          <span className={Styles.link}>Criar conta</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default Login
