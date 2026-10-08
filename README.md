# WeShareCozy — Istanbul marketplace

A redesigned English / Turkish marketplace for rooms, flatmates and monthly sublets in Istanbul. Built on the supplied Next.js 15 + Firebase project.

## Start the visual preview

Use **Node.js 24** and **pnpm 11.25.0** (the version used for this delivery).

```bash
npm install -g pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm dev
```

Open **http://localhost:3000/en** or **http://localhost:3000/tr**.

With no Firebase web API key configured, the site intentionally opens a clearly labelled **sample preview**. The eight sample homes, photos, prices and availability are illustrative. Search, filters, sorting, maps, photo galleries, navigation and local saved homes work in this mode. Accounts, publishing, enquiries and private messaging require the Firebase service. A configured live installation never substitutes sample data when the backend fails.

To check a production build:

```bash
pnpm build
pnpm start
```

See `SETUP.md` for Firebase, deployment and environment configuration. See `DELIVERY.md` for scope, verification results and remaining launch work. Screenshots are in `artifacts/`.

## Implemented

- Responsive Istanbul homepage, custom brand, neighborhood discovery and helpful empty states.
- English and Turkish navigation and marketplace pages.
- Search by district, home type, monthly budget, availability, furnishing, included bills, rooms and workspace; price sorting and cursor pagination.
- Map / list switch with approximate locations only.
- Property detail page with keyboard-accessible photo dialog, cost breakdown and deposit policy.
- Device-local saved homes (no account required).
- Authenticated guest–host inbox, earlier-message pagination, duplicate-send protection and server-side membership checks.
- Host editing of text, rent, deposit, policies, amenities and availability; pause and renew actions. Administrator-removed listings cannot be restored by hosts.
- Sign-in continuation back to the selected listing; help and safety pages.
- Listing report submission and admin review queue.
- Clear demo mode and production errors instead of pretending to send SMS.

## Commands

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm check:config
```

For the preview browser suite, use a sample build (no Firebase config, or set `NEXT_PUBLIC_DEMO_MODE=true` **before building**):

```bash
pnpm exec playwright install chromium
pnpm build
pnpm test:preview
```

`tests/preview` exercises browsing and UI without writing to a real service. The separate `tests/e2e` suite requires Firebase emulators; see `SETUP.md`. Production credentials and generated dependency/build directories are intentionally excluded from this ZIP.
