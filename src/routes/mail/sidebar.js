import { h } from 'preact'
import FolderLink from './folder-link'

import ArrowRepeatIcon from '../../components/icons/arrow-repeat'
import PencilSquareIcon from '../../components/icons/pencil-square'
import Placeholder from '../../components/placeholder'

import { getParams } from '../../utils'

const Sidebar = ({ folderName, folders, moveMessage, reload, url }) => {
  const [path, params] = url.split('?')

  return (
    <div
      class={`bg-gray-100 font-semibold md:block overflow-y-auto text-sm md:w-1/5 z-20 ${
        folderName ? 'hidden' : ''
      }`}
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      <div class='bg-gray-100 flex items-center justify-between px-6 py-2 shadow sticky text-gray-400 top-0'>
        <button
          class='active:(text-yellow-600 transition-none) focus:outline-none hover:text-black text-gray-400 transition-color'
          onClick={reload}
          title='Refresh'
          type='button'
        >
          <ArrowRepeatIcon class='group-active:(text-yellow-500 transition-none) group-hover:text-black h-5 transition-color w-5' />
        </button>

        <a
          class='focus:outline-none group'
          href={`${path}?${getParams(params, { compose: 'new' })}`}
        >
          <PencilSquareIcon class='group-active:(text-yellow-500 transition-none) group-hover:text-black h-5 transition-color w-5' />
        </a>
      </div>

      {folders ? (
        <nav class='px-6'>
          {folders.map(tree => (
            <div class='my-3' key={tree.name}>
              <p class='b-4 uppercase font-bold text-gray-400'>{tree.name}</p>

              <div class='-m-1'>
                {tree.folders.map(folder => (
                  <FolderLink
                    currentFolder={folderName}
                    isActive={folder.name === folderName}
                    moveMessage={moveMessage}
                    params={params}
                    unread={folder.messages.filter(m => m.unread).length}
                    {...folder}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      ) : (
        <Placeholder />
      )}
    </div>
  )
}

export default Sidebar
