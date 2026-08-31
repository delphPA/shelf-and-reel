# Shelf & Reel

Books and movies, recommended by friends and family — not algorithms.

- Create a **bubble** (a friend/family circle), choose whether it's **private** or **public**
- Invite people with a link — no passwords, no email required
- Add books or movies with a **genre** and an age **section** (Kids / Teen / Adult)
- Leave a star rating and a written review
- Browse a bubble's shelf, filter by type/section/genre
- Public bubbles are discoverable and readable by anyone; joining still requires an invite link

## Running locally

```bash
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** `npm run dev` runs with `--webpack` instead of Next 16's default Turbopack.
> On this machine, Turbopack's dev-mode PostCSS/Tailwind loader crashes with
> `node: --enable-source-maps is not allowed in NODE_OPTIONS` under Node 24 — a
> Next.js/Node compatibility issue, not something in this app's code. Webpack mode
> works fine. Try dropping `--webpack` again after upgrading Next/Node if you want
> to test whether it's been fixed upstream.

## How auth works

There are no passwords. When you create or join a bubble for the first time, you
pick a name and avatar and get a session cookie. Your profile page (`/me`) shows a
personal sign-in link (`/login/<token>`) — save it to log back in from another
browser or device. Don't share it; anyone with the link can act as you.

## Data model

SQLite via Prisma (`prisma/schema.prisma`):

- **User** — name, avatar, personal login token
- **Bubble** — a friend/family circle; `visibility` is `PUBLIC` or `PRIVATE`; has an `inviteCode`
- **Membership** — links a User to a Bubble (`OWNER` or `MEMBER`)
- **Item** — a book or movie (`type`, `genre`, `ageSection`), shared across bubbles
- **Review** — one user's rating + text for an item, scoped to the bubble they posted it in

SQLite doesn't support Prisma enums, so `visibility`, `role`, `type`, and
`ageSection` are plain strings constrained by TypeScript unions in `src/lib/types.ts`.

## Deploying

This app needs a real Node.js server (or Vercel/Netlify-style platform) — it's not
static. To deploy:

1. Push this repo to GitHub.
2. Import it on [Vercel](https://vercel.com/new) (or similar).
3. Swap SQLite for a hosted database (e.g. [Turso](https://turso.tech) for SQLite,
   or Postgres via [Neon](https://neon.tech)/[Supabase](https://supabase.com)) —
   update `prisma/schema.prisma`'s `datasource` provider and `DATABASE_URL`, then
   run `npx prisma migrate deploy`.
4. Set the `DATABASE_URL` and `AUTH_SECRET` environment variables on the host.
   Generate a fresh `AUTH_SECRET` for production — don't reuse the one in `.env`.
