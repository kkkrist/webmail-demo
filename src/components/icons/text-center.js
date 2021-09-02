import { h } from 'preact'

export default function TextCenter (props) {
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
        d='M4 12.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-2-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm2-3a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-2-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z'
      />
    </svg>
  )
}
