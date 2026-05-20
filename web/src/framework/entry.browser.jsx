import {
  createFromReadableStream,
  createFromFetch,
  setServerCallback,
  createTemporaryReferenceSet,
  encodeReply,
} from '@vitejs/plugin-rsc/browser'
import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { rscStream } from 'rsc-html-stream/client'
import { GlobalErrorBoundary } from './error-boundary.jsx'
import { createRscRenderRequest } from './request.js'

async function main() {
  let setPayload
  const initialPayload = await createFromReadableStream(rscStream)

  function BrowserRoot() {
    const [payload, setPayload_] = React.useState(initialPayload)
    React.useEffect(() => {
      setPayload = (v) => React.startTransition(() => setPayload_(v))
    }, [setPayload_])
    return payload.root
  }

  setServerCallback(async (id, args) => {
    const temporaryReferences = createTemporaryReferenceSet()
    const renderRequest = createRscRenderRequest(window.location.href, {
      id,
      body: await encodeReply(args, { temporaryReferences }),
    })
    const payload = await createFromFetch(fetch(renderRequest), {
      temporaryReferences,
    })
    setPayload(payload)
    const { ok, data } = payload.returnValue
    if (!ok) throw data
    return data
  })

  const browserRoot = (
    <React.StrictMode>
      <GlobalErrorBoundary>
        <BrowserRoot />
      </GlobalErrorBoundary>
    </React.StrictMode>
  )
  if ('__NO_HYDRATE' in globalThis) {
    createRoot(document).render(browserRoot)
  } else {
    hydrateRoot(document, browserRoot, {
      formState: initialPayload.formState,
    })
  }

  if (import.meta.hot) {
    import.meta.hot.on('rsc:update', async () => {
      const renderRequest = createRscRenderRequest(window.location.href)
      const payload = await createFromFetch(fetch(renderRequest))
      setPayload(payload)
    })
  }
}

main()
