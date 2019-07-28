
/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

function loadScript (url, callback) {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null
        callback()
      }
    }
  } else {
    script.onload = function () {
      callback()
    }
  }

  script.src = chrome.extension.getURL(url)
  document.getElementsByTagName('head')[0].appendChild(script)
}

function addCss (src) {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', chrome.extension.getURL(`www/${src}`))
  document.head.appendChild(link)
}

window.addEventListener('message', event => {
  // We only accept messages from ourselves
  if (event.source !== window) return

  if (event.data.type && event.data.type === 'bex.chrome.storage.get') {
    const key = event.data.key
    console.log('getting ', key)
    chrome.storage.local.get([key], r => {
      console.log('Result: ', r[key])
      window.postMessage({ type: `bex.chrome.storage.get.out[${key}]`, result: r[key] }, '*')
    })
  } else if (event.data.type && event.data.type === 'bex.chrome.storage.set') {
    const
      key = event.data.key,
      value = event.data.value

    chrome.storage.local.set({ [key]: value }, () => {
      window.postMessage({ type: `bex.chrome.storage.set.out[${key}]`, result: value }, '*')
    })
  }
}, false)

;(function () {
  const div = document.createElement('div')
  div.id = 'q-bex-app'
  document.body.prepend(div)
  document.body.classList.add('q-app-injected')

  const chunks = BEXChunkData

  for (let chunkKey of Object.keys(chunks)) {
    if (chunkKey !== 'app' && !chunkKey.startsWith('bex-')) {
      if (chunks[chunkKey].css) {
        for (let file of chunks[chunkKey].css) {
          addCss(file)
        }
      }
    }
  }

  for (let chunkKey of Object.keys(chunks)) {
    if (chunkKey !== 'app' && !chunkKey.startsWith('bex-')) {
      for (let file of chunks[chunkKey].js) {
        loadScript(`www/${file}`, () => {})
      }
    }
  }

  if (chunks.app) {
    if (chunks.app.css) {
      addCss(chunks.app.css[0])
    }

    loadScript(`www/${chunks.app.js[0]}`, () => {
      loadScript('js/detector.js', () => {
        loadScript('js/connectBex.js', () => {})
      })
    })
  }
})()
