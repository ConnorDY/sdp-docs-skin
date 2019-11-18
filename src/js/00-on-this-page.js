;(function () {
  'use strict'

  /* build nav */
  var toc = document.querySelector('.toc-menu-content')
  var h2List = document.querySelectorAll('h2')
  for (var i = 0; i < h2List.length; i++) {
    var h2 = h2List[i]
    var item = document.createElement('li')
    item.classList = 'toc header'
    var link = document.createElement('a')
    link.innerText = h2.innerText
    link.href = '#' + getIdFromHeader(h2)
    link.classList = 'toc header-link'
    link.id = getIdFromHeader(h2) + '-link'
    item.appendChild(link)
    toc.appendChild(item)
  }

  /* enable highlighted toc */
  var referenceElement = document.querySelector('article').parentNode
  var lastActiveHeader
  window.addEventListener('scroll', onScroll)
  function onScroll () {
    var referencePoint = referenceElement.offsetTop
    var activeHeader
    for (var i = (h2List.length - 1); i >= 0; i--) {
      var hTop = h2List[i].getBoundingClientRect().top
      if (hTop < referencePoint) {
        activeHeader = h2List[i]
        break
      }
    }
    if (activeHeader && activeHeader !== lastActiveHeader) {
      var link = document.getElementById(getIdFromHeader(activeHeader) + '-link')
      link.classList.add('active')
      link.parentNode.classList.add('active')
      if (lastActiveHeader) {
        var oldLink = document.getElementById(getIdFromHeader(lastActiveHeader) + '-link')
        oldLink.classList.remove('active')
        oldLink.parentNode.classList.remove('active')
      }
      lastActiveHeader = activeHeader
    }
    if (lastActiveHeader && !activeHeader) {
      oldLink = document.getElementById(getIdFromHeader(lastActiveHeader) + '-link')
      oldLink.classList.remove('active')
      oldLink.parentNode.classList.remove('active')
      lastActiveHeader = undefined
    }
  }

  function getIdFromHeader (header) {
    return header.innerText.replace(' ', '-').toLowerCase()
  }

  var doc = document.querySelector('.doc')
  var headings = find('h2[id]', doc)

  var startOfContent = doc.querySelector('h1.page + *')
  if (startOfContent) {
    // generate list
    var options = headings.reduce(function (accum, heading) {
      var option = toArray(heading.childNodes).reduce(function (target, child) {
        if (child.nodeName !== 'A') target.appendChild(child.cloneNode(true))
        return target
      }, document.createElement('option'))
      option.value = '#' + heading.id
      accum.appendChild(option)
      return accum
    }, document.createElement('select'))

    var selectWrap = document.createElement('div')
    selectWrap.classList.add('select-wrapper')
    selectWrap.appendChild(options)

    // jump to label
    var jumpTo = document.createElement('option')
    jumpTo.innerHTML = 'Jump to…'
    jumpTo.setAttribute('disabled', true)
    options.insertBefore(jumpTo, options.firstChild)
    options.className = 'toc toc-embedded select'

    // jump on change
    options.addEventListener('change', function (e) {
      var thisOptions = e.currentTarget.options
      window.location.hash = thisOptions[thisOptions.selectedIndex].value
    })

    // add to page
    doc.insertBefore(selectWrap, startOfContent)
  }

  function find (selector, from) {
    return toArray((from || document).querySelectorAll(selector))
  }

  function toArray (collection) {
    return [].slice.call(collection)
  }
})()
