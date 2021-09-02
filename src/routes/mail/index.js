import { h } from 'preact'
import { useEffect } from 'preact/hooks'
import { route } from 'preact-router'

import useMail, {
  getFolderIndexes,
  getMessageIndexes
} from '../../hooks/use-mail'

import Composer from './composer'
import Message from './message'
import Messages from './messages'
import Sidebar from './sidebar'

const getMsg = tree => ({ id } = {}) => {
  if (id) {
    const { treeIdx, folderIdx, msgIdx } = getMessageIndexes(id, tree)
    return {
      ...tree[treeIdx].folders[folderIdx].messages[msgIdx],
      folderName: tree[treeIdx].folders[folderIdx].name
    }
  }
}

const getChildren = (message, tree) => message?.children?.map(getMsg(tree))

const getParent = (message, tree) => getMsg(tree)(message?.parent)

const Mail = ({
  compose,
  desc,
  folderName,
  messageId,
  order,
  redirect,
  searchterm,
  url
}) => {
  const {
    addMessage,
    addToSelection,
    messages,
    message,
    moveMessage,
    reload,
    removeFromSelection,
    saveMessage,
    selection,
    tree
  } = useMail({
    desc,
    folderName: folderName ?? 'Inbox',
    messageId,
    order,
    searchterm
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('mailUrl', url)
    }
  }, [url])

  useEffect(() => {
    if (compose !== 'new' && !folderName && redirect !== 'none') {
      return route('/mail/Inbox')
    }

    if (
      messageId &&
      messages?.length &&
      messages.every(m => {
        const i = getFolderIndexes(m.id, tree)
        return i && tree[i.treeIdx].folders[i.folderIdx].name === folderName
      }) &&
      !messages.find(m => m.id === messageId) &&
      !message
    ) {
      return route(`/mail/${folderName}`)
    }
  })

  return (
    <div class='md:fixed md:flex md:h-screen w-full'>
      <Sidebar
        folderName={folderName}
        folders={tree}
        moveMessage={moveMessage}
        reload={reload}
        url={url}
      />

      <Messages
        addToSelection={addToSelection}
        desc={desc}
        folderName={folderName}
        messageId={messageId}
        messages={messages}
        order={order}
        removeFromSelection={removeFromSelection}
        selection={selection}
        url={url}
      />

      <Message
        children={getChildren(message, tree)}
        folderName={folderName}
        message={message}
        messageId={messageId}
        moveMessage={moveMessage}
        parent={getParent(message, tree)}
        selection={selection}
        url={url}
      />

      {compose !== undefined && (
        <Composer
          addMessage={addMessage}
          compose={compose}
          message={message}
          moveMessage={moveMessage}
          saveMessage={saveMessage}
          url={url}
        />
      )}
    </div>
  )
}

export default Mail
