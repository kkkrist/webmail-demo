import { h } from 'preact'
import { createPortal } from 'preact/compat'
import { useEffect, useRef, useState } from 'preact/hooks'
import { route } from 'preact-router'
import user from '../../data/user'
import { getUid, removeParams } from '../../utils'

import ActionButton from '../../components/action-button'
import EnvelopeInput from '../../components/envelope-input'

import IconArrowClockwise from '../../components/icons/arrow-clockwise'
import IconArrowCounterclockwise from '../../components/icons/arrow-counterclockwise'
import IconBoxArrowInUpRight from '../../components/icons/box-arrow-in-up-right'
import IconBoxArrowUpRight from '../../components/icons/box-arrow-up-right'
import IconImage from '../../components/icons/image'
import IconLink from '../../components/icons/link'
import IconTextCenter from '../../components/icons/text-center'
import IconTextLeft from '../../components/icons/text-left'
import IconTextRight from '../../components/icons/text-right'
import IconTypeBold from '../../components/icons/type-bold'
import IconTypeItalic from '../../components/icons/type-italic'
import IconTypeUnderline from '../../components/icons/type-underline'
import IconXSquare from '../../components/icons/x-square'

const blockFormats = [
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'p', label: 'Paragraph' },
  { value: 'blockquote', label: 'Blockquote' },
  { value: 'pre', label: 'Pre-formatted' }
]

const FormatButton = ({ isActive, ...props }) => (
  <button
    class={`flex h-8 items-center justify-center w-8 focus:(bg-gray-100 outline-none) ${
      isActive ? 'bg-gray-100' : ''
    }`}
    type='button'
    {...props}
  />
)

const quoteBody = message =>
  `<p>&nbsp;</p><blockquote class="border-l-8 border-indigo-100 pl-3"><p>${
    message.senderName
  } wrote at ${new Date(message.date).toLocaleString()}:</p>${
    message.body
  }</blockquote>`

const Composer = ({
  addMessage,
  compose,
  message,
  moveMessage,
  saveMessage,
  url
}) => {
  const [path, params] = url.split('?')

  const editorRef = useRef()

  const [state, setState] = useState({
    cc: '',
    from: user.email,
    subject: '',
    to: ''
  })

  const [focusParent, setFocusParent] = useState(
    window.getSelection().focusNode?.parentElement
  )

  const applyFormat = ({ currentTarget: { name, value } }) => {
    document.execCommand(name, false, value)
    setFocusParent(window.getSelection().focusNode?.parentElement)
  }

  const handleInput = ({ target: { id, value } }) =>
    setState(prevState => ({
      ...prevState,
      [id]: value
    }))

  const handleSave = ({ currentTarget: { name } }) => {
    if (compose === 'draft' && name === 'Drafts') {
      saveMessage({
        ...state,
        body: editorRef.current.innerHTML,
        date: new Date().toISOString()
      })
    }

    if (compose === 'draft' && name === 'Sent') {
      moveMessage(state.id, name, {
        ...state,
        body: editorRef.current.innerHTML,
        date: new Date().toISOString()
      })
    }

    if (compose !== 'draft') {
      const newMessage = {
        ...state,
        avatarUrl: user.avatar,
        body: editorRef.current?.innerHTML,
        date: new Date().toISOString(),
        id: getUid(),
        parent: {
          action: compose,
          id: message.id
        },
        senderEmail: user.email,
        senderName: user.fullName
      }

      if (message && compose !== 'new') {
        newMessage.parent = {
          action: compose,
          id: message.id
        }
      }

      addMessage(newMessage, name)
    }

    route(`${path}?${removeParams(params, ['compose'])}`)
  }

  useEffect(() => {
    if (message) {
      setState(prevState => {
        switch (compose) {
          case 'draft':
            return {
              ...prevState,
              ...message
            }

          case 'forward':
            return {
              ...prevState,
              body: quoteBody(message),
              subject: `Fwd: ${message.subject}`
            }

          case 'reply':
          case 'reply-all':
            return {
              ...prevState,
              body: quoteBody(message),
              subject: message.subject.startsWith('Re:')
                ? message.subject
                : `Re: ${message.subject}`,
              to: `${message.senderName} <${message.senderEmail}>`
            }

          default:
            return prevState
        }
      })
    }

    editorRef.current.focus()
  }, [compose, message])

  return createPortal(
    <>
      <div class='animation-fade-in bg-black fixed bottom-0 left-0 right-0 top-0' />
      <div class='fixed bottom-0 left-0 right-0 top-0 z-20'>
        <div class='md:items-center flex h-full justify-center'>
          <div class='animation-appear bg-white max-w-full overflow-hidden shadow-xl w-full md:(rounded h-5/6 w-9/12)'>
            <div class='bg-gray-100 flex flex-wrap font-semibold items-center justify-between h-11 px-6 py-3 top-0 z-10'>
              <div class='-m-3'>
                <ActionButton
                  icon={IconXSquare}
                  label='Cancel'
                  href={`${path}?${removeParams(params, ['compose'])}`}
                />
              </div>

              <div class='-m-3'>
                <div class='flex -m-3'>
                  <div class='m-3'>
                    <ActionButton
                      icon={IconBoxArrowInUpRight}
                      label='Save as draft'
                      name='Drafts'
                      onClick={handleSave}
                    />
                  </div>

                  <div class='m-3'>
                    <ActionButton
                      disabled={!state.to}
                      icon={IconBoxArrowUpRight}
                      label='Send'
                      name='Sent'
                      onClick={handleSave}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              class='flex flex-col m-3'
              onKeyUp={() =>
                setFocusParent(window.getSelection().focusNode?.parentElement)
              }
              onMouseUp={() =>
                setFocusParent(window.getSelection().focusNode?.parentElement)
              }
              style={{ height: 'calc(100% - 4rem - 4px)' }}
            >
              <div>
                <EnvelopeInput
                  id='from'
                  label='From'
                  onInput={handleInput}
                  options={[
                    {
                      label: `${user.fullName} <${user.email}>`,
                      value: user.email
                    }
                  ]}
                  value={state.from}
                />

                <EnvelopeInput
                  id='to'
                  label='To'
                  onInput={handleInput}
                  value={state.to}
                />

                <EnvelopeInput
                  id='cc'
                  label='CC'
                  onInput={handleInput}
                  value={state.cc}
                />

                <EnvelopeInput
                  id='subject'
                  label='Subject'
                  onInput={handleInput}
                  value={state.subject}
                />
              </div>

              <div class='flex flex-wrap py-3'>
                <div class='border flex m-1 rounded'>
                  <select
                    class='focus:outline-none mx-1 text-sm'
                    name='fontName'
                    onInput={applyFormat}
                    value={
                      (focusParent?.localName === 'font' &&
                        focusParent?.getAttribute('face')) ||
                      'sans-serif'
                    }
                  >
                    <option value='sans-serif'>Sans-Serif</option>
                    <option value='serif'>Serif</option>
                    <option value='monospace'>Monospace</option>
                  </select>

                  <select
                    class='focus:outline-none mx-1 text-sm'
                    name='formatBlock'
                    onInput={applyFormat}
                    value={
                      blockFormats
                        .map(b => b.value)
                        .includes(focusParent?.localName)
                        ? focusParent.localName
                        : 'p'
                    }
                  >
                    {blockFormats.map(({ label, value }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div class='flex m-1 border rounded'>
                  <FormatButton
                    isActive={focusParent?.localName === 'b'}
                    name='bold'
                    onClick={applyFormat}
                  >
                    <IconTypeBold />
                  </FormatButton>
                  <FormatButton
                    isActive={focusParent?.localName === 'i'}
                    name='italic'
                    onClick={applyFormat}
                  >
                    <IconTypeItalic />
                  </FormatButton>
                  <FormatButton
                    isActive={focusParent?.localName === 'u'}
                    name='underline'
                    onClick={applyFormat}
                  >
                    <IconTypeUnderline />
                  </FormatButton>
                  <div class='flex items-center justify-center'>
                    <input
                      class='bg-transparent h-5 m-1 w-4 focus:outline-none'
                      name='foreColor'
                      onInput={applyFormat}
                      type='color'
                      value={
                        (focusParent?.localName === 'font' &&
                          focusParent?.getAttribute('color')) ||
                        '#000000'
                      }
                    />
                  </div>
                </div>

                <div class='flex m-1 border rounded'>
                  <FormatButton
                    isActive={
                      focusParent?.style.textAlign === 'left' ||
                      focusParent?.parentElement?.style.textAlign === 'left'
                    }
                    name='justifyLeft'
                    onClick={applyFormat}
                  >
                    <IconTextLeft />
                  </FormatButton>
                  <FormatButton
                    isActive={
                      focusParent?.style.textAlign === 'center' ||
                      focusParent?.parentElement?.style.textAlign === 'center'
                    }
                    name='justifyCenter'
                    onClick={applyFormat}
                  >
                    <IconTextCenter />
                  </FormatButton>
                  <FormatButton
                    isActive={
                      focusParent?.style.textAlign === 'right' ||
                      focusParent?.parentElement?.style.textAlign === 'right'
                    }
                    name='justifyRight'
                    onClick={applyFormat}
                  >
                    <IconTextRight />
                  </FormatButton>
                </div>

                <div class='flex m-1 border rounded'>
                  <FormatButton name='undo' onClick={applyFormat}>
                    <IconArrowCounterclockwise />
                  </FormatButton>
                  <FormatButton name='redo' onClick={applyFormat}>
                    <IconArrowClockwise />
                  </FormatButton>
                </div>

                <div class='flex m-1 border rounded'>
                  <FormatButton
                    isActive={focusParent?.localName === 'a'}
                    disable={!focusParent}
                    name={
                      focusParent?.localName === 'a' ? 'unlink' : 'createLink'
                    }
                    onClick={({ currentTarget }) => {
                      if (focusParent?.localName !== 'a') {
                        currentTarget.value = window.prompt(
                          'Enter URL to insert'
                        )
                      }
                      if (currentTarget.value.startsWith('http')) {
                        applyFormat({ currentTarget })
                      }
                    }}
                  >
                    <IconLink />
                  </FormatButton>
                  <FormatButton
                    isActive={focusParent?.localName === 'img'}
                    disable={!focusParent}
                    name='insertImage'
                    onClick={({ currentTarget }) => {
                      currentTarget.value = window.prompt('Enter image URL')
                      if (currentTarget.value.startsWith('http')) {
                        applyFormat({ currentTarget })
                      }
                    }}
                  >
                    <IconImage />
                  </FormatButton>
                </div>
              </div>

              <div
                class='border editor flex-grow focus:outline-none leading-relaxed m-1 overflow-y-auto p-3 rounded'
                contentEditable
                dangerouslySetInnerHTML={{ __html: state.body }} // eslint-disable-line
                ref={editorRef}
              />
            </div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById('composer')
  )
}

export default Composer
