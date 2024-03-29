const crawlers = require('crawler-user-agents')

/**
 * Original host of GraphQL server
 * @param {String} url
 */
const originalGraphQlHostname = 'gql.vote4.hk'

/**
 * An object with different url's to fetch
 * @param {Object} domainMap
 */
const domainMap = {
  'vote4.hk': 'meta.vote4.hk',
}

async function sha256 (message) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message)
  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  // convert bytes to hex string
  const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('')

  return hashHex
}

/**
 * Cache POST request
 * @param {Event} event
 * @param {boolean} shouldRefresh
 */
async function handlePostRequest (event, shouldRefresh) {
  let request = event.request
  let body = await request.clone().text()
  let hash = await sha256(body)
  let cacheUrl = new URL(request.url)
  // get/store the URL in cache by pre-pending the body's hash
  cacheUrl.pathname = cacheUrl.pathname + hash
  // Convert to a GET to be able to cache
  let cacheKey = new Request(cacheUrl, {
    headers: request.headers,
    method: 'GET',
  })
  let cache = caches.default
  // try to find the cache key in the cache
  let response = await cache.match(cacheKey)
  // otherwise, fetch response to POST request from origin
  if (!response || shouldRefresh) {
    let originUrl = new URL(request.url)
    // Use origin host gql.opencultures.life
    originUrl.hostname = originalGraphQlHostname
    response = await fetch(originUrl, request)
    response = new Response(response.body, response)
    response.headers.append('X-V4HK-Cache-Time', `${new Date().getTime()}`)
    if (shouldRefresh) {
      response.headers.append('X-V4HK-Cache-Refresh-Time', `${new Date().getTime()}`)
    }
    event.waitUntil(cache.put(cacheKey, response.clone()))
  }
  return response
}

/**
 * Handle a request
 * @param {Event} event
 */
async function handleRequest (event) {
  try {
    let url = new URL(event.request.url)

    // Cache GraphQL POST request
    if (url.pathname.startsWith('/graphql')) {
      let refresh = url.searchParams.get('refresh')
      if (refresh) {
        return await handlePostRequest(event, true)
      }
      return await handlePostRequest(event, false)
    }

    // Check if incoming hostname is a key in the domainMap object
    const userAgent = event.request.headers.get('User-Agent') || ''
    const target = domainMap[url.hostname]

    // If it is, proxy request to that meta domain
    if (target) {
      if (
        crawlers.some(crawler => RegExp(crawler.pattern).test(userAgent)) ||
        url.pathname.startsWith('/sitemap.xml')
      ) {
        url.hostname = target
        return fetch(url, event.request)
      }
    }

    // Otherwise, process request as normal
    return fetch(event.request)
  } catch (err) {
    // Return the error stack as the response
    return new Response(err.stack || err)
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})
