import { h } from 'preact'
import DisplayMessage from './display-message'

import ArchiveIcon from '../../components/icons/archive'
import ChevronLeft from '../../components/icons/chevron-left'
import FolderXIcon from '../../components/icons/folder-x'
import ForwardIcon from '../../components/icons/forward'
import Placeholder from '../../components/placeholder'
import ReplyAllIcon from '../../components/icons/reply-all'
import ReplyIcon from '../../components/icons/reply'
import TrashIcon from '../../components/icons/trash'

import { getParams } from '../../utils'

const Message = ({
  children,
  folderName,
  message: m,
  messageId: id,
  moveMessage,
  parent,
  selection,
  url
}) => {
  const [path, params] = url.split('?')

  const buttonsLeft = [
    {
      disabled: !id && selection.length === 0,
      Icon: TrashIcon,
      onClick: () =>
        moveMessage(selection.length > 0 ? selection : id, 'Trash'),
      title: 'Move to Trash'
    },
    {
      disabled: !id & (selection.length === 0) || folderName === 'Junk',
      Icon: FolderXIcon,
      onClick: () => moveMessage(selection.length > 0 ? selection : id, 'Junk'),
      title: 'Mark as Spam'
    },
    {
      disabled: (!id && selection.length === 0) || folderName === 'Archive',
      Icon: ArchiveIcon,
      onClick: () =>
        moveMessage(selection.length > 0 ? selection : id, 'Archive'),
      title: 'Archive'
    }
  ]

  const buttonsRight = [
    {
      disabled: !id,
      Icon: ReplyIcon,
      href: `${path}?${getParams(params, { compose: `reply` })}`,
      title: 'Reply'
    },
    {
      disabled: !id,
      Icon: ReplyAllIcon,
      href: `${path}?${getParams(params, { compose: `reply-all` })}`,
      title: 'Reply All'
    },
    {
      disabled: !id,
      Icon: ForwardIcon,
      href: `${path}?${getParams(params, { compose: `forward` })}`,
      title: 'Forward'
    }
  ]

  return (
    <main
      class={`bg-gradient-to-br flex-grow from-white md:block md:w-1 overflow-y-auto to-gray-100 ${
        !id ? 'hidden' : ''
      }`}
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      <div class='bg-gray-100 flex flex-wrap font-semibold items-center justify-between px-6 py-2 shadow sticky text-gray-400 top-0 z-10'>
        <a
          class='active:text-yellow-500 focus:outline-none md:hidden'
          draggable='false'
          href={`/mail/${folderName}`}
        >
          <ChevronLeft class='h-5 w-5' />
        </a>

        <div class='-m-3 flex'>
          {buttonsLeft.map(({ Icon, href, ...props }) =>
            href ? (
              <a
                class={`focus:outline-none group m-3 ${
                  props.disabled ? 'opacity-50 pointer-events-none' : ''
                }`}
                href={href}
                key={props.title}
                {...props}
              >
                <Icon class='group-active:(text-yellow-500 transition-none) group-hover:text-black h-5 transition-color w-5' />
              </a>
            ) : (
              <button
                class={`focus:outline-none group m-3 ${
                  props.disabled ? 'opacity-50 pointer-events-none' : ''
                }`}
                key={props.title}
                type='button'
                {...props}
              >
                <Icon class='group-active:(text-yellow-500 transition-none) group-hover:text-black h-5 transition-color w-5' />
              </button>
            )
          )}
        </div>

        <div class='-m-3 flex'>
          {buttonsRight.map(({ Icon, href, ...props }) =>
            href ? (
              <a
                class={`focus:outline-none group m-3 ${
                  props.disabled ? 'opacity-50 pointer-events-none' : ''
                }`}
                href={href}
                key={props.title}
                {...props}
              >
                <Icon class='group-active:(text-yellow-500 transition-none) group-hover:text-black h-5 transition-color w-5' />
              </a>
            ) : (
              <button
                class={`focus:outline-none group m-3 ${
                  props.disabled ? 'opacity-50 pointer-events-none' : ''
                }`}
                key={props.title}
                type='button'
                {...props}
              >
                <Icon class='group-active:(text-yellow-500 transition-none) group-hover:text-black h-5 transition-color w-5' />
              </button>
            )
          )}
        </div>
      </div>

      {parent && <DisplayMessage isParent message={parent} url={url} />}

      {m ? (
        <DisplayMessage folderName={folderName} message={m} url={url} />
      ) : id ? (
        <Placeholder />
      ) : null}

      {children?.map(child => (
        <DisplayMessage isChild message={child} url={url} />
      ))}
    </main>
  )
}

export default Message
