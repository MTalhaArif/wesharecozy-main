# WeShareCozy delivery — 28 September 2026

## What this version delivers

The supplied Next.js / Firebase project has been redesigned as an Istanbul marketplace for private rooms, flatmates and monthly sublets. The existing English and Turkish routes remain available.

### Guest experience

- Istanbul photo homepage with a cream / forest green identity, responsive navigation and neighborhood discovery.
- District, space type, budget, available-by date, room count, furnished, included-bills and amenity filters; price sorting and paginated results.
- List / map view with approximate locations. If map tiles fail, a visible explanation and OpenStreetMap link replace the unexplained blank map.
- Property photo gallery with keyboard controls, clear monthly costs, deposit terms, amenities and availability.
- Saved homes on the current browser/device, including refresh persistence. Saved entries are snapshots; open the home again for current details.
- Login returns to the property the guest was viewing.
- An authenticated guest–host inbox with message history, polling, rate limits and duplicate-send protection.
- Help pages, neighborhood guide, listing reporting and useful empty/error states.

### Host and operator experience

- Improved listing creation form with prices entered in TRY and stored in integer kuruş.
- Photo compression, combined upload-size checks and required location selection.
- Owner-only editing of copy, rent, deposit, policies, amenities and availability; pause and renew actions.
- Administrator-removed listings cannot be republished by the host.
- Listing report review queue for administrators.
- Existing enquiry tracking, ratings and optional AI assistant retained. AI UI is shown only when its server key is configured in a live installation.

### Data and access

Private messaging reads and writes verify Firebase tokens and thread membership on the server. Host changes verify ownership. Direct client access to threads and reports is denied by the included Firestore rules. Exact locations stay in private documents; public maps use approximate coordinates.

Search uses indexed, bounded Firestore batches rather than loading the entire collection. Less common filters are applied within each batch, so a sparse search may require additional pages. This is an initial marketplace implementation; large-inventory search performance has not been load-tested.

## Preview versus live data

The ZIP runs without credentials as an explicitly labelled sample preview. Its eight homes, prices, dates and interior photographs are illustrative. They are never seeded into the live database. Enquiries, accounts and publishing are disabled in this mode.

Connecting a real Firebase project enables the implemented account, publishing and messaging flows. A configured installation does not silently replace failed live data with sample homes.

## Verification

| Check                 | Result                                                                |
| --------------------- | --------------------------------------------------------------------- |
| TypeScript            | Passed                                                                |
| ESLint                | Passed, no warnings                                                   |
| Unit tests            | 77 passed across 15 files                                             |
| Production build      | Passed                                                                |
| Configuration checker | Passed in sample-preview mode; identifies missing live variable names |
| Browser journeys      | 3 desktop/mobile journeys, each run twice: 6 passed                   |

The production browser checks covered image loading, saving/removing homes and refresh persistence, district/budget/bills filtering, price sorting, map markers and the offline-map fallback, gallery navigation and Escape, mobile navigation, Turkish switching, horizontal overflow, empty/error states, helper pages and disabled preview publishing. No uncaught page errors were reported in the final six runs. Development-mode browser checks also passed.

Visual review used desktop (1440 px) and mobile (390 px) screenshots. Runtime checks used Node.js 24 and headless Chromium. Server authorization tests use mocked Firebase services; these do not replace the real staging flow below.

## Remaining launch work

- Connect your Firebase project and deploy the included rules and composite indexes. Run the staging checklist in `SETUP.md` with two real test accounts before opening the service to users.
- Real Firebase signup, uploads, publishing, message exchange and administration have **not** been exercised against your account; no credentials were supplied and no deployment was performed.
- Add actual properties and accurate host-owned photos. The preview collection is not available rental inventory.
- Add the operator's contact details and finalized legal/privacy documents for the intended Turkish business model.
- The existing 3% successful-subrental commission wording is preserved. Collection of that commission is not implemented.
- Phone SMS verification requires a real provider. The development stub refuses to pretend to send SMS in production.
- Reservations, calendar availability, payments, payouts and dispute handling are not included.
- The host editor does not replace/reorder photographs or relocate a published property yet.
- Inbox notifications, read receipts, attachments and blocking remain follow-up work. The inbox refreshes messages every 15 seconds and conversation summaries every 20 seconds while visible.
- Map tiles depend on OpenStreetMap. The local browser suite verifies markers and the network-failure fallback, not third-party tile availability.

## Files to read first

1. `START-HERE.md` — short Roman Urdu guide.
2. `README.md` — install, preview and commands.
3. `SETUP.md` — Firebase, Vercel and staging checklist.
4. `ASSETS.md` — illustrative photo sources.
5. `artifacts/` — desktop/mobile screenshots of the delivered preview.

The archive contains source code, package lock, configuration, bundled preview photos, tests and documentation. Dependencies, build output, private environment files and credentials are excluded.
