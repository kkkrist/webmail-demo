import { createHashHistory } from 'history'
import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { Router } from 'preact-router'
import 'twind/shim'

import ErrorBoundary from './error-boundary'
import Header from './header'
import NotFound from './not-found'
import Redirect from './redirect'

import Mail from '../routes/mail'

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [url, setUrl] = useState('')

  useEffect(() => {
    document.title = `[Webmail Demo] ${url
      .split('/')
      .filter(str => str && !/\d/.test(str))
      .map(str => str[0].toUpperCase() + str.slice(1))
      .join(' → ')}`
  }, [url])

  return (
    <div id='app'>
      <ErrorBoundary>
        <Header
          isOpen={menuOpen}
          toggleOpen={() => setMenuOpen(prevState => !prevState)}
          url={url}
        />

        <div class='fixed top-16 w-full'>
          <Router
            history={createHashHistory()}
            onChange={({ url }) => setUrl(url)}
            url={url}
          >
            <Mail path='/mail/:folderName?/:messageId?' />
            <Redirect path='/' to='/mail/Inbox' />
            <NotFound default />
          </Router>
        </div>
      </ErrorBoundary>
    </div>
  )
}

export default App
