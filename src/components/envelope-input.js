import { h } from 'preact'

const EnvelopeInput = ({ label, options, ...props }) => {
  const El = options ? 'select' : 'input'

  return (
    <div class='items-center flex text-sm' key={props.id}>
      <label class='block m-1 text-gray-500 text-right w-1/6' htmlFor={props.id}>
        {label}:
      </label>

      <El
        class={`border-b h-7 m-1 w-full ${
          options ? 'px-1' : 'px-2'
        }`}
        {...props}
      >
        {options?.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </El>
    </div>
  )
}

export default EnvelopeInput
