# 🐾 PawHealth — production React Native (Expo) app

A women's-wellness app with a virtual-pet companion. Gentle, progress-only habit
tracking; the pet's mood mirrors a 0–100 wellness score, streaks **rest** instead of
breaking, and all personal data stays **on the device**.

This is the real, buildable source code for an Android (and iOS) app. It is **not** a
pre-compiled `.aab`/`.apk` — nobody can hand you a Play-Store binary that contains *your*
signing key, *your* AdMob IDs, and *your* billing product. The steps below get you from
this folder to an uploadable `.aab` in well under an hour, most of it account setup.

---

## ✅ What's already implemented

- **Virtual pet + mood engine** — 5 pets, 7 moods, wellness ring, rotating dialogue, tap-to-react.
- **Resilience model** — skip a day and the streak *rests/recovers*; the pet gets sleepy, never punishing.
- **Custom activities** — users create their own activities (title, pillar, difficulty→coins, icon), complete them on Home, delete them. Free tier capped at 3; **unlimited with Premium**.
- **Premium "PawHealth+"** — **first 15 days free for everyone**, then a **one-time ₹30 unlock**. `isPremium = purchased OR within 15-day trial`.
- **Ads (AdMob)** — adaptive **banner** + optional **interstitial** (after a workout). Auto-hidden for Premium/trial users. Uses Google **test ad units** in development so you never risk your account.
- **Live odometer** — GPS distance, speed, and pace for **walk / run / cycle** (foreground tracking via `expo-location`).
- **Step counter** — live foreground steps via `expo-sensors` Pedometer (see Android caveat below).
- **Share to social** — captures a pet-themed achievement card as an image and opens the native share sheet (`react-native-view-shot` + `expo-sharing`), with a text fallback.
- **5 themes** (incl. dark "Midnight"), AsyncStorage persistence, onboarding, profile + achievements.

## 🌱 Engagement & retention features (v2) — built without dark patterns

These give people genuine reasons to return for months, through delight and a real bond — never guilt:

- **Bond levels** — a relationship that grows slowly (New Friend → Soulmate) as you check in, feed, pet, hydrate, and complete goals. A long arc that rewards months of gentle care.
- **Daily mood check-in** — a one-tap "how are you feeling?" each day; your companion responds warmly and it feeds your wellness + bond.
- **Feed your companion ("healthy food")** — completing goals earns treats; feeding is a sweet reward (with a little pop animation), framed as care, not survival.
- **Hydration tracker** — tappable water cups on Home, resetting daily.
- **Daily affirmation** — a gentle note "from your pet" that changes each day.
- **Coin shop + collectibles** — earn coins, then buy & equip pet **accessories** (bow, crown, shades…) and **scenes** (Sakura, Beach, Forest, Starry Night) that render live on your pet. Collection/personalization is a proven long-term hook.
- **Insights** — a 5-week wellness **heatmap** and a **mood history** strip, plus weekly counts.
- **Gentle daily notifications** — opt-in evening hello from your companion (warm, never shaming).
- **UI/UX polish** — haptic feedback on key taps, confetti celebrations on a full day & purchases, breathing pet animation, decorated scenes, smoother cards.

## 🗺️ Tabs

`Home` (care loop, check-in, feed, hydration, bond, goals) · `Move` (GPS + steps) · `Cycle` (private tracker) · `Shop` (outfits & scenes) · `Me` (insights, achievements, reminders, themes, premium). Add-activity opens from Home.

---

## 🧰 Prerequisites

- **Node.js 20.19.4+** and a recent npm.
- A **Google Play Console** account (one-time **$25**) — required to publish and to sell the ₹30 unlock.
- A free **AdMob** account — for real ad-unit IDs.
- An **Expo / EAS** account (free) — `npm i -g eas-cli`.
- An **Android device** (or emulator) for testing. Native modules mean **Expo Go will not work** — you need a *development build*.

---

## 🚀 Install (recommended path)

The cleanest way to avoid version drift is to let Expo scaffold a project for the current
SDK, then drop these files in:

```bash
# 1) create a fresh Expo app (this pins compatible expo/react/react-native versions)
npx create-expo-app@latest pawhealth --template blank
cd pawhealth

# 2) copy the contents of THIS folder over the new project,
#    overwriting App.js, app.config.js (delete app.json if present), index.js,
#    and adding the src/ and assets/ folders, eas.json, babel.config.js

# 3) install the extra packages at versions that match your SDK
npx expo install \
  @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs \
  react-native-screens react-native-safe-area-context react-native-svg \
  @react-native-async-storage/async-storage \
  expo-location expo-sensors expo-sharing react-native-view-shot \
  expo-notifications expo-haptics \
  react-native-google-mobile-ads expo-iap expo-build-properties

# 4) heal any remaining version mismatches
npx expo install --fix
```

> The included `package.json` is a reference. `npx expo install` + `--fix` is what guarantees
> every dependency matches your Expo SDK.

---

## ⚙️ Configure (before shipping)

1. **App identity** — in `app.config.js` set a unique `android.package` and `ios.bundleIdentifier` (e.g. `com.janedoe.pawhealth`).
2. **AdMob App IDs** — create an app in AdMob, copy its **App ID** (`ca-app-pub-…~…`) into the `react-native-google-mobile-ads` plugin block in `app.config.js` (replace the test IDs).
3. **AdMob unit IDs** — create a **Banner** and an **Interstitial** unit, paste them into `REAL_BANNER` / `REAL_INTERSTITIAL` in `src/ads.js`. (Dev builds keep using test IDs automatically.)
4. **In-app purchase** — in Play Console → *Monetize → In-app products*, create a **one-time** product with ID `pawhealth_plus_lifetime` priced at **₹30**. Then in `src/premium.js` switch `PURCHASE_MODE` to `"expo-iap"` and uncomment the expo-iap block.
5. **App icon / splash** — replace the placeholder PNGs in `assets/` with your own art (icon 1024×1024).

---

## ▶️ Run on a device (development build)

```bash
# build & install a dev client on a connected Android device/emulator
npx expo run:android
# (or create a cloud dev build: eas build --profile development -p android)
```

Until you switch billing to `expo-iap`, the Paywall's unlock button works in **simulated**
mode so you can test the full premium flow without store setup.

---

## 📦 Build the Play Store bundle (`.aab`)

```bash
npm i -g eas-cli
eas login
eas init          # links the project, fills the EAS projectId
eas build -p android --profile production
```

EAS produces a signed **`.aab`** (it manages your upload keystore by default — keep that EAS
account safe, or supply your own keystore). Download the `.aab` when the build finishes.

---

## ⬆️ Upload to Google Play

1. Play Console → **Create app** → fill name, default language, category (Health & Fitness).
2. Complete the required forms: **Privacy policy URL**, **Data safety** (declare local storage, location, advertising ID), **content rating**, target audience, ads declaration (say **yes, contains ads**).
3. **Testing → Internal testing** → create a release → upload the `.aab` → add your email as a tester → install via the opt-in link. **Test on a real device first.**
4. When happy: **Production → Create release** → upload → submit for review.

---

## ⚠️ Honest caveats (please read)

- **This is source code, not a finished binary.** You must build it (above). Expect to fix the occasional small thing on a real device — that's normal for any RN app with native modules.
- **Android step counting is limited.** `expo-sensors` Pedometer is reliable on iOS, but on Android it only counts **while the app is open**, some devices' callbacks don't fire at all, and all-day/background history isn't supported. For robust Android steps, integrate **Health Connect** (a follow-up; the app degrades gracefully and shows a notice where the sensor is unavailable).
- **Ads & billing need approval + real setup.** AdMob may serve blank ads until your account/app is approved; IAP only works for a published (at least internally-tested) build with the product created and `expo-iap` enabled.
- **The free trial is client-side.** The 15-day clock is stored on the device, so a reinstall resets it. Fine for a small app; add a lightweight server check later if you want it tamper-resistant.
- **GPS is foreground-only** here (no background tracking) — simpler and avoids extra Play policy review. Keep the screen on during a workout.
- **Notifications need a dev/EAS build** (not Expo Go on SDK 53+) and the user must grant permission; on Android 13+ the POST_NOTIFICATIONS prompt appears. The toggle in *Me* stays on even if the OS denies, so it works once permission is granted in a real build.
- **iOS** needs the static-frameworks setting (already in `app.config.js`) and an Apple Developer account ($99/yr) to ship — but you can build/run Android without it.

---

## 🗂️ Project structure

```
App.js                    providers + AdMob init + onboarding gate + navigation
index.js                  entry
app.config.js             identity, permissions, native plugins (AdMob/location/sensors)
eas.json                  build profiles (production → .aab)
src/
  data.js                 pets, pillars, goals, reactions, mood engine
  content.js              shop items, affirmations, check-in moods, bond + cycle logic
  theme.js                5 themes + theme context
  store.js                AsyncStorage state + actions (bond, treats, cycle, history…)
  premium.js              IAP module (simulated | expo-iap) for the ₹30 unlock
  ads.js                  AdMob init, banner, interstitial (premium-aware)
  feedback.js             haptics helper
  notify.js               gentle daily local notifications
  components.js           Pet, Ring, Card, Pill, Row
  widgets.js              PetScene, Burst (confetti), Heatmap, MoodStrip, HydrationCups, Stepper
  screens/
    OnboardingScreens.js  choose + name your pet
    HomeScreen.js         care loop, check-in, feed, hydration, bond, goals
    TrackerScreen.js      GPS odometer + step counter
    ActivitiesScreen.js   custom-activity CRUD
    CycleScreen.js        private cycle tracking + phases
    ShopScreen.js         buy/equip accessories & scenes
    ProfileScreen.js      bond, insights, achievements, share, reminders, themes, premium
    PaywallScreen.js      PawHealth+ ₹30 unlock + restore
```

---

## 🔜 Good next steps

- Port the **social layer** (Wellness Circles, supportive feed, 1:1 chat) from the web prototype.
- Wire **expo-iap** for real and add **Health Connect** for reliable Android steps.
- Add a coin **shop tab for pet rooms/furniture** and **seasonal/event** collectibles to deepen long-term collection.
- Server-side trial + cloud backup (optional) for cross-device continuity.

Made with care — gentle by design. 💖
