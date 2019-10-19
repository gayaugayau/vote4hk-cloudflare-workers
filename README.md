# Cloudflare Workers for vote4.hk

## Test workers in preview

```
wrangler preview --watch
```

## Setup wrangler config

```
cp wrangler.toml.example wrangler.toml
# Then provide the correct account_id and zone_id
```

## Publish

```
wrangler publish

wrangler publish --env production
```

## Worker script taken from

```
https://developers.cloudflare.com/workers/templates/snippets/bulk_origin_proxies/
```
