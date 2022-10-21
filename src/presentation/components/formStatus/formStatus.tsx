import React, { useContext } from 'react'
import Styles from './formStatus-styles.scss'

import { Spinner } from '@/presentation/components'

import Context from '@/presentation/contexts/form/formContext'

const FormStatus: React.FC = () => {
  const { isLoading, errorMessage } = useContext(Context)

  return (
    <div data-testid ="loading-wrap" className={Styles.loadingWrap}>
      { isLoading && <Spinner className={Styles.spinner} /> }
      { errorMessage && <span className={Styles.message}>{errorMessage}</span> }
    </div>
  )
}

export default FormStatus
