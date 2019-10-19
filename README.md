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

## Test with User Agent

```
curl --request GET \
  --url https://vote4.hk/profile/%E5%B2%B3%E6%95%AC%E5%AF%AC/d502be6e-859d-461f-bcc2-8bafc501b1c8 \
  --header 'User-Agent: Googlebot/'
```

## Reference

- https://developers.cloudflare.com/workers/templates/snippets/bulk_origin_proxies/
