import { h } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import { getParams } from '../../utils'

import ForwardIcon from '../../components/icons/forward'
import ReplyAllIcon from '../../components/icons/reply-all'
import ReplyIcon from '../../components/icons/reply'

const ActionIcon = ({ parent, ...otherProps }) => {
  switch (parent?.action) {
    case 'forward':
      return <ForwardIcon {...otherProps} />

    case 'reply':
      return <ReplyIcon {...otherProps} />

    case 'reply-all':
      return <ReplyAllIcon {...otherProps} />

    default:
      return null
  }
}

const DisplayMessage = ({ isChild, isParent, folderName, message: m, url }) => {
  const [path, params] = url.split('?')
  const msgRef = useRef()

  useEffect(() => {
    document.title = `${document.title} → ${
      m.subject.length < 30 ? m.subject : m.subject.substr(0, 30) + '…'
    }`
    msgRef.current?.scrollIntoView({ behavior: 'smooth' })
  })

  folderName = folderName ?? m.folderName

  return (
    <div
      class={`bg-white border m-6 p-6 rounded shadow-lg ${
        m.isTransitioning ? 'opacity-60' : ''
      }`}
      ref={!isChild && !isParent && msgRef}
      style={{ scrollMargin: 60 }}
    >
      <div class='flex -m-2'>
        <img
          class='border h-16 m-2 object-cover rounded-full self-center w-16'
          src={m.avatarUrl}
        />

        <div class='flex-grow m-2'>
          <div class='sm:flex flex-grow'>
            <div class='flex-grow'>
              <p class='font-semibold'>
                {m.senderName}{' '}
                <span class='font-normal text-gray-400'>
                  {' '}
                  <span>
                    {String.fromCodePoint(0x3c)}
                    {m.senderEmail}
                    {String.fromCodePoint(0x3e)}
                  </span>
                </span>
              </p>

              <p>{m.subject}</p>

              <p class='leading-loose text-gray-400 text-sm'>
                {new Date(m.date).toLocaleString()}
              </p>
            </div>

            <div class='flex sm:flex-col items-center -mx-2 sm:justify-between'>
              <span class='bg-gray-300 font-semibold mx-2 my-2 sm:my-0 px-2 py-1 rounded text-xs'>
                {folderName}
              </span>

              <ActionIcon
                class='h-5 mx-2 my-2 sm:my-0 text-gray-400 w-5'
                parent={m.parent}
              />
            </div>
          </div>
        </div>
      </div>

      <hr class='mx-auto mb-6 mt-6' />

      {folderName === 'Drafts' || isChild || isParent ? (
        <a
          href={
            folderName === 'Drafts'
              ? `${path}?${getParams(params, { compose: `draft` })}`
              : `/mail/${m.folderName}/${m.id}`
          }
        >
          <div
            class='editor leading-relaxed mt-4'
            dangerouslySetInnerHTML={{ __html: m.body }} // eslint-disable-line
          />
        </a>
      ) : (
        <div
          class='editor leading-relaxed mt-4'
          dangerouslySetInnerHTML={{ __html: m.body }} // eslint-disable-line
        />
      )}
    </div>
  )
}

export default DisplayMessage
