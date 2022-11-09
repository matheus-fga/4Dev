import React from 'react'
import { makeRemoteAuthentication } from '@/main/factories/usecases/authentication/remoteAuthenticationFactory'
import { makeLoginValidation } from './loginValidationFactory'
import { Login } from '@/presentation/pages'

export const makeLogin: React.FC = () => {
  return (
    <Login
      authentication={makeRemoteAuthentication()}
      validation={makeLoginValidation()}
    />
  )
}
