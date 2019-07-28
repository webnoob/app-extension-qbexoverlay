// We need to set up some fakes here to load the BEX into the page.

;(function () {
  window.QBexInit({
    connect (cb) {
      let proxyBridge = {
        send (event, payload) {
          window.postMessage({ event, payload, source: 'bex' })
        },
        on (event, cb) {
          const fn = (payload) => {
            if (event === payload.data.type) {
              window.removeEventListener(event, fn)
              cb(payload.data.result)
            }
          }
          window.addEventListener('message', fn)
        }
      }

      window.__Q_BEX_HOOK__ = {
        emit (event, Vue) {
          if (event === 'init') {
            // Here we can access Vue.$q.localStorage etc...
          }
        }
      }

      cb(proxyBridge)
    }
  })
})()
