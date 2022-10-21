import React from 'react'
import Styles from './formStatus-styles.scss'

import Spinner from '@/presentation/components/spinner/spinner'

type FormStatusProps = {
  message: string
}

const FormStatus: React.FC<FormStatusProps> = ({ message }: FormStatusProps) => {
  return (
    <div className={Styles.loadingWrap}>
      <Spinner className={Styles.spinner} />
      <span className={Styles.message}>{message}</span>
    </div>
  )
}

export default FormStatus
