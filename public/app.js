'use strict';

var learnjs = {}

learnjs.problems = [
  {
    description: "What is the truth?",
    code: "function problem () { return ___ }"
  },
  {
    description: "Simple Math",
    code: "function problem () { return 42 === 6 * ___ }"
  }
]

learnjs.appOnReady = function () {
  window.onhashchange = function () {
    learnjs.showView(window.location.hash)
  }
  learnjs.showView(window.location.hash)
}

learnjs.showView = function (hash) {
  var routes = {
    '#problem': learnjs.problemView,
    '#': learnjs.landingView,
    '': learnjs.landingView
  }

  var hashParts = hash.split('-')
  var viewFn = routes[hashParts[0]]
  if (viewFn) {
    $('.view-container').empty().append(viewFn(hashParts[1]))
  }
}

learnjs.landingView = function () {
  return learnjs.template('landing-view')
}

learnjs.problemView = function (data) {
  var problemNumber = parseInt(data, 10)
  var problemData = learnjs.problems[problemNumber - 1]
  var view = learnjs.template('problem-view')
  var result = view.find('.result')

  function checkAnswer () {
    var answer = view.find('.answer').val()
    var test = problemData.code.replace('___', answer) + '; problem();'
    return eval(test)
  }

  function checkAnswerClick () {
    if (checkAnswer()) {
      learnjs.flashElement(result, buildCorrectFlash(problemNumber))
    } else {
      learnjs.flashElement(result, 'Incorrect :(')
    }
    return false
  }

  function buildCorrectFlash (number) {
    var correct = learnjs.template('correct-flash')
    var link = correct.find('a')
    if (number < learnjs.problems.length) {
      link.attr('href', '#problem-' + (number + 1))
    } else {
      link.attr('href', '')
      link.text("You're finished")
    }
    return correct
  }

  view.find('.check-btn').click(checkAnswerClick)
  view.find('.title').text('Problem #' + problemNumber)
  learnjs.applyObject(problemData, view)
  return view
}

learnjs.template = function (name) {
  return $('.templates .' + name).clone()
}

learnjs.flashElement = function (el, html) {
  el.fadeOut('fast', function () {
    el.html(html)
    el.fadeIn()
  })
}

// one-way data binding
// good for static fields and elements that
// have a text value
learnjs.applyObject = function (obj, elem) {
  for (var key in obj) {
    elem.find('[data-name="' + key + '"]').text(obj[key])
  }
}
