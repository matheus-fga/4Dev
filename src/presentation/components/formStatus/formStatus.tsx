import React, { useContext } from 'react'
import Styles from './formStatus-styles.scss'

import { Spinner } from '@/presentation/components'

import Context from '@/presentation/contexts/form/formContext'

const FormStatus: React.FC = () => {
  const { state, errorState } = useContext(Context)

  return (
    <div data-testid ="loading-wrap" className={Styles.loadingWrap}>
      { state.isLoading && <Spinner className={Styles.spinner} /> }
      { errorState.main && <span className={Styles.message}>{errorState.main}</span> }
    </div>
  )
}

export default FormStatus
