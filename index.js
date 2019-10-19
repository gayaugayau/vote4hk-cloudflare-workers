const crawlers = require('crawler-user-agents');

/**
 * An object with different url's to fetch
 * @param {Object} domainMap
 */
const domainMap = {
  'vote4.hk': 'meta.vote4.hk',
}

/**
 * Fetch and log a request
 * @param {Request} request
 */
async function handleRequest (request) {
  const userAgent = request.headers.get('User-Agent') || ''

  // Check if incoming hostname is a key in the domainMap object
  let url = new URL(request.url)
  const target = domainMap[url.hostname]
  // If it is, proxy request to that meta domain
  if (target) {
    if (crawlers.some(crawler => RegExp(crawler.pattern).test(userAgent))) {
      url.hostname = target
      return fetch(url, request)
    }
  }

  // Otherwise, process request as normal
  return fetch(request)
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
