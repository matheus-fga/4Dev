import React, { useContext } from 'react'
import Styles from './input-styles.scss'

import Context from '@/presentation/contexts/form/formContext'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  name: string
}

const Input: React.FC<Props> = (props: Props) => {
  const { state, setState, errorState } = useContext(Context)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    })
  }

  const getStatus = (): string => {
    return '🔴'
  }

  const getTitle = (): string => {
    return errorState[props.name]
  }

  return (
    <div className={Styles.inputWrap}>
      <input data-testid={props.name} {...props} onChange={handleChange}/>
      <span data-testid={`${props.name}-status`} title={getTitle()} className={Styles.status}>{getStatus()}</span>
    </div>
  )
}

export default Input
