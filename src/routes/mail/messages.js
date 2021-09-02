import { h } from 'preact'
import { route } from 'preact-router'

import ChevronLeft from '../../components/icons/chevron-left'
import Placeholder from '../../components/placeholder'
import SortDownIcon from '../../components/icons/sort-down'
import SortUpIcon from '../../components/icons/sort-up'

import { formatTimestamp, getParams } from '../../utils'

const getBodyTeaser = body => {
  const div = document.createElement('div')
  div.innerHTML = body
  return div.innerText.substring(0, 100)
}

const Messages = ({
  addToSelection,
  desc,
  folderName,
  messageId,
  messages,
  order,
  removeFromSelection,
  selection,
  url
}) => {
  const urlParts = url.split('?')

  return (
    <aside
      class={`border-l border-r md:flex flex-col overflow-y-auto md:shadow-lg text-sm md:w-1/4 z-10 ${
        !folderName || messageId ? 'hidden' : ''
      }`}
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      <div class='bg-gray-100 flex items-center justify-between px-6 py-2 shadow sticky text-gray-400 top-0'>
        <div class='flex md:hidden items-center -m-2'>
          <a
            class='active:text-yellow-500 focus:outline-none m-2 md:hidden'
            draggable={false}
            href='/mail?redirect=none'
          >
            <ChevronLeft class='h-5 w-5' />
          </a>

          <div class='m-2 font-semibold'>{folderName}</div>
        </div>

        <select
          class='bg-gray-100 focus:outline-none hover:text-black font-semibold transition-color'
          onChange={({ target: { value } }) =>
            route(`${urlParts[0]}?${getParams(url, { order: value })}`)
          }
          title='Sort Order'
          value={order}
        >
          <option value='date'>Date</option>
          <option value='senderName'>Sender</option>
          <option value='subject'>Subject</option>
        </select>

        {selection.length > 0 ? (
          <input
            checked={selection.length === messages.length}
            class='mx-1 shadow'
            onInput={({ target: { checked } }) =>
              checked
                ? addToSelection(
                    ...messages
                      .map(m => m.id)
                      .filter(id => !selection.includes(id))
                  )
                : removeFromSelection(...selection)
            }
            style={{ height: '1rem', margin: '2px 0.25rem' }}
            type='checkbox'
          />
        ) : (
          <a
            class='active:(text-yellow-500 transition-none) focus:outline-none hover:text-black transition-color'
            draggable={false}
            href={`${url.split('?')[0]}?${getParams(url, {
              desc: desc === 'false'
            })}`}
            title={desc === 'false' ? 'Ascending' : 'Descending'}
          >
            {desc === 'false' ? (
              <SortUpIcon class='h-5 w-5' />
            ) : (
              <SortDownIcon class='h-5 w-5' />
            )}
          </a>
        )}
      </div>

      {messages?.length > 0 ? (
        <ul>
          {messages.map(m => {
            let href = `/mail/${folderName}/${m.id}`

            if (urlParts[1]) {
              href += `?${urlParts[1]}`
            }

            return (
              <li
                class={`border-b group ${
                  messageId === m.id ? 'bg-indigo-100' : 'hover:bg-gray-100'
                } ${m.isTransitioning ? 'opacity-60' : ''}`}
                data-messageid={m.id}
                draggable
                key={m.id}
                onDragEnd={({ target }) => {
                  target.classList.remove('opacity-50')
                  target.querySelector('.badge')?.classList.add('hidden')
                }}
                onDragStart={e => {
                  e.target.classList.add('opacity-50')
                  e.target.querySelector('.badge')?.classList.remove('hidden')
                  e.dataTransfer.setData(
                    'text/plain',
                    e.target.dataset.messageid
                  )
                }}
              >
                <a draggable={false} href={href}>
                  <div
                    class={`px-6 py-3 relative ${
                      m.unread ? 'border-l-8 border-indigo-200' : ''
                    }`}
                  >
                    {m.children?.length > 0 && (
                      <div
                        class={`absolute px-2 right-6 rounded-full text-center text-gray-800 text-xs top-3 shadow ${
                          messageId === m.id ? 'bg-indigo-300' : 'bg-gray-300 '
                        } ${
                          selection?.length ? 'hidden' : 'group-hover:hidden'
                        }`}
                        style={{ minWidth: '1.5rem' }}
                      >
                        {m.children.length + 1}
                      </div>
                    )}

                    {selection?.length > 1 && (
                      <div
                        class='absolute badge bg-yellow-500 hidden px-2 right-6 rounded-full text-center text-white text-xs top-3 shadow'
                        style={{ minWidth: '1.5rem' }}
                      >
                        {selection.length}
                      </div>
                    )}

                    <div class='flex items-center justify-between -mx-1'>
                      <div class='font-bold mx-1 truncate'>
                        {m.to?.replace(/ [<[(]\w+@\w+\.\w+[>\])]/, '') ??
                          m.senderName}
                      </div>
                      <div
                        class={`mx-1 text-gray-400 ${
                          m.children?.length || selection.length
                            ? 'hidden'
                            : 'group-hover:hidden'
                        }`}
                      >
                        {formatTimestamp(m.date)}
                      </div>

                      <div
                        class={`hidden mx-2 ${
                          selection.length > 0 ? 'block' : 'group-hover:block'
                        }`}
                      >
                        <input
                          checked={selection.includes(m.id)}
                          class='shadow'
                          onClick={e => e.stopPropagation()}
                          onInput={({ target: { checked } }) =>
                            checked
                              ? addToSelection(m.id)
                              : removeFromSelection(m.id)
                          }
                          type='checkbox'
                        />
                      </div>
                    </div>

                    <div class='my-1 truncate'>{m.subject}</div>

                    <p
                      class='overflow-hidden text-gray-500 text-xs'
                      style={{
                        display: '-webkit-box',
                        '-webkit-box-orient': 'vertical',
                        '-webkit-line-clamp': '2'
                      }}
                    >
                      {getBodyTeaser(m.body)}
                    </p>
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      ) : messages ? (
        <div class='flex-grow'>
          <Placeholder>No messages found</Placeholder>
        </div>
      ) : (
        <div class='flex-grow'>
          <Placeholder />
        </div>
      )}
    </aside>
  )
}

export default Messages
