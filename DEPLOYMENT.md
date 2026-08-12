# Deploying LamboBoost to Vercel

The project builds cleanly on Vercel **even with zero environment variables** —
the build has been hardened so no env var is required at compile time
(no build-time database or Redis connections). Set the variables below in the
Vercel project dashboard (**Settings → Environment Variables**) so the app
works at runtime.

## Required

| Variable | Purpose | Notes |
| --- | --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string | Use the normal `mongodb+srv://user:pass@cluster0.xxxx.mongodb.net/lamboboost` format on Vercel. The direct-URI workaround in the local `.env.local` exists only because this machine's Node DNS resolver is broken (SRV lookups fail) — on Vercel the standard SRV string works. |
| `AUTH_SECRET` | Session/JWT signing secret | Generate with `openssl rand -base64 32`. Use the **same value as locally** so existing sessions stay valid. |
| `NEXT_PUBLIC_APP_URL` | Canonical site URL | e.g. `https://lamboboost.vercel.app` or your custom domain. |

## Optional — feature toggles (the app degrades gracefully without them)

| Variable | Purpose |
| --- | --- |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | Google sign-in (OAuth) |
| `REDIS_URL` | BullMQ background jobs (emails, notifications, order processing). **Without Redis, jobs are skipped with a warning** — see Worker note below. |
| `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY`, `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack wallet deposits |
| `FLUTTERWAVE_SECRET_KEY`, `FLUTTERWAVE_PUBLIC_KEY`, `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` | Flutterwave wallet deposits |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_FROM_NAME` | Transactional email (welcome, order, deposit) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Image uploads |
| `ACTIVE_PROVIDER` | Order provider backend: `mock`, `providerA`, or `providerB` |

> `CSRF_SECRET` appears in `.env.example` but is **not referenced anywhere in
> the code** — you can ignore it.

## Build configuration

- `vercel.json` already pins the framework (`nextjs`), build command
  (`next build`), and region (`iad1`). No changes needed.
- `next.config.ts` already sets the image domains, security headers, and
  server-action body limit.

## Worker note (important)

BullMQ **workers must run in a long-lived process** — Vercel serverless
functions cannot host them. For production order processing and emails:

1. Run `npm run worker` on a persistent host (Railway, Render, Fly.io, a VPS),
   pointed at the same `REDIS_URL` and `MONGODB_URI`, **or**
2. Use Upstash Workflows / QStash to trigger the order-processing logic, **or**
3. Keep `ACTIVE_PROVIDER=mock` and accept that orders stay `pending` and
   emails are skipped.

Without a worker, core flows still work: registration, login, wallet deposits
(via Paystack/Flutterwave), and order creation in the database.

## First deploy

```bash
# one-time login (opens browser) or set VERCEL_TOKEN
vercel login

# from the project root
vercel link          # connect to the LamboBoost project
vercel env pull      # (optional) sync env vars locally
vercel --prod        # production deploy
```

After the first deploy, the preview/alias URL is printed. Add a custom domain
under **Settings → Domains** if you have one.
