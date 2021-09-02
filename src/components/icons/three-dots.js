import { h } from 'preact'

export default function ThreeDots (props) {
  return (
    <svg
      width={16}
      height={16}
      fill='currentColor'
      viewBox='0 0 16 16'
      {...props}
    >
      <path d='M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z' />
    </svg>
  )
}
