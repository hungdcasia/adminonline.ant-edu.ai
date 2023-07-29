let loader = false

export default () => {
  if (!loader && !window.amp) {
    loader = new Promise((resolve, reject) => {
      let scriptTag = document.createElement('script')
      scriptTag.id = 'zalo-chat-widget'
      scriptTag.src = 'https://sp.zalo.me/plugins/sdk.js'
      document.body.appendChild(scriptTag)
      scriptTag.onload = () => resolve({})
    })
  }
  return loader || Promise.resolve({})
}