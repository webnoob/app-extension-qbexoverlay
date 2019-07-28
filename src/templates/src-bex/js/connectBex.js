// We need to set up some fakes here to load the BEX into the page.

;(function () {
  window.QBexInit({
    connect (cb) {
      let fakeBridge = {
        send (m) {
          console.log('Sending Message: ', m)
        },
        listen (fn) {
          console.log('Fake Listen')
          fn()
        }
      }

      window.__Q_BEX_HOOK__ = {
        emit (event, data) {
          if (event === 'init') {
            data.$q.bex = {
              on () {
              },
              emit () {
              }
            }
          }
        }
      }

      cb(fakeBridge)
    }
  })
})()
