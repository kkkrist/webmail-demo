import { h } from 'preact'

export default function BoxArrowInUpRight (props) {
  return (
    <svg
      width={16}
      height={16}
      fill='currentColor'
      viewBox='0 0 16 16'
      {...props}
    >
      <path
        fillRule='evenodd'
        d='M6.364 13.5a.5.5 0 00.5.5H13.5a1.5 1.5 0 001.5-1.5v-10A1.5 1.5 0 0013.5 1h-10A1.5 1.5 0 002 2.5v6.636a.5.5 0 101 0V2.5a.5.5 0 01.5-.5h10a.5.5 0 01.5.5v10a.5.5 0 01-.5.5H6.864a.5.5 0 00-.5.5z'
      />
      <path
        fillRule='evenodd'
        d='M11 5.5a.5.5 0 00-.5-.5h-5a.5.5 0 000 1h3.793l-8.147 8.146a.5.5 0 00.708.708L10 6.707V10.5a.5.5 0 001 0v-5z'
      />
    </svg>
  )
}
