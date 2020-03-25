(function() {
  try {
    var env = process.env.__YYL_ENV_POP__
    var tipsId = '__YYL_ENV_POP'
    var tipsEl = document.getElementById(tipsId)
    if (tipsEl) {
      return
    }
    tipsEl = document.createElement('div')
    tipsEl.id = tipsId
    tipsEl.style.cssText = [
      'visibility: hidden',
      'position: fixed',
      'z-index: 10000',
      'top: 0px',
      'left: 50%',
      'color: #fff',
      'background: rgba(0, 0, 0, .6)',
      'line-height: 2',
      'font-size: 21px',
      'padding: 0 10px',
      'display: inline-block',
      'white-space: norwap',
      'transition: 0.5s',
      'transform: translate(-50%, -110%)',
      'border-radius: 0px 0px 5px 5px'
    ].join(';')
    document.body.appendChild(tipsEl)
    tipsEl.innerHTML = env.text
    tipsEl.style.display = 'inline-block'

    setTimeout(function () {
      tipsEl.style.visibility = 'visible'
      tipsEl.style.transform = 'translate(-50%, 0)'
    }, 1)

    if (env.duration) {
      setTimeout(function () {
        tipsEl.style.transform = 'translate(-50%, -110%)'
        tipsEl.style.visibility = 'hidden'
        setTimeout(function() {
          document.body.removeChild(tipsEl)
        }, 1000)
      }, env.duration)
    }
  } catch (er) {}
})()
