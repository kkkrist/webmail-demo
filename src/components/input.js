import { h } from 'preact'
import styles from './input.module.css'

const Input = ({ className, ...props }) => (
  <input
    className={`${className} ${styles['search-input']}`}
  {...props}
  />
)

export default Input
