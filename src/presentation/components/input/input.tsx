import React, { useContext } from 'react'
import Styles from './input-styles.scss'

import Context from '@/presentation/contexts/form/formContext'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  name: string
}

const Input: React.FC<Props> = (props: Props) => {
  const { errorState } = useContext(Context)

  const getStatus = (): string => {
    return '🔴'
  }

  const getTitle = (): string => {
    return errorState[props.name]
  }

  return (
    <div className={Styles.inputWrap}>
      <input {...props} />
      <span data-testid={`${props.name}-status`} title={getTitle()} className={Styles.status}>{getStatus()}</span>
    </div>
  )
}

export default Input
