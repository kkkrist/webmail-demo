import { h } from 'preact'
import { route } from 'preact-router'

import user from '../data/user'
import useMail from '../hooks/use-mail'
import { formatTimestamp, getParam, getParams } from '../utils'
import Dropdown, { DropdownItem, DropdownMenu } from './dropdown'

import BellIcon from './icons/bell'
import CalendarIcon from './icons/calendar'
import ChevronDownIcon from './icons/chevron-down'
import InboxIcon from './icons/inbox'
import Input from './input'
import GearIcon from './icons/gear'
import JournalTextIcon from './icons/journal-text'
import PeopleIcon from './icons/people'

const navItems = [
  { Icon: InboxIcon, label: 'Mail', path: '/mail' },
  { Icon: PeopleIcon, label: 'Contacts', path: '/contacts' },
  { Icon: CalendarIcon, label: 'Calendar', path: '/calendar' },
  { Icon: JournalTextIcon, label: 'Notes', path: '/notes' }
]

const Button = ({ children, extraClasses = '', ...props }) => (
  <button
    class={`active:text-yellow-500 focus:outline-none hover:bg-indigo-600 rounded ${extraClasses}`}
    {...props}
  >
    {children}
  </button>
)

const Header = ({ isOpen, toggleOpen, url = '' }) => {
  const { tree } = useMail()

  const urlParts = url?.split('?')

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        window.alert(
          'You logged out, went outside for a walk, found it boring and logged back in.'
        )
      }, 0)
    }
  }

  return (
    <header class='bg-gradient-to-r from-indigo-600 to-indigo-500 fixed md:flex font-semibold md:h-16 items-center text-sm text-gray-100 top-0 w-full z-20'>
      <div class='bg-indigo-700 px-6 py-3 md:w-1/5'>
        <div class='items-center flex -mx-2'>
          <img
            class='border border-gray-200 h-10 mx-2 rounded-full w-10'
            src={user.avatar}
          />

          <div class='flex items-center overflow-hidden justify-between w-full'>
            <div class='mx-2 truncate'>{user.fullName}</div>

            <div class='md:hidden'>
              <Button
                class='active:text-yellow-500 focus:outline-none hover:bg-indigo-600 m-1 p-1 rounded'
                data-menu-toggle
                extraClasses='hover:bg-indigo-600'
                onClick={toggleOpen}
                title='User Settings'
                type='button'
              >
                <ChevronDownIcon class={isOpen ? 'rotate-180' : undefined} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        class={`md:flex flex-grow items-center justify-between -mx-2 md:-my-2 px-6 py-3 md:py-0 shadow-xl md:shadow-none text-gray-100 ${
          !isOpen ? 'hidden' : ''
        }`}
      >
        <nav class='flex flex-wrap md:flex-nowrap flex-wrap items-center'>
          {navItems.map(({ Icon, label, path }) => {
            const isActive =
              url?.startsWith(path) || (path === '/mail' && url === '/')

            if (typeof window !== 'undefined') {
              path = window.localStorage[`${path.split('/')[1]}Url`] || path
            }

            return (
              <a
                class={`active:text-yellow-500 inline-block hover:bg-indigo-700 px-4 py-1 m-2 sm:my-3 rounded ${
                  isActive ? 'bg-indigo-700' : ''
                }`}
                draggable={false}
                href={path}
                onClick={toggleOpen}
              >
                <div class='flex items-center'>
                  <Icon
                    class={`align-middle block inline mr-2 sm:mr-2 md:mr-0 lg:mr-2 opacity-50 h-5 w-5 ${
                      isActive ? 'text-yellow-500' : ''
                    }`}
                  />
                  <div class='md:hidden lg:block'>{label}</div>
                </div>
              </a>
            )
          })}
        </nav>

        <div class='-m-2 flex items-center'>
          <Input
            className='bg-indigo-700 border-2 border-white border-opacity-0 flex-grow focus:border-opacity-50 focus:outline-none m-2 p-2 placeholder-gray-200 rounded text-sm text-white w-64'
            onInput={({ target: { value } }) =>
              route(
                `${url.split('?')[0]}?${getParams(url, { searchterm: value })}`
              )
            }
            id='searchterm'
            placeholder='Search…'
            type='search'
            value={getParam(url, 'searchterm')}
          />

          <Dropdown>
            {({ state: { isOpen, position }, toggleDropdown }) => (
              <>
                <Button
                  extraClasses={`mx-2 p-2 fixed md:static top-4 right-28 ${
                    tree &&
                    tree[0].folders[0].messages.filter(m => m.unread).length > 0
                      ? 'text-yellow-500'
                      : ''
                  }`}
                  onClick={toggleDropdown}
                  title='Notifications'
                  type='button'
                >
                  <BellIcon />
                </Button>

                <DropdownMenu
                  callback={() => isOpen && toggleOpen()}
                  isOpen={isOpen}
                  {...position}
                >
                  <DropdownItem header>Notifications</DropdownItem>

                  <ul class='flex flex-col'>
                    {tree &&
                      tree[0].folders[0].messages
                        .filter(m => m.unread)
                        .map(m => {
                          let href = `/mail/Inbox/${m.id}`

                          if (urlParts[1]) {
                            href += `?${urlParts[1]}`
                          }

                          return (
                            <li
                              class='bg-gray-100 border(l-8 indigo-200) mt-3 p-3 rounded text-sm w-80'
                              data-dropdown-item
                              key={m}
                              onClick={() => route(href, false)}
                              role='button'
                            >
                              <div class='flex items-center justify-between -mx-1'>
                                <div class='font-bold mx-1 truncate'>
                                  {m.senderName}
                                </div>
                                <div class='mx-1 text-gray-400'>
                                  {formatTimestamp(m.date)}
                                </div>
                              </div>

                              <div class='my-1 truncate'>{m.subject}</div>
                            </li>
                          )
                        })}

                    {!tree ||
                      (tree[0].folders[0].messages.filter(m => m.unread)
                        .length === 0 && (
                        <li class='w-80' data-dropdown-item>
                          <div class='font-semibold my-4 text(center gray-200 xl)'>
                            (つ ͡° ͜ʖ ͡°)つ
                          </div>
                        </li>
                      ))}
                  </ul>
                </DropdownMenu>
              </>
            )}
          </Dropdown>

          <Dropdown>
            {({ state: { isOpen, position }, toggleDropdown }) => (
              <>
                <Button
                  extraClasses='mx-2 p-2 fixed md:static top-4 right-16'
                  onClick={toggleDropdown}
                  title='Settings'
                  type='button'
                >
                  <GearIcon />
                </Button>

                <DropdownMenu
                  callback={() => isOpen && toggleOpen()}
                  isOpen={isOpen}
                  {...position}
                >
                  <DropdownItem header>Settings</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem disabled>Accounts</DropdownItem>
                  <DropdownItem disabled>Settings</DropdownItem>
                  <DropdownItem disabled>Help</DropdownItem>
                  <DropdownItem href='https://mundpropaganda.net'>
                    Who Did This?
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                </DropdownMenu>
              </>
            )}
          </Dropdown>
        </div>
      </div>
    </header>
  )
}

export default Header
