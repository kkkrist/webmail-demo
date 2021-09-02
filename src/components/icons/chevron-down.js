import { h } from 'preact'

export default function ChevronDown (props) {
  return (
    <svg
      width={24}
      height={24}
      viewBox='0 0 24 24'
      strokeWidth={2}
      stroke='currentColor'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path d='M0 0h24v24H0z' stroke='none' />
      <path d='M6 9l6 6 6-6' />
    </svg>
  )
}
