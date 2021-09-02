import { useEffect, useState } from 'preact/hooks'
import { route } from 'preact-router'
import { getDelay, getNewMessage } from '../utils'

const cache = new Set()

const data = {
  tree: undefined,
  messages: undefined,
  message: undefined,
  selection: []
}

const proxy = new Proxy(data, {
  set: (obj, prop, value) => {
    dispatchEvent(new CustomEvent(prop, { detail: value }))
    return Reflect.set(obj, prop, value)
  }
})

export const getFolderIndexes = (name, tree) => {
  for (let treeIdx = 0; treeIdx < tree.length; treeIdx++) {
    for (
      let folderIdx = 0;
      folderIdx < tree[treeIdx].folders.length;
      folderIdx++
    ) {
      if (tree[treeIdx].folders[folderIdx].name === name) {
        return { treeIdx, folderIdx }
      }
    }
  }
}

export const getMessageIndexes = (id, tree) => {
  for (let treeIdx = 0; treeIdx < tree.length; treeIdx++) {
    for (
      let folderIdx = 0;
      folderIdx < tree[treeIdx].folders.length;
      folderIdx++
    ) {
      for (
        let msgIdx = 0;
        msgIdx < tree[treeIdx].folders[folderIdx].messages.length;
        msgIdx++
      ) {
        if (tree[treeIdx].folders[folderIdx].messages[msgIdx].id === id) {
          return { treeIdx, folderIdx, msgIdx }
        }
      }
    }
  }
}

const mapper = (desc, folderName, order, searchterm) => tree => {
  const folder = tree
    ?.reduce((acc, tree) => [...acc, ...tree.folders], [])
    .find(folder => folder.name === folderName)

  return folder?.messages
    .filter(m =>
      searchterm
        ? Object.values(m).some(val =>
            val
              .toString()
              .toLowerCase()
              .includes(searchterm.toLowerCase())
          )
        : true
    )
    .sort((a, b) => {
      if (a[order].unix && b[order].unix) {
        return desc === 'false'
          ? a[order].unix() - b[order].unix()
          : b[order].unix() - a[order].unix()
      }

      return desc === 'false'
        ? a[order].toString().localeCompare(b[order].toString())
        : b[order].toString().localeCompare(a[order].toString())
    })
}

const useMail = ({
  desc = 'true',
  folderName,
  messageId,
  order = 'date',
  searchterm = ''
} = {}) => {
  const [tree, setTree] = useState(proxy.tree)
  const [messages, setMessages] = useState(proxy.messages)
  const [message, setMessage] = useState(proxy.message)
  const [selection, setSelection] = useState(proxy.selection)

  const addMessage = (newMessage, targetFolder) => {
    const folderIdx = getFolderIndexes(targetFolder, proxy.tree)

    setTimeout(() => {
      const nextTree = [...proxy.tree]

      nextTree[folderIdx.treeIdx].folders[folderIdx.folderIdx].messages.push(
        newMessage
      )

      if (newMessage.parent && targetFolder === 'Sent') {
        const parentIdx = getMessageIndexes(newMessage.parent.id, nextTree)
        const newParent = {
          ...nextTree[parentIdx.treeIdx].folders[parentIdx.folderIdx].messages[
            parentIdx.msgIdx
          ],
          isTransitioning: false
        }
        newParent.children = [
          ...(newParent.children ?? []),
          { action: newMessage.parent.action, id: newMessage.id }
        ]
        saveMessage(newParent)
      }

      proxy.tree = nextTree
    }, getDelay())
  }

  const addToSelection = (...id) => {
    proxy.selection = [...proxy.selection, ...id]
  }

  const moveMessage = (ids, nextFolder, nextMessage) => {
    const folderIdx = getFolderIndexes(nextFolder, proxy.tree)

    ids = selection.length > 0 ? selection : Array.isArray(ids) ? ids : [ids]

    proxy.selection = proxy.selection.filter(id => !ids.includes(id))
    proxy.messages = proxy.messages.map(m =>
      ids.includes(m.id) ? { ...m, isTransitioning: true } : m
    )

    if (ids.includes(message?.id)) {
      proxy.message = { ...proxy.message, isTransitioning: true }
    }

    setTimeout(() => {
      for (const id of ids) {
        const isPurge = folderName === 'Trash' && nextFolder === 'Trash'
        const nextTree = [...proxy.tree]

        const msgIdx = getMessageIndexes(id, nextTree)

        const [msg] = nextTree[msgIdx.treeIdx].folders[
          msgIdx.folderIdx
        ].messages.splice(msgIdx.msgIdx, 1)

        if (isPurge && msg.children) {
          msg.children.forEach(child => {
            const { treeIdx, folderIdx, msgIdx } = getMessageIndexes(
              child.id,
              nextTree
            )
            delete nextTree[treeIdx].folders[folderIdx].messages[msgIdx].parent
          })
        }

        if (isPurge && msg.parent) {
          const { treeIdx, folderIdx, msgIdx } = getMessageIndexes(
            msg.parent.id,
            nextTree
          )
          nextTree[treeIdx].folders[folderIdx].messages[
            msgIdx
          ].children = nextTree[treeIdx].folders[folderIdx].messages[
            msgIdx
          ].children.filter(child => child.id !== msg.id)
        }

        if (!isPurge) {
          nextTree[folderIdx.treeIdx].folders[
            folderIdx.folderIdx
          ].messages.push(id === nextMessage?.id ? nextMessage : msg)
        }

        if (nextFolder === 'Sent' && nextMessage?.parent) {
          const parentIdx = getMessageIndexes(nextMessage.parent.id, nextTree)
          const newParent =
            nextTree[parentIdx.treeIdx].folders[parentIdx.folderIdx].messages[
              parentIdx.msgIdx
            ]
          newParent.children = [
            ...(newParent.children ?? []),
            { action: nextMessage.parent.action, id: nextMessage.id }
          ]
          saveMessage(newParent)
        }

        proxy.tree = nextTree

        if (message?.id === id) {
          setMessage()
          route(`/mail/${folderName}/`)
        }
      }
    }, getDelay())
  }

  const reload = async () => {
    if (
      !proxy.tree[0].folders[0].messages[
        proxy.tree[0].folders[0].messages.length - 1
      ]?.autoGenerated ||
      new Date().getTime() % 3 === 0
    ) {
      const message = await getNewMessage()
      const nextTree = [...proxy.tree]
      nextTree[0].folders[0].messages.push(message)
      proxy.tree = nextTree
    }
  }

  const removeFromSelection = (...id) => {
    proxy.selection = proxy.selection.filter(id_ => !id.includes(id_))
  }

  const saveMessage = newMessage => {
    const i = proxy.messages.findIndex(m => m.id === newMessage.id)
    const msgIdx = getMessageIndexes(newMessage.id, proxy.tree)

    if (i > -1) {
      proxy.messages = proxy.messages.map(m =>
        m.id === newMessage.id ? { ...m, isTransitioning: true } : m
      )
    }

    if (proxy.message?.id === newMessage.id) {
      proxy.message.isTransitioning = true
    }

    setTimeout(() => {
      const nextTree = [...proxy.tree]
      nextTree[msgIdx.treeIdx].folders[msgIdx.folderIdx].messages[
        msgIdx.msgIdx
      ] = newMessage
      proxy.tree = nextTree

      if (proxy.message?.id === newMessage.id) {
        proxy.message = newMessage
      }

      if (i > -1) {
        const nextMessages = [...proxy.messages]
        nextMessages[i] = newMessage
        proxy.messages = nextMessages
      }
    }, getDelay())
  }

  useEffect(() => {
    const handler = ({ detail }) => setTree(detail)
    addEventListener('tree', handler)
    return () => removeEventListener('tree', handler)
  }, [])

  useEffect(() => {
    const handler = ({ detail }) => setMessages(detail)
    addEventListener('messages', handler)
    return () => removeEventListener('messages', handler)
  }, [])

  useEffect(() => {
    const handler = ({ detail }) => setMessage(detail)
    addEventListener('message', handler)
    return () => removeEventListener('message', handler)
  }, [])

  useEffect(() => {
    const handler = ({ detail }) => setSelection(detail)
    addEventListener('selection', handler)
    return () => removeEventListener('selection', handler)
  }, [])

  useEffect(() => {
    const cacheId = `${folderName}?${Object.entries({
      desc,
      folderName,
      order,
      searchterm
    })
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`

    if (!cache.has(cacheId)) {
      proxy.messages = undefined
    }

    if (folderName) {
      const timer = setTimeout(() => {
        proxy.messages = mapper(desc, folderName, order, searchterm)(tree)
        cache.add(cacheId)
      }, getDelay(cache.has(cacheId) ? 0 : undefined))

      return () => clearTimeout(timer)
    }
  }, [desc, folderName, order, searchterm, tree])

  useEffect(() => {
    if (!cache.has(messageId)) {
      proxy.message = undefined
    }

    if (proxy.tree) {
      const timer = setTimeout(() => {
        const indexes = getMessageIndexes(messageId, proxy.tree)

        if (indexes) {
          const { treeIdx, folderIdx, msgIdx } = indexes
          proxy.message =
            proxy.tree[treeIdx].folders[folderIdx].messages[msgIdx]
          proxy.tree[treeIdx].folders[folderIdx].messages[msgIdx].unread = false
          cache.add(messageId)
        }
      }, getDelay(cache.has(messageId) ? 0 : undefined))
      return () => clearTimeout(timer)
    }
  }, [messageId])

  return {
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
  }
}

if (typeof window !== 'undefined') {
  window
    .fetch('/assets/data/mail.json')
    .then(res => res.json())
    .then(tree => {
      proxy.tree = tree
    })
}

export default useMail
