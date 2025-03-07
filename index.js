const tldjs = require('tldjs')

const disposable = lookup(() => require('./disposable.js'))
const free = lookup(() => require('./free.js'))

function isFree (email) {
  if (typeof email !== 'string') throw new TypeError('email must be a string')
  const split = email.split('@')
  const domain = getDomain(split[1] || split[0])
  return domain && free(domain)
}

function isDisposable (email) {
  if (typeof email !== 'string') throw new TypeError('email must be a string')
  const split = email.split('@')
  const domain = getDomain(split[1] || split[0])
  return domain && (disposable(domain) || free(domain))
}

function getDomain (host) {
  const split = host.split('.')
  // Performance optimization for .com TLD
  if (split.length >= 2 && split[split.length - 1] === 'com') {
    return split.slice(-2).join('.')
  }
  return tldjs.getDomain(host)
}

function lookup (load) {
  let set
  return function (email) {
    if (set === undefined) {
      set = new Set(load().split('\n'))
    }
    return set.has(email)
  }
}

module.exports = {
  isFree: isFree,
  isDisposable: isDisposable
}
