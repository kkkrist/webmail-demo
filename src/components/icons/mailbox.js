import { h } from 'preact'

export default function Mailbox (props) {
  return (
    <svg
      width={16}
      height={16}
      fill='currentColor'
      viewBox='0 0 16 16'
      {...props}
    >
      <path d='M4 4a3 3 0 00-3 3v6h6V7a3 3 0 00-3-3zm0-1h8a4 4 0 014 4v6a1 1 0 01-1 1H1a1 1 0 01-1-1V7a4 4 0 014-4zm2.646 1A3.99 3.99 0 018 7v6h7V7a3 3 0 00-3-3H6.646z' />
      <path d='M11.793 8.5H9v-1h5a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.354-.146l-.853-.854zM5 7c0 .552-.448 0-1 0s-1 .552-1 0a1 1 0 012 0z' />
    </svg>
  )
}
