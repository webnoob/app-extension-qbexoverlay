(function () {
  setTimeout(() => {
    const all = document.querySelectorAll('*')
    let el
    for (let i = 0; i < all.length; i++) {
      if (all[i].__vue__) {
        el = all[i]
        break
      }
    }

    if (el) {
      let Vue = Object.getPrototypeOf(el.__vue__).constructor
      while (Vue.super) {
        Vue = Vue.super
      }

      Vue.prototype.$q.localStorage = {
        getItem (key) {
          return new Promise(resolve => {
            const fn = r => {
              if (r.data.type === `bex.chrome.storage.get.out[${key}]`) {
                window.removeEventListener(`message`, fn)
                console.log(r.data.result)
                resolve(r.data.result)
              }
            }

            window.postMessage({ type: 'bex.chrome.storage.get', key })
            window.addEventListener(`message`, fn)
          })
        },
        set (key, value) {
          return new Promise(resolve => {
            const fn = r => {
              if (r.data.type === `bex.chrome.storage.get.set[${key}]`) {
                window.removeEventListener(`message`, fn)
                resolve(r.data.result)
              }
            }

            window.postMessage({ type: 'bex.chrome.storage.set', key, value })
            window.addEventListener(`message`, fn)
          })
        }
      }
    }
  }, 100)
})()
