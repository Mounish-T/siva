# Pulse Music — Complete Beginner's Guide

**For someone who has never built a Flutter app before.**

This guide takes you from zero to a working music app on your Android phone.
Every step has a **checkpoint** — a way to confirm you did it right before moving on.
If a checkpoint fails, you fix it before continuing, so errors don't pile up.

**Total time:** About 90 minutes (mostly waiting for downloads and installs)
**Total cost:** $0 — everything used is free

---

## Before you start — what you need

### A computer
- **Windows 10/11, macOS, or Linux** — any of these work
- **At least 8 GB of RAM** (16 GB makes it much smoother)
- **About 25 GB of free disk space** (Flutter + Android SDK + project)
- **A stable internet connection** for the first hour

### An Android phone (optional but recommended)
- Running **Android 8 or newer** (almost any phone made after 2017)
- A USB cable to connect it to your computer
- OR you can use the emulator that comes with Android Studio (slower but works)

### Three online accounts (all free)
- **Jamendo Developer account** (for music)
- **Supabase account** (optional, for login features)
- **Google account** (you probably have one)

---

## STAGE 1 — Install the tools

This is the longest stage. Take it slow. Each step has a checkpoint.

### Step 1.1 — Install Flutter

Flutter is the framework the app is built with. It comes with everything needed to compile the app.

**Go here:** https://flutter.dev/docs/get-started/install

Pick your operating system, follow the instructions on that page exactly.

**For Windows:**
- Download the Flutter SDK zip
- Extract it to `C:\flutter` (not Program Files — that path causes problems)
- Add `C:\flutter\bin` to your PATH environment variable

**For macOS:**
- Easiest way: install Homebrew first (https://brew.sh), then run `brew install --cask flutter`

**For Linux:**
- Download the tar.xz file, extract to `~/flutter`, add `~/flutter/bin` to your PATH

### ✅ Checkpoint 1.1
Open a **new** terminal window (Command Prompt on Windows, Terminal on Mac/Linux) and type:

```
flutter --version
```

**You should see** something like:
```
Flutter 3.27.x • channel stable
Tools • Dart 3.6.x
```

**If you see** "command not found" or "not recognized":
- Close the terminal completely and open a new one
- Verify the PATH was added correctly
- On Windows: restart your computer (sometimes needed for PATH to take effect)

**Do not continue** until `flutter --version` works.

---

### Step 1.2 — Install Android Studio

Android Studio gives you the Android SDK (which builds the APK) and an emulator (a virtual phone you can use if you don't have a real one).

**Go here:** https://developer.android.com/studio

Download the installer for your OS and run it. Accept all defaults.

When Android Studio opens the first time:
1. Click "Next" through the setup wizard
2. Choose "Standard" install type
3. Let it download the Android SDK (this takes 15-30 minutes — go get coffee)

### ✅ Checkpoint 1.2

In your terminal:

```
flutter doctor
```

**You should see** something like:
```
[✓] Flutter (Channel stable)
[✓] Windows Version
[✓] Android toolchain - develop for Android devices
[✓] Android Studio
[✓] Connected device
[✓] Network resources
```

**If you see red X marks**, fix them one by one:

| Red item | What to do |
|---|---|
| `Android toolchain` | Run `flutter doctor --android-licenses` and accept everything by typing `y` |
| `Android Studio - not installed` | You didn't install it. Go back to Step 1.2 |
| `Unable to locate Android SDK` | Open Android Studio → More Actions → SDK Manager → install the Android SDK |
| `cmdline-tools component is missing` | In Android Studio's SDK Manager → SDK Tools tab → check "Android SDK Command-line Tools" → Apply |

**Do not continue** until `flutter doctor` shows all green checkmarks (or only "Chrome - not installed" / "Visual Studio - not installed" which don't matter for Android).

---

### Step 1.3 — Install Java 17

The app uses Java 17. Most systems have a different version.

**Check what you have:**

```
java -version
```

**You need version 17.** If you see "17.0.x", skip to Checkpoint 1.3.

**To install Java 17:**

**Windows/Linux:** Download from https://adoptium.net (pick "Temurin 17 LTS"). Run the installer.

**macOS:** `brew install openjdk@17`

After install, tell Flutter where Java 17 is:

```
flutter config --jdk-dir="/path/to/your/jdk-17"
```

(On macOS with Homebrew the path is usually `/opt/homebrew/opt/openjdk@17`)
(On Windows it's usually `C:\Program Files\Eclipse Adoptium\jdk-17.x.x.x-hotspot`)

### ✅ Checkpoint 1.3

```
java -version
```

**You should see** `17.x.x` somewhere in the output.

---

### Step 1.4 — (Optional) Set up your Android phone

Skip this step if you'll use the emulator that came with Android Studio.

**On your Android phone:**
1. Open Settings → About phone
2. Tap "Build number" **7 times** in a row (yes, really) — you'll see "Developer mode enabled"
3. Go back to Settings → System → Developer options
4. Turn on "USB debugging"
5. Plug the phone into your computer with a USB cable
6. A popup on the phone asks "Allow USB debugging?" — tap **Allow**

### ✅ Checkpoint 1.4

```
flutter devices
```

**You should see** your phone listed, something like:
```
2 connected devices:
Pixel 7 (mobile) • abc123def • android-arm64 • Android 14 (API 34)
```

**If your phone doesn't appear:**
- Try a different USB cable (charging-only cables don't work)
- On the phone, change USB mode from "Charging only" to "File transfer"
- Revoke USB debugging authorizations (Developer options) and reconnect

**If you're using the emulator instead:**
- Open Android Studio → Tools → Device Manager → Create Virtual Device
- Pick "Pixel 6", click Next, download a system image (Android 14 recommended), Finish
- Click the green ▶ play button next to your virtual device
- Run `flutter devices` again — the emulator should appear

---

## STAGE 2 — Get free API keys

Pulse Music streams music from Jamendo. You need a free key.

### Step 2.1 — Get a Jamendo Client ID

1. Go to https://devportal.jamendo.com
2. Click **Sign up** (top right)
3. Fill in email and password — no payment info needed
4. Verify your email (check your inbox)
5. Log in
6. Click **Create new app** (or similar — the UI changes occasionally)
7. Fill in:
   - **App name:** Pulse Music (or anything)
   - **Description:** Personal music player
   - **App URL:** Leave blank or put `http://localhost`
8. Save
9. You'll see your **Client ID** — a string of about 8 hex characters

**Copy that Client ID to a text file** — you'll paste it in a build command later.

### ✅ Checkpoint 2.1

In your terminal, test the key works:

```
curl "https://api.jamendo.com/v3.0/tracks/?client_id=YOUR_CLIENT_ID_HERE&format=json&limit=1"
```

(Replace `YOUR_CLIENT_ID_HERE` with your actual ID. On Windows, use `curl.exe` instead of `curl` if needed.)

**You should see** a JSON response with a track in it — something like:
```
{"headers":{"status":"success","code":0,...},"results":[{"id":"168","name":"Sometrack",...}]}
```

**If you see** an error like `"Your credential is invalid"`:
- The Client ID is wrong. Re-copy it from devportal.jamendo.com.

**Do not continue** until this curl works.

---

### Step 2.2 — (Optional) Set up Supabase

**Skip this step if you just want to test the app.** The app works without Supabase — there's a "Continue without account" button.

If you want login, password reset, and persistent favorites across devices:

1. Go to https://supabase.com → Sign up (free, no credit card)
2. Click **New project**:
   - Name: `pulse-music`
   - Database password: make one up, save it
   - Region: pick the one closest to you
   - Pricing plan: **Free** (default)
3. Wait ~2 minutes while the project provisions
4. Once ready, go to **Settings** (gear icon, bottom left) → **API**
5. Copy these two values:
   - **Project URL** (looks like `https://abcdefg.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

**Save both to your text file.**

6. Now set up the database. Click **SQL editor** (left sidebar) → **+ New query**
7. Open the file `pulse_music/supabase_schema.sql` from the project zip on your computer
8. Copy its entire contents
9. Paste into the Supabase SQL editor
10. Click **Run** (bottom right, or Ctrl+Enter)

### ✅ Checkpoint 2.2

In Supabase, click **Table Editor** (left sidebar). **You should see** these tables:
- profiles
- favorites
- playlists
- playlist_tracks
- recently_played

**If they're missing**, the SQL didn't run correctly — re-paste and run it.

---

## STAGE 3 — Get the project onto your computer

### Step 3.1 — Extract the project

You downloaded `pulse_music.tar.gz`. Extract it.

**Windows:** Right-click → "Extract All" (you may need 7-Zip or WinRAR for .tar.gz — both are free)

**macOS:** Double-click the file in Finder — it extracts automatically

**Linux:** `tar xzf pulse_music.tar.gz`

You should now have a folder called `pulse_music`.

### ✅ Checkpoint 3.1

Open the `pulse_music` folder. **You should see** these things inside:

```
pulse_music/
├── android/
├── lib/
├── pubspec.yaml
├── README.md
├── BUILD.md
├── STATUS.md
├── supabase_schema.sql
├── .github/
└── cloudflare_worker/
```

---

### Step 3.2 — Generate Android boilerplate

The project I gave you has the customized Android files, but is missing some standard ones (the Gradle wrapper, app icons, etc.). One command generates those.

Open a terminal and navigate to the project folder:

```
cd path/to/pulse_music
```

Then run:

```
flutter create --org com.pulse --project-name pulse_music --platforms=android .
```

(That trailing `.` is important — it means "in the current folder")

This takes 30-60 seconds. It will print a list of "created" files.

### ✅ Checkpoint 3.2

Check that the Gradle wrapper exists:

**Windows:**
```
dir android\gradlew.bat
```

**macOS/Linux:**
```
ls android/gradlew
```

**You should see** the file listed. If you see "not found", the command above didn't run successfully — try again.

---

### Step 3.3 — Download all the packages

The project needs ~16 packages from pub.dev (Flutter's package registry).

```
flutter pub get
```

This takes 1-3 minutes the first time.

### ✅ Checkpoint 3.3

The command should end with something like:
```
Got dependencies!
```

**If it ends with errors** like "version solving failed":
- Try `flutter pub upgrade --major-versions`
- If still failing, your Flutter version might be too old. Run `flutter upgrade`

---

## STAGE 4 — Build and run the app

This is the moment of truth.

### Step 4.1 — First build (debug mode, faster)

Make sure your phone is connected (Checkpoint 1.4 passed) or your emulator is running.

In the project folder:

```
flutter run --dart-define=JAMENDO_CLIENT_ID=YOUR_CLIENT_ID_HERE
```

(Replace `YOUR_CLIENT_ID_HERE` with your Jamendo Client ID from Step 2.1.)

If you also set up Supabase, use the longer command:

```
flutter run --dart-define=JAMENDO_CLIENT_ID=YOUR_JAMENDO_ID --dart-define=SUPABASE_URL=https://yourproject.supabase.co --dart-define=SUPABASE_ANON_KEY=eyJhbGci...
```

**This first build takes 3-8 minutes.** Subsequent builds are 20-30 seconds.

You'll see lots of output. As long as it doesn't end with "BUILD FAILED" or "Error:", it's working.

### ✅ Checkpoint 4.1

After build finishes, the app should **automatically open on your phone or emulator**. You should see the onboarding screen (see Stage 5 for what each screen looks like).

**If you see "BUILD FAILED":**
Look at the last 20 lines of output for the actual error. Common ones:

| Error contains | Fix |
|---|---|
| "Gradle wrapper" or "gradlew" | Re-run Step 3.2 |
| "minSdkVersion" | A package needs newer Android. The project is configured for Android 8+, so this shouldn't happen — but if it does, edit `android/app/build.gradle` and change `minSdk 26` to `minSdk 28` |
| "Java" or "JVM" | Step 1.3 (Java 17) wasn't done correctly |
| "NDK" | Open Android Studio → SDK Manager → SDK Tools → check "NDK (Side by side)" → Apply |
| "license" or "not accepted" | Run `flutter doctor --android-licenses` and accept all |

---

### Step 4.2 — Test the app (still running)

While the app is running on the device, try these in order:

1. **Onboarding** — Swipe through 3 slides, tap "Get started"
2. **Login screen** — Tap "Continue without account" (or sign up if you set up Supabase)
3. **Home screen loads** — You should see "Trending now" with album art and song titles

### ✅ Checkpoint 4.2

**Tap any song** on the home screen.

**You should hear** music playing within 2-3 seconds.

**You should see** the mini-player appear at the bottom showing the song title.

**If no music plays:**
- Check your phone volume
- Check internet connection
- In the terminal, look for "JamendoException" — if you see it, your Jamendo Client ID is wrong

**If you see no songs at all** on the home screen:
- Pull down to refresh
- Check the terminal for network errors

---

### Step 4.3 — Build the release APK (the final installable file)

When you confirm the app works in debug mode, build the release version. This is the file you can install on any Android phone without needing your computer connected.

Stop the running app first (in the terminal, press **q**).

Then:

```
flutter build apk --release --dart-define=JAMENDO_CLIENT_ID=YOUR_CLIENT_ID
```

(Add the Supabase dart-defines too if you set them up.)

This takes 3-5 minutes.

### ✅ Checkpoint 4.3

When done, the terminal prints something like:
```
✓ Built build/app/outputs/flutter-apk/app-release.apk (24.3MB)
```

**You should now have** that file in `pulse_music/build/app/outputs/flutter-apk/`.

**To install it on a phone:**
- Copy `app-release.apk` to the phone (via USB, Google Drive, email, anything)
- On the phone, tap the file
- Allow "install from this source" if prompted
- The app installs like any other app

---

## STAGE 5 — Screen-by-screen tour of the app

I can't include real screenshots (I have no way to actually build and run the app to take them — fake screenshots would mislead you). Instead, here's a detailed text description of what each screen looks like.

### Screen 1 — Onboarding (first launch only)

```
┌──────────────────────────────────┐
│                                  │
│                                  │
│            ⊙ ⊙ ⊙                 │   ← Big circular icon (green)
│         (graphic_eq icon)        │
│                                  │
│        Welcome to Pulse          │   ← Title
│                                  │
│   Stream half a million tracks   │   ← Subtitle
│   from independent artists,      │
│   completely free.               │
│                                  │
│                                  │
│           ●  ●  ●                │   ← Page indicator (1 of 3 highlighted)
│                                  │
│      ┌─────────────────┐         │
│      │      Next       │         │   ← Green button
│      └─────────────────┘         │
│                                  │
│             Skip                 │
└──────────────────────────────────┘
```

**What's here:** Three swipeable slides. Each has a circular icon, title, subtitle. Bottom has a page indicator, a "Next"/"Get started" button (green), and a "Skip" link.

**Slides:**
1. "Welcome to Pulse" — intro
2. "Build your library" — favorites + playlists
3. "Listen anywhere" — background playback

**This screen appears once.** After you tap "Get started" or "Skip", it never shows again.

---

### Screen 2 — Login

```
┌──────────────────────────────────┐
│                                  │
│              ≋                   │   ← Pulse logo (green)
│                                  │
│         Pulse Music              │   ← Big bold title
│                                  │
│      Sign in to continue         │
│                                  │
│   ┌────────────────────────────┐ │
│   │ Email                      │ │   ← Text fields
│   └────────────────────────────┘ │
│   ┌────────────────────────────┐ │
│   │ Password                   │ │
│   └────────────────────────────┘ │
│              Forgot password?    │   ← Right-aligned link
│                                  │
│   ┌────────────────────────────┐ │
│   │         Log in             │ │   ← Green pill button
│   └────────────────────────────┘ │
│                                  │
│   ┌────────────────────────────┐ │
│   │  Continue with Google      │ │   ← Only if Google configured
│   └────────────────────────────┘ │
│                                  │
│       Don't have an account?     │
│              Sign up             │
│                                  │
│   ────────────────────────       │   ← Divider (only if no Supabase)
│   ┌────────────────────────────┐ │
│   │ Continue without account   │ │
│   └────────────────────────────┘ │
└──────────────────────────────────┘
```

**What's here:**
- Logo + app name + tagline at top
- Email + Password fields
- "Forgot password?" link (sends reset email via Supabase)
- "Log in" / "Sign up" toggle button
- "Continue with Google" button (only appears if you configured Google Sign-In)
- "Continue without account" (only if Supabase isn't configured)

---

### Screen 3 — Home tab

```
┌──────────────────────────────────┐
│ Good evening                     │   ← Time-based greeting
│                                  │
│ Recently played                  │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐     │   ← Horizontal carousel
│ │art │ │art │ │art │ │art │     │     of square cards
│ │    │ │    │ │    │ │    │     │
│ └────┘ └────┘ └────┘ └────┘     │
│  Song1  Song2  Song3  Song4      │
│  Artist Artist Artist Artist     │
│                                  │
│ Made for you                     │
│ ┌──────────┐ ┌──────────┐        │
│ │Daily Mix │ │Chill Mix │        │   ← Gradient mix cards
│ │ (purple) │ │  (blue)  │ ─→     │     (scrollable)
│ └──────────┘ └──────────┘        │
│                                  │
│ Trending now                     │
│ ┌────┐ ┌────┐ ┌────┐ ─→         │
│ └────┘ └────┘ └────┘             │
│                                  │
│ Browse genres                    │
│ ┌──────────┐ ┌──────────┐        │
│ │   Pop    │ │   Rock   │        │
│ └──────────┘ └──────────┘        │
│ ┌──────────┐ ┌──────────┐        │
│ │Electronic│ │  Hip Hop │        │
│ └──────────┘ └──────────┘        │
│                                  │
│ Fresh releases                   │
│ [list of tracks below...]        │
│                                  │
├──────────────────────────────────┤
│ 🎵 Now playing: Song name   ▶/⏸ │   ← Mini player (when something plays)
├──────────────────────────────────┤
│  🏠      🔍      📚              │   ← Bottom nav: Home / Search / Library
└──────────────────────────────────┘
```

**What's here:**
- **Greeting** changes by time: "Good morning" / "Good afternoon" / "Good evening"
- **Recently played row** — only appears once you've played something
- **Mix cards** — 5 colored gradient cards: Daily, Chill, Workout, Focus, Trending
- **Trending now** — horizontal scroll of popular tracks
- **Genre grid** — tap any genre → starts playing tracks from it
- **Fresh releases** — vertical list of newest tracks
- **Pull down** at the top to refresh everything
- **Mini-player** sits above the bottom nav when music is playing — tap it to open full player

---

### Screen 4 — Search tab

```
┌──────────────────────────────────┐
│ Search                           │
│ ┌────────────────────────────┐   │
│ │ 🔍 Songs, artists, anyth.. │   │   ← Search field
│ └────────────────────────────┘   │
│                                  │
│  Type something to start         │   ← Empty state hint
│       searching                  │
│  Millions of tracks from         │
│       Jamendo                    │
│                                  │
└──────────────────────────────────┘
```

After you type:

```
┌──────────────────────────────────┐
│ Search                           │
│ ┌────────────────────────────┐   │
│ │ 🔍 jazz                     │   │
│ └────────────────────────────┘   │
│                                  │
│ [art] Track Name           ⋮     │   ← Track list with menu button
│       Artist Name                │
│                                  │
│ [art] Track Name           ⋮     │
│       Artist Name                │
│                                  │
└──────────────────────────────────┘
```

**What's here:** A search field with a 400ms debounce (you stop typing → it searches after a brief pause, so it's not searching on every keystroke). Results appear below. Tap any result to play; tap the ⋮ for options (Like / Add to playlist / Download).

---

### Screen 5 — Library tab

```
┌──────────────────────────────────┐
│ Your Library              👤     │   ← Account icon → Profile
│                                  │
│ ┌────────────────────────────┐   │
│ │ ❤  Liked songs       12 →  │   │   ← Blue gradient
│ └────────────────────────────┘   │
│ ┌────────────────────────────┐   │
│ │ 🎵 Your playlists     3 →  │   │   ← Purple gradient
│ └────────────────────────────┘   │
│ ┌────────────────────────────┐   │
│ │ ⬇  Downloads          5 →  │   │   ← Green gradient
│ └────────────────────────────┘   │
│                                  │
│ Recently played                  │
│ [art] Song Name              ⋮   │
│       Artist                     │
│ ...                              │
└──────────────────────────────────┘
```

**What's here:**
- **Liked songs** card → opens a screen of all favorited tracks
- **Your playlists** card → opens playlist list, where you can create new ones
- **Downloads** card → opens downloads screen
- **Recently played** list at the bottom

---

### Screen 6 — Playlists (after tapping "Your playlists")

```
┌──────────────────────────────────┐
│ ← Playlists                  +   │   ← + button to create
│                                  │
│ 🎵 My favorites              5  │
│ 🎵 Workout pump              12 │
│ 🎵 Sleep                     8  │
└──────────────────────────────────┘
```

**Tapping +:** Pops up a dialog: "Playlist name" — type, hit Create.

**Tapping a playlist:** Opens its detail screen with tracks. **Swipe left on a track** to remove it. **Top right ⋮ menu** has Rename and Delete.

---

### Screen 7 — Player (tap the mini-player to open)

```
┌──────────────────────────────────┐
│ ⌄         PLAYING FROM QUEUE  ⋮ │   ← ⌄ closes, ⋮ opens options menu
│                                  │
│      ┌──────────────────┐        │
│      │                  │        │
│      │   Album art      │        │   ← Big square album art
│      │   (large)        │        │     Background gradient
│      │                  │        │     extracted from this art
│      └──────────────────┘        │
│                                  │
│  Song Title (big)            ❤  │
│  Artist Name                     │
│                                  │
│  ●━━━━━━━━━━━━━━━━━━━━━━━━      │   ← Seek bar
│  1:23                       3:45 │
│                                  │
│   🔀    ⏮       ▶       ⏭    🔁 │   ← Shuffle, prev, play/pause, next, repeat
│                                  │
│   🌙                          ☰  │   ← Sleep timer (left), Queue (right)
└──────────────────────────────────┘
```

**What's here:**
- **⌄ button** (top left): close player, back to where you came from
- **⋮ button** (top right): menu with Add to playlist / Sleep timer / Playback speed
- **Album art** — large
- **Background** — gradient extracted from album art (changes per song)
- **Title + Artist** below art
- **❤ heart** — toggle favorite
- **Seek bar** — drag to scrub
- **Transport row**: shuffle / previous / big white play-pause / next / repeat
- **🌙 sleep timer** — bottom left, glows green if active
- **☰ queue** — bottom right, opens the queue screen

---

### Screen 8 — Queue (from player ☰)

```
┌──────────────────────────────────┐
│ ← Queue                          │
│                                  │
│ NOW PLAYING                      │
│ [art] Current Song     (green)   │
│       Artist                     │
│                                  │
│ UP NEXT                          │
│ [art] Next Song                  │
│       Artist                     │
│ [art] Another                    │
│       Artist                     │
│ ...                              │
└──────────────────────────────────┘
```

**What's here:** The currently playing song highlighted in green at top, then the upcoming tracks. Tap any to jump to it.

---

### Screen 9 — Downloads

```
┌──────────────────────────────────┐
│ ← Downloads                      │
│                                  │
│ [art] Song Name             ✓   │   ← Completed (green checkmark)
│       Artist                  🗑 │
│                                  │
│ [art] Another                 ◐  │   ← Downloading (progress)  ✕
│       Artist  (downloading)      │
│                                  │
│ [art] Failed One        ↻   🗑   │   ← Failed — Retry / Delete
│       Artist                     │
└──────────────────────────────────┘
```

**What's here:**
- Completed downloads show ✓ + trash icon (to remove)
- In-progress show a spinner + ✕ (to cancel)
- Failed show ↻ (retry) + 🗑 (delete)
- Tap any completed download to play it (works offline)

---

### Screen 10 — Mix detail (tap any mix card on home)

```
┌──────────────────────────────────┐
│ ←      Daily Mix                 │   ← Page header (gradient bg)
│                                  │
│        Made for you,             │
│        refreshed every day       │   ← Mix description
│                                  │
│                          ▶ Play  │   ← Play button (green pill)
│                                  │
│ [art] Track 1              ⋮     │
│       Artist                     │
│ [art] Track 2              ⋮     │
│       Artist                     │
│ ...                              │
└──────────────────────────────────┘
```

**The 5 mixes are:**
- **Daily Mix** (purple) — personalized off your recent plays
- **Chill Mix** (blue) — chillout tag
- **Workout Mix** (red/yellow) — electronic
- **Focus Mix** (green) — ambient
- **Trending Mix** (pink) — what's popular

---

### Screen 11 — Profile (account icon on Library)

```
┌──────────────────────────────────┐
│ ← Profile                   ⚙   │   ← Gear → Settings
│                                  │
│              ●                   │   ← Big circle avatar
│             (G)                  │     (initial letter)
│                                  │
│       your-email@here.com        │
│                                  │
│ ┌──────┐ ┌──────────┐ ┌──────┐   │
│ │  12  │ │    3     │ │ 47   │   │   ← Stats cards
│ │Liked │ │Playlists │ │Played│   │
│ └──────┘ └──────────┘ └──────┘   │
└──────────────────────────────────┘
```

---

### Screen 12 — Settings

```
┌──────────────────────────────────┐
│ ← Settings                       │
│                                  │
│ ACCOUNT                          │
│ 👤 Signed in as                  │
│    your-email@here.com           │
│ 🚪 Sign out (red)                │
│                                  │
│ ABOUT                            │
│ 🎵 Music source                  │
│    Jamendo - Creative Commons    │
│ </> Backend                      │
│    Supabase (configured)         │
│ ℹ  Version                       │
│    Pulse Music 0.1.0             │
└──────────────────────────────────┘
```

---

## STAGE 6 — Common problems and fixes

### "The app crashes when I tap a song"
- Check internet connection
- Re-verify the Jamendo Client ID with the curl test from Checkpoint 2.1

### "I don't see album art, just gray squares"
- The track's album art URL is broken on Jamendo's side. Other tracks should work fine.

### "The notification doesn't appear when music plays"
- On Android 13+, when you first play a song, the system asks for notification permission. If you tapped "Don't allow", go to phone Settings → Apps → Pulse Music → Notifications → enable.

### "Music stops when I lock the screen"
- The foreground service permission wasn't granted. Uninstall and reinstall the app, and accept all permission prompts on first launch.

### "Google Sign-In says 'Developer error'"
- This means your APK's SHA-1 fingerprint isn't registered in Google Cloud Console. This is the most complex setup step — only do it if you really need Google Sign-In. Otherwise just use email signup.
- The full setup is in the project's README under "Set up Google Sign-In"

### "Downloads start but never complete"
- Check phone storage (Settings → Storage). If it's full, downloads fail silently.
- Check airplane mode is off

### "Build fails with 'Out of memory'"
- Close other programs
- Open `android/gradle.properties` and change `-Xmx4G` to `-Xmx2G` if you have less than 8GB RAM (or `-Xmx8G` if you have 16GB+)

---

## STAGE 7 — Sharing your APK with others

After Step 4.3, you have `app-release.apk`. To share it:

1. **Upload to Google Drive** or any cloud storage, share the link
2. **Or send via email/messaging** — the file is 20-35 MB

The recipient needs to:
1. Download the APK to their phone
2. Tap it from the Files app
3. Allow "Install unknown apps" if prompted
4. Tap Install

The app works without any further setup on their side — your Jamendo Client ID is baked into the APK at build time. They don't need to register for anything.

---

## Summary of what you need to know

| What | Where | Free? |
|---|---|---|
| Flutter SDK | flutter.dev | Yes |
| Android Studio | developer.android.com | Yes |
| Java 17 | adoptium.net | Yes |
| Jamendo Client ID | devportal.jamendo.com | Yes (no credit card) |
| Supabase | supabase.com | Yes (free tier — pauses after 7 days idle, but you can re-activate) |
| The project | The .tar.gz I gave you | Yes |
| Hosting / domain / anything else | Not needed | — |

**Total time investment:** First time, ~90 minutes including downloads. Once everything is installed, building takes 5 minutes.

**Total cost:** $0.

---

## Is the last zip enough?

**Yes.** `pulse_music.tar.gz` from the most recent response is the complete and final project. It contains all 57 files from all 3 batches combined. Ignore the earlier downloads — each one was superseded.

Inside that one archive you have:
- All source code
- Android configuration
- Supabase SQL schema
- Cloudflare Worker code
- GitHub Actions workflow
- 3 documentation files (this one, BUILD.md, STATUS.md, README.md)

You don't need anything from earlier responses.
