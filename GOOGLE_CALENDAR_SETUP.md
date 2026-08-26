# Connecting Selah Study to Google Calendar

The site can read and write your Google Calendar, but Google requires *you* to
register the app first. It's free and takes about ten minutes. You only do this
once.

Google Calendar stays the source of truth — Selah Study is a nicer window onto
it. Anything you add on the site appears on your phone; anything you add on your
phone appears on the site.

---

## 1. Create the database table

In your Supabase project → **SQL Editor** → paste the contents of
`supabase/calendar-schema.sql` and run it.

This creates one table (`google_tokens`) that stores the permission slip Google
gives the site. It's protected by row-level security, so only you can read your
own row.

---

## 2. Make a Google Cloud project

1. Go to <https://console.cloud.google.com/>.
2. Click the project dropdown in the top bar → **New Project**.
3. Name it `Selah Study` → **Create**. Make sure it's selected afterwards.

## 3. Turn on the Calendar API

1. Go to <https://console.cloud.google.com/apis/library/calendar-json.googleapis.com>.
2. Click **Enable**.

## 4. Set up the consent screen

1. Go to **APIs & Services → OAuth consent screen** (newer consoles call this
   **Google Auth Platform**).
2. Choose **External** and click **Create**.
3. Fill in:
   - **App name:** Selah Study
   - **User support email:** your email
   - **Developer contact email:** your email
4. Save and continue through the Scopes step (you don't need to add scopes by
   hand — the site requests them at sign-in time).

### Important: publish the app

On the **Audience** (or **Publishing status**) screen, click **Publish app** and
confirm.

Why this matters: while the app is in **Testing**, Google expires its permission
every **7 days** — you'd have to reconnect your calendar every week. Publishing
removes that. Because the app isn't verified by Google, the first time you
connect you'll see a *"Google hasn't verified this app"* screen. Click
**Advanced → Go to Selah Study (unsafe)**. That warning is about apps *other*
people wrote; this one is yours.

(If you'd rather not publish, stay in Testing, add your own email under **Test
users**, and expect to reconnect weekly.)

## 5. Create the OAuth client

1. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
2. **Application type:** Web application.
3. **Name:** Selah Study Web.
4. Under **Authorised redirect URIs**, add both of these, exactly:

   ```
   http://localhost:3000/api/google/callback
   https://selahstudy.maliahowlett.com/api/google/callback
   ```

   These have to match character for character — a trailing slash will break it.
5. Click **Create**. Google shows you a **Client ID** and a **Client secret**.
   Keep that dialog open for the next step.

---

## 6. Add the credentials locally

Open `.env.local` in the project root and fill in:

```
GOOGLE_CLIENT_ID=<the client ID>
GOOGLE_CLIENT_SECRET=<the client secret>
```

Then restart the dev server (`npm run dev`) — Next.js only reads `.env.local` at
startup.

## 7. Add the credentials to Vercel

For the live site, add the same two variables in Vercel:

**Project → Settings → Environment Variables →** add `GOOGLE_CLIENT_ID` and
`GOOGLE_CLIENT_SECRET` for **Production** (and Preview if you use it), then
redeploy.

---

## 8. Connect

Go to `/calendar` on the site, sign in, and click **Connect Google Calendar**.
Approve the permission and you'll land back on the calendar with your events.

---

## Troubleshooting

**`redirect_uri_mismatch`** — the URI in step 5 doesn't exactly match where the
site is running. Check for `http` vs `https`, a missing port, or a trailing
slash.

**"Google didn't hand over a lasting permission"** — this happens if Google
skips the refresh token on a repeat authorisation. Go to
<https://myaccount.google.com/permissions>, remove Selah Study, then connect
again.

**"Google rejected the request — try reconnecting"** — the stored permission was
revoked or expired (most likely the 7-day Testing limit from step 4). Click
**Reconnect Google Calendar**.

**Events show up but with the wrong category** — categories are guessed from the
title until you set one by hand. Open the event on the site, pick the right type,
and save; that choice sticks from then on.

---

## What the site can and can't do

- **Can:** read your events, create new ones, edit them, delete them.
- **Can't:** touch your email, files, contacts, or anything outside Calendar.
- **Disconnect** any time from the bottom of the calendar page, or at
  <https://myaccount.google.com/permissions>.
