import { h } from 'preact'

const iconClasses =
  'group-active:text-yellow-500 group-hover:text-black h-5 inline m-1 transition-opacity w-5'

const ActionButton = ({ icon, label, ...props }) => {
  const El = props.href ? 'a' : 'button'
  const Icon = icon

  return (
    <El
      class='font-semibold group text-gray-500 disabled:opacity-50 focus:outline-none'
      {...props}
    >
      <Icon class={iconClasses} />
      <span class='align-middle group-active:text-yellow-500 group-hover:text-black m-1 text-sm'>
        {label}
      </span>
    </El>
  )
}

export default ActionButton
