(function() {
  try {
    var env = process.env.__YYL_ENV_POP__
    var tipsId = '__YYL_ENV_POP'
    var tipsEl = document.getElementById(tipsId)
    if (!tipsEl) {
      tipsEl = document.createElement('div')
      tipsEl.style.cssText = [
        'position: fixed',
        'bottom: 10px',
        'right: 10px',
        'color: #fff',
        'background: rgba(0, 0, 0, .6)',
        'line-height: 2',
        'font-size: 14px',
        'padding: 0 10px',
        'display: inline-block',
        'white-space: norwap',
        'border-radius: 5px'
      ].join(';')
      document.body.appendChild(tipsEl)
    }
    tipsEl.innerHTML = env.text
    tipsEl.style.display = 'inline-block'

    if (env.duration) {
      setTimeout(function () {
        tipsEl.style.display = 'none'
      }, env.duration)
    }
  } catch (er) {}
})()
