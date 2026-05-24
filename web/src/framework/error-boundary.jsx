'use client'

import React from 'react'

export function GlobalErrorBoundary({ children }) {
  return (
    <ErrorBoundary errorComponent={DefaultGlobalErrorPage}>
      {children}
    </ErrorBoundary>
  )
}

class ErrorBoundary extends React.Component {
  state = {}
  static getDerivedStateFromError(error) {
    return { error }
  }
  reset = () => this.setState({ error: null })
  render() {
    if (this.state.error) {
      const Component = this.props.errorComponent
      return <Component error={this.state.error} reset={this.reset} />
    }
    return this.props.children
  }
}

function DefaultGlobalErrorPage({ error, reset }) {
  return (
    <html>
      <head>
        <title>Unexpected Error</title>
      </head>
      <body style={{ padding: 24, fontFamily: 'system-ui' }}>
        <p>Caught an unexpected error</p>
        <pre>{import.meta.env.DEV ? error.message : '(Unknown)'}</pre>
        <button onClick={() => React.startTransition(reset)}>Reset</button>
      </body>
    </html>
  )
}
