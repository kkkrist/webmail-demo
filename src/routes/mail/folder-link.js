import { h } from 'preact'
import { useState } from 'preact/hooks'

import ArchiveIcon from '../../components/icons/archive'
import InboxIcon from '../../components/icons/inbox'
import FolderIcon from '../../components/icons/folder'
import FolderIconX from '../../components/icons/folder-x'
import MailboxIcon from '../../components/icons/mailbox'
import PenIcon from '../../components/icons/pen'
import TrashIcon from '../../components/icons/trash'

const icons = {
  ArchiveIcon,
  InboxIcon,
  FolderIcon,
  FolderIconX,
  MailboxIcon,
  PenIcon,
  TrashIcon
}

const FolderLink = ({
  currentFolder,
  icon,
  isActive,
  moveMessage,
  name,
  params,
  unread
}) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false)

  const Icon = icons[icon]

  let href = `/mail/${name}`
  if (params) {
    href += `?${params}`
  }

  return (
    <a
      class={`flex group hover:bg-gray-200 hover:text-gray-800 m-1 px-3 py-2 rounded ${
        isActive ? 'bg-gray-200 text-gray-800' : 'text-gray-600'
      } ${isDraggedOver ? 'bg-gray-200 text-yellow-600' : ''}`}
      data-foldername={name}
      href={href}
      draggable={false}
      key={name}
      onClick={e => isActive && e.preventDefault()}
      native={isActive}
      onDragEnter={() => {
        setIsDraggedOver(true)
      }}
      onDragLeave={() => {
        setIsDraggedOver(false)
      }}
      onDragOver={e => {
        if (currentFolder !== name) {
          e.preventDefault()
        }
      }}
      onDrop={e => {
        e.preventDefault()
        setIsDraggedOver(false)
        moveMessage(e.dataTransfer.getData('text/plain'), name)
      }}
    >
      <div
        class={`group-active:text-yellow-600 mx-2 pointer-events-none ${
          isActive
            ? 'text-yellow-600'
            : 'group-hover:text-gray-600 text-gray-400'
        }`}
      >
        <Icon
          class={isDraggedOver ? 'text-yellow-600' : undefined}
          icon={icon}
        />
      </div>

      {unread ? (
        <div class='flex items-center justify-between pointer-events-none w-full'>
          <div class='group-active:text-yellow-600 mx-2'>{name}</div>
          <div
            class={`group-active:text-yellow-600 group-hover:bg-gray-300 mx-2 px-2 rounded-full text-center ${
              isActive ? 'bg-gray-300' : 'bg-gray-200'
            }`}
            style={{ minWidth: '1.5rem' }}
          >
            {unread}
          </div>
        </div>
      ) : (
        <div class='group-active:text-yellow-600 mx-2 pointer-events-none'>
          {name}
        </div>
      )}
    </a>
  )
}

export default FolderLink
