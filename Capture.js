var Capture = function(config) {
  this.initialize(config)
}

Capture.prototype = {
  initialize: function(config) {
    this.interactions = config.interactions || true,
    this.interactionElement = config.interactionElement || 'interaction',
    this.interactionEvents = config.interactionEvents || ['mounseup', 'touchend'],
    this.captureAttributes = config.captureAttributes || ['id', 'name'],
    this.endpoint = config.endpoint || '/Savelog',
    this.records = []
    this.loadTime = new Date()
    this.register()
  },
  register: function() {
    var Interaction = this
    if (Interaction.interactions === true) {
      for (var i = 0; i < Interaction.interactionEvents.length; i++) {
        var ev = Interaction.interactionEvents[i]

        var targets = document.getElementsByClassName(Interaction.interactionElement)
        for (var j = 0; j < targets.length; j++) {
          targets[j].addEventListener(ev, function(e) {
            Interaction.track(e, 'interaction')
          })
        }
      }
    }

    window.onbeforeunload = function(e) {
      Interaction.post()
    }
  },
  track: function(e, type) {
    var Interaction = this

    var interaction = {
      type: type,
      event: e.type,
      targetTag: e.target !== undefined ? e.target.tagName : '',
      content: e.target !== undefined ? e.target.innerText : '',
      id: e.target && e.target.attributes && e.target.attributes.nodeName && e.target.attributes.nodeName === 'id' ? e.target.attributes.nodeValue : '',
      captured: this.getCaptureValues(e.target.attributes),
      createdAt: new Date()
    }
    if (console && console.log(interaction));
    Interaction.records.push(interaction)
    return this.interactions
  },
  post: function() {
    var Interaction = this

    var data = {
      loadTime: Interaction.loadTime,
      unloadTime: new Date(),
      language: window.navigator.language,
      platform: window.navigator.platform,
      port: window.location.port,
      page: {
        pagename: document.title,
        location: window.location.pathname,
        href: window.location.href,
        origin: window.location.origin,
        parameters: this.parseQuerystring(),
        loadtime: window.performance.timing.loadEventEnd - window.performance.timing.loadEventStart + ' milliseconds'
      },
      interactions: Interaction.records
    }

    var ajax = new XMLHttpRequest()
    ajax.open('POST', Interaction.endpoint, false)
    ajax.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    ajax.send(JSON.stringify(data))
  },
  getCaptureValues: function(attributes) {
    var captured = []
    for (var i = 0; i < this.captureAttributes.length; i++) {
      var prop = this.captureAttributes[i]
      if (attributes[prop] !== undefined) {
        captured[prop] = attributes[prop].nodeValue
        // captured.push({prop, attributes[prop].nodeValue})
      }
    }
    return captured
  },
  parseQuerystring: function() {
    var url = window.location.href

    var retObject = {}

    var parameters
    if (url.indexOf('?') === -1) {
      return null
    }
    url = url.split('?')[1]
    parameters = url.split('&')
    for (var i = 0; i < parameters.length; i++) {
      returnObject[parameters[i].splice('=')[0]] = parameters[i].split('=')[1]
    }
    return retObject
  }
}
