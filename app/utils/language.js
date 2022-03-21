function languageMo() {
  let language = {}
  let config = JSON.parse(window.localStorage.getItem('language'))
  const env = process.env.APP_ENV
  language.getTranslate = function(word, page, property) {
    //word 语言版本 page 哪个页面 property 当前文字所用的属性
    if (!page || !property) {
      return null
    }
    if (config[word]) {
      if (config[word][page]) {
        if (config[word][page][property]) {
          const data = config[word][page][property]
          return data[env] ? data[env] : data
        }
      }
    }
    return null
  }
  language.setTranslate = function(domNodes, word, page) {
    //console.log(domNodes,word,page)
    if (!domNodes || !page) {
      return
    }
    domNodes.map(function(item) {
      if (config[word]) {
        if (config[word][page]) {
          if (config[word][page][item.attr('data-i18n')]) {
            const data = config[word][page][item.attr('data-i18n')]
            const isEnv = item.attr('env')
            item.html(isEnv ? data[env] : data)
            item.attr('language', word + '_' + page + '_' + item.attr('data-i18n'))
          }
        }
      }
      //console.log(item)
    })
  }
  language.dataFromat = function(word, value) {
    // console.log(config[word],window.localStorage.getItem('language'))
    if (value.lastIndexOf(' ') != -1) {
      let chaf = value.split(' ')
      let ymd = chaf[0].replace('-', config[word]['global']['year']).replace('-', config[word]['global']['mouth']) + config[word]['global']['day']
      let hms = chaf[1].replace('-', config[word]['global']['hour']).replace('-', config[word]['global']['minute']) + config[word]['global']['second']
      return ymd + ' ' + hms
    } else {
      return value.replace('-', config[word]['global']['year']).replace('-', config[word]['global']['mouth']) + config[word]['global']['day']
    }
  }

  return language
}

module.exports = languageMo
