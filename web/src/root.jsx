import App from "./App.jsx"

export function Root({ url, user }) {
  const pathname = url?.pathname ?? "/"
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Green Space Portal</title>
      </head>
      <body>
        <App initialUser={user} initialUrl={pathname} />
      </body>
    </html>
  )
}
