import React, { useContext } from 'react'
import Styles from './formStatus-styles.scss'

import { Spinner } from '@/presentation/components'

import Context from '@/presentation/contexts/form/formContext'

type FormStatusProps = {
  message: string
}

const FormStatus: React.FC<FormStatusProps> = ({ message }: FormStatusProps) => {
  const { isLoading, errorMessage } = useContext(Context)

  return (
    <div data-testid ="loading-wrap" className={Styles.loadingWrap}>
      { isLoading && <Spinner className={Styles.spinner} /> }
      { errorMessage && <span className={Styles.message}>{message}</span> }
    </div>
  )
}

export default FormStatus
