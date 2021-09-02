import { h } from 'preact'
import ThreeDotsIcon from './icons/three-dots'

export default function Loader (props) {
  return (
    <div class='flex font-semibold items-center justify-center p-6 text-gray-300 text-xl'>
      {props.children || (
        <ThreeDotsIcon class='animate-pulse h-8 w-8' />
      )}
    </div>
  )
}
