# Cloudflare Workers for vote4.hk

## Install Wrangler

```
npm install -g @cloudflare/wrangler
```

## Setup wrangler config

```
cp wrangler.toml.example wrangler.toml
# Then provide the correct account_id and zone_id
```

## Test workers in preview

```
wrangler preview --watch

wrangler preview --watch --env production
```

## Publish

```
wrangler publish

wrangler publish --env production
```

## Test with User Agent

```
curl --request GET \
  --url https://vote4.hk/profile/%E5%B2%B3%E6%95%AC%E5%AF%AC/d502be6e-859d-461f-bcc2-8bafc501b1c8 \
  --header 'User-Agent: Googlebot/'
```

## Refresh GraphQL Cache
-  Set GraphQL endpoint to `https://vote4.hk/graphql?refresh=true` to invalidate and update cache for queries that have been executed

## Reference

- https://developers.cloudflare.com/workers/templates/snippets/bulk_origin_proxies/
- "Cache API" example in https://developers.cloudflare.com/workers/templates/
