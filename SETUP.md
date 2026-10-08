# Setup and deployment

## 1. Local preview

Install Node.js 24 and pnpm 11.25.0, then run `pnpm install --frozen-lockfile` and `pnpm dev` in the project folder. The demo works without credentials. Any `NEXT_PUBLIC_*` changes require restarting the dev server or rebuilding production.

## 2. Connect the existing Firebase project

In Firebase Console enable **Email/Password** under Authentication, set up Firestore and Storage, and add the deployed hostname to Authentication's authorized domains. Use the same project for browser and server settings.

Create `.env.local` yourself locally (it must stay private and out of source control), or set the following in Vercel's Environment Variables panel:

| Variable                              | Where to obtain it                                                          |
| ------------------------------------- | --------------------------------------------------------------------------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`        | Firebase web app configuration                                              |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`    | Firebase web app configuration                                              |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`     | Firebase web app configuration                                              |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase web app configuration; use the actual bucket name                  |
| `NEXT_PUBLIC_FIREBASE_APP_ID`         | Firebase web app configuration                                              |
| `FIREBASE_PROJECT_ID`                 | Same Firebase project ID                                                    |
| `FIREBASE_STORAGE_BUCKET`             | Actual Firebase Storage bucket                                              |
| `FIREBASE_SERVICE_ACCOUNT_KEY`        | Entire service-account JSON as a private server variable                    |
| `NEXT_PUBLIC_DEMO_MODE`               | Optional: `true` forces sample preview; remove or set `false` for live data |
| `ANTHROPIC_API_KEY`                   | Optional server-only key for the existing Cozy AI assistant                 |

Never prefix a service-account JSON or an Anthropic key with `NEXT_PUBLIC_`. Do not paste credentials into a support chat. `pnpm check:config` prints missing **names**, not secret values.

## 3. Deploy rules and indexes

Select the intended Firebase project explicitly. The original ZIP includes `.firebaserc`; do not assume that default belongs to your account.

```bash
pnpm exec firebase login
pnpm exec firebase use YOUR_PROJECT_ID
pnpm exec firebase deploy --only firestore:rules,firestore:indexes,storage
pnpm seed:districts
```

The seed command reads `.env.local`. Confirm it points to the same project as deployment. It creates district reference data, not rental inventory. **Do not run `seed:demo-accounts` against production**; the original script is intended for isolated development only.

Wait for the new Firestore composite indexes to finish building before testing search or inbox. Their definitions are included in `firestore.indexes.json`.

### Administrator access

An authorized Firebase project administrator can set `isAdmin: true` on `users/{uid}/private/contact` for the designated operator. No frontend action grants this permission. Keep that document's other fields intact. Sign in with that account to use `/en/admin` or `/tr/admin`.

### Existing data

No destructive migration is required. Old listings still display. New availability, furnishing and amenity fields are optional; unknown values are never advertised as confirmed. Hosts can update these through **My listings → Edit details**. A listing without a known available-from date will not match an availability-date filter.

## 4. Vercel

Import the project into the existing Vercel workflow, choose the Next.js preset, Node.js 24, install command `pnpm install --frozen-lockfile` and build command `pnpm build`. Add the variables above and redeploy. No deployment was performed as part of this ZIP delivery.

The normal server-action upload limit is 4 MB; compressed property photos are capped at **3.5 MB combined** to leave room for the form body. Each compressed photo remains capped at 1 MB. Up to 15 small photos fit if their combined size stays below that limit. Photo replacement / reordering after publication is not included in the host editor yet.

Use the production hostname in Firebase Authentication's authorized domains. Keep runtime logs free of personal information. If hosting behind a custom reverse proxy, it must overwrite `x-forwarded-for` rather than trust an arbitrary client value; anonymous enquiry rate limits use a hash of that address.

## 5. Test Firebase flows locally

The original project uses Auth, Firestore and Storage emulators. A Java runtime compatible with the installed Firebase CLI is required; follow the version requirement reported by `firebase emulators:start`. Configure a **demo project**, never production credentials, for emulator testing.

Set these additional variables for the emulator environment:

- `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true`
- `NEXT_PUBLIC_DEMO_MODE=false`
- `NEXT_PUBLIC_FIREBASE_API_KEY=demo-key`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-wesharecozy`
- `FIREBASE_PROJECT_ID=demo-wesharecozy`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=demo-wesharecozy.firebaseapp.com`
- `NEXT_PUBLIC_FIREBASE_APP_ID=demo-app`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=demo-wesharecozy.appspot.com`
- `FIREBASE_STORAGE_BUCKET=demo-wesharecozy.appspot.com`

Unset `FIREBASE_SERVICE_ACCOUNT_KEY` for local emulators. The Firebase CLI injects the server emulator endpoints into its child command.

```bash
pnpm exec firebase emulators:exec --project demo-wesharecozy "pnpm seed:districts && pnpm test:e2e"
```

The complete real Firebase flow still needs a staging smoke test: signup, publish photos, search, start a thread from a second account, send both directions, report a listing, admin review, host edit/pause/renew and confirm that another account cannot access the thread.

## 6. Launch decisions still needed

- Supply real properties and accurate host-owned photos. The sample collection is not rental inventory.
- Supply operator contact details and finalized terms/privacy notices, retention/deletion process and the applicable Turkish rental rules reviewed for the chosen business model.
- The original listing form includes a **3% successful-subrental commission agreement**. That wording is preserved; no payment or commission collection integration is included. Confirm the commercial terms before launch.
- SMS verification is a development stub. Production deliberately fails with an explicit unavailable message until a real provider is implemented. No “verified property” or guaranteed-safety claims are added.
- This delivery is an enquiry marketplace, with no reservation calendar, checkout, payouts or dispute-resolution service.
- The inbox polls while the tab is visible (messages every 15 seconds, threads every 20 seconds). Email/push notifications, unread receipts, blocking and attachments are follow-up features.
