import { h } from 'preact'
import { createPortal } from 'preact/compat'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'preact/hooks'

export const DropdownItem = ({ children, divider, header, ...props }) => {
  const Component = props.href ? 'a' : 'button'
  return divider ? (
    <hr class='my-3' {...props} />
  ) : header ? (
    <div
      class='font-semibold opacity-75 px-2 py-1 text-center text-gray-400 text-sm text-uppercase'
      {...props}
    >
      {children}
    </div>
  ) : (
    <Component
      class={`active:text-yellow-500 focus:outline-none font-semibold hover:bg-gray-100 px-3 py-2 text-left text-sm ${
        props.disabled ? 'text-gray-400' : ''
      }`}
      data-dropdown-item
      {...props}
    >
      {children}
    </Component>
  )
}

export const DropdownMenu = ({
  callback = () => {},
  children,
  isOpen,
  margin = 10,
  posX,
  posY: top,
  ...props
}) => {
  const [left, setLeft] = useState(posX)
  const ref = useRef()

  useLayoutEffect(() => {
    if (typeof window !== undefined) {
      const width = ref.current?.clientWidth
      if (posX + width > window.innerWidth) {
        let nextState = window.innerWidth - width
        setLeft(nextState > -1 ? nextState : 0)
      }
    }
  }, [posX])

  if (typeof window !== 'undefined') {
    return createPortal(
      <div
        class={`animation-fade-down-in bg-white border fixed flex flex-col rounded p-3 shadow-lg top-0 z-30 ${
          isOpen ? '' : 'hidden'
        }`}
        onClick={callback}
        ref={ref}
        style={{
          left: left - margin >= margin ? left - margin : margin,
          maxWidth: `calc(100vw - ${margin * 2}px)`,
          top: top + margin
        }}
        {...props}
      >
        {children}
      </div>,
      document.getElementById('dropdowns')
    )
  }

  return null
}

const Dropdown = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState(null)

  const onClose = useCallback(
    event => {
      const path = event.composedPath()

      if (
        (event.type === 'keyup' && event.key === 'Escape') ||
        (event.type === 'click' &&
          isOpen &&
          event.currentTarget === window &&
          !path.some(el => el.id === 'dropdowns')) ||
        path.some(el => el.dataset?.dropdownItem || el.dataset?.menuToggle)
      ) {
        setIsOpen(false)
      }
    },
    [isOpen]
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('click', onClose)
      window.addEventListener('keyup', onClose)
      return () => {
        window.removeEventListener('click', onClose)
        window.removeEventListener('keyup', onClose)
      }
    }
  }, [onClose])

  return children({
    state: { isOpen, position },
    toggleDropdown: event => {
      const el = event.currentTarget
      setPosition({ posX: el.offsetLeft, posY: el.offsetTop + el.clientHeight })
      setIsOpen(prevState => !prevState)
    }
  })
}

export default Dropdown
