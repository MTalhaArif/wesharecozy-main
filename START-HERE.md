# WeShareCozy — yahan se shuru karein

Website ka naya Istanbul-focused version is folder mein hai. Isay rooms, flatmates aur monthly sublets ke liye banaya gaya hai.

## Apne computer par dekhna

1. ZIP extract karein aur `wesharecozy-main` folder kholein.
2. Node.js 24 aur pnpm 11.25.0 install karein.
3. Terminal mein ye commands chalayein:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Browser mein `http://localhost:3000/en` kholein. Turkish ke liye `/tr` use karein.

Firebase settings ke baghair sample preview khulega. Aap design, search, filters, photos, saved homes aur mobile navigation check kar sakte hain. Sample properties asal rental offers nahi hain.

## Asal users ke liye

`SETUP.md` mein Firebase aur Vercel ki instructions hain. Firebase connect karne aur staging checks ke baad account, property publishing aur private inbox use honge. Apni secret keys ZIP ya chat mein share na karein.

Is delivery mein live website deploy nahi ki gayi. Booking calendar, payment checkout aur asli SMS provider abhi shamil nahi hain.

`DELIVERY.md` mein tamam changes, test results aur baqi launch work diya gaya hai. `artifacts` folder mein desktop aur mobile screenshots hain.
