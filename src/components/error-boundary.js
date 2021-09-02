import { h } from 'preact'
import { useErrorBoundary } from 'preact/hooks'

const ErrorBoundary = props => {
  const [error, resetError] = useErrorBoundary()

  if (error) {
    return (
  <section class='flex h-screen items-center justify-center'>
    <div class='text-center tracking-wide'>
      <h1 class='font-semibold mb-2 text-6xl text-gray-300'>(益)</h1>

      <p class='font-mono text-gray-500'>"{error.message}"</p>

      <button class='bg-indigo-700 border mt-6 px-2 py-1 rounded text-white' onClick={resetError}>Try again</button>
    </div>
  </section>
    )
  }

  return <>{props.children}</>
}

export default ErrorBoundary
