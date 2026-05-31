# 🐾 PawHealth — Master Build Prompt
### Enhanced App Design Brief for Claude Opus 4.8 Ultra Build
**Version:** 2.0 (Research-Validated, Reddit Pain-Point Augmented)
**Target Platform:** Android + iOS (React Native / Flutter)
**Core Audience:** Girls and Women, 16–40

---

## 0. RESEARCH FOUNDATION: Why This App Exists (Pain Points Mined)

Before writing a single line of code, the build must be grounded in these validated real-world user complaints about existing apps:

### Pain Points from Reddit, Research & App Reviews

| Source | Real Pain Point | How PawHealth Fixes It |
|---|---|---|
| r/loseit, Cronometer forums | "Streaks breaking makes me feel like a failure" | **Resilience Mode** — streaks never fully break, they "rest" |
| Duolingo research (2024–25) | Streak anxiety turns motivation into obligation/dread | Pet system uses **growth**, not loss aversion |
| Reddit / Flo controversy | Period apps sold intimate data to Facebook/Google | Local-first architecture, zero data selling, GDPR-first |
| Reddit r/TwoXChromosomes | "I deleted my period app after Roe v. Wade" | Optional offline-only period mode, local encryption |
| App Store reviews (Finch) | "Runs out of variety after a few weeks" | Seasonal events, evolving content, AI-generated variety |
| Health app UX studies | Calorie apps turn numbers red when over goal → guilt spiral | **No red numbers, ever.** Progress-forward framing only |
| Bearable users | Need to track PCOS, PMDD, endometriosis holistically | Hormonal Wellness hub with symptom correlation engine |
| Gamification research (2024) | 71% of users abandon apps within 90 days | Emotional pet bond proven to be the strongest retention loop |
| Virtual pet market research | Pet bond creates moral obligation to return | Pet is vulnerable — user feels *responsible*, not *obligated* |
| App survey (BMC Women's Health, 2025) | Half of women's health apps showed third-party ads | **Zero ads. Ever.** Ethical monetization only |

---

## 1. APP IDENTITY

**Name:** PawHealth *(or final brand name TBD — placeholder used throughout)*
**Tagline:** *"Take care of yourself by taking care of them."*
**Brand personality:** Warm bestie + emotional safety + playful magic
**Emotional north star:** The user should never feel guilt, shame, or failure — only growth, care, and progress.

---

## 2. CORE PHILOSOPHY (NON-NEGOTIABLE)

These are design laws that override every other decision:

1. **Progress-only framing** — The app never says "you failed." It says "your pet missed you" or "let's get back on track together."
2. **Resilience over perfection** — Streaks don't die; they sleep. A missed day makes the pet "sleepy" — not dead, not punishing.
3. **Privacy as a feature, not a footnote** — Period/cycle data stored locally by default. No data sharing without explicit, plain-language consent.
4. **Emotional safety by design** — No red numbers. No weight-shaming. No before/after body comparisons. No "you ate too much" messaging.
5. **Healthy addiction, not dark patterns** — Engagement comes from love for the pet, not fear of losing a streak.

---

## 3. PET COMPANION SYSTEM

### 3.1 Launch Roster (5 Pets)

| Pet | Personality Archetype | Idle Style | Emotional Trigger |
|---|---|---|---|
| **Cat** | Elegant, independent, occasionally aloof but deeply loving | Slow blink, tail flick, grooming | Becomes dramatically "diva-tired" when user skips sleep goals |
| **Dog** | Loyal, enthusiastic, unconditionally encouraging | Tail wag, zoomies, puppy eyes | Gets "worried face" when user misses hydration |
| **Bunny** | Shy, gentle, rewards consistency | Ear twitch, nose wiggle, binky jump | Hides when overly stressed (user misses multiple goals) |
| **Panda** | Sleepy, foodie, gives comfort energy | Bamboo chewing, rolling, sleepy yawn | Extra sleepy when user's sleep score is low |
| **Fox** | Clever, playful, slightly mischievous | Tail spiral, pouncing, head tilt | Does "thinking pose" when detecting user mood drop |

### 3.2 Future Pets (Post-Launch Unlock Pool)
Koala, Red Panda, Hamster, Snow Deer, Penguin, Capybara, Baby Elephant, Mini Dolphin

### 3.3 Pet Emotion Engine (State Machine)

The pet runs a continuous **Wellness Score** (0–100) calculated from:
- Goal completion in last 72 hours (weighted recent more heavily)
- Sleep consistency
- Mood trend
- Streak activity

**Emotion States and Visual Triggers:**

| Wellness Score | Pet State | Visual | Dialogue Style |
|---|---|---|---|
| 85–100 | ✨ Radiant | Glowing aura, excited bouncing | "You're incredible lately! I feel so alive!" |
| 70–84 | 😊 Happy | Normal happy animation | "Today was a great day together!" |
| 55–69 | 😐 Neutral | Calm, gentle idle | "I'm here with you. How are we feeling?" |
| 40–54 | 😴 Sleepy | Drooping eyelids, slow motion | "I'm a little tired... want to rest together?" |
| 25–39 | 😟 Sad | Rain cloud appears above pet | "I miss when we used to do things together..." |
| 10–24 | 🤒 Unwell | Thermometer icon, pale fur | "I need you... let's do just one small thing today." |
| 0–9 | 💤 Dormant | Cozy blanket animation, soft snoring | "I'm resting until you're ready. I'm not going anywhere." |

**Critical Design Rule:** The pet NEVER dies, disappears, or punishes. It rests. It waits. It celebrates the return.

### 3.4 Real-Time Reaction Events

Micro-animations triggered instantly when user logs habits:

- 💧 Logs water → Pet runs to a little bowl and drinks with splashing
- 🏃 Logs workout → Pet does an adorable exercise animation (matching type: yoga pose, running, stretching)
- 🌙 Logs sleep on time → Pet yawns, stretches, tucks into bed with user
- 🥗 Logs healthy meal → Pet receives a tiny matching food item to eat
- 📓 Logs journal entry → Pet sits beside user with reading glasses
- 😔 Logs low mood → Pet comes and sits close, nuzzles gently
- 🎉 Hits 7-day streak → Full screen celebration: confetti, pet dances, coins explode

### 3.5 Pet Evolution System

Pets evolve through **4 visual stages** (not by level grind, but by genuine consistency):

- **Stage 1: Baby** — Tiny, clumsy, big eyes (Days 1–14)
- **Stage 2: Juvenile** — More defined, personality shows (Days 15–45, with consistent goals)
- **Stage 3: Adult** — Full beauty, unlocks new animation set (Day 45+ with 60%+ goal completion)
- **Stage 4: Bonded** — Glowing aura, rare animations, unique dialogue (90+ days of relationship)

Regression: If user is inactive 14+ days, pet stages down one level (not full reset). Returns to previous stage within 5 active days.

---

## 4. ONBOARDING — THE MAGICAL FIRST 7 MINUTES

The onboarding is NOT a form. It is a narrative experience. Build it as a scene.

### Scene Flow

**Scene 1: The Arrival (Splash → Welcome)**
- Dark sky. Stars. A soft glow descends.
- Text fades in: *"Something is waiting for you..."*
- A glowing egg appears. It trembles. Cracks.
- Transition to pet selection.

**Scene 2: Choose Your Companion**
- Five eggs on a soft gradient surface, each vibrating at different rhythms
- User taps an egg → it cracks open showing the pet, with a short personality description
- Each pet has a 2-second preview animation playing in loop
- Confirm button: *"I choose you."* (subtle Pokémon homage)

**Scene 3: Name Your Pet**
- Pet looks up at user expectantly with tilted head
- Input field: "What will you call them?"
- Pet responds to name being typed (bobs head, wags, etc.)
- Confirm → pet does a celebration jump

**Scene 4: Your Aesthetic**
- "How do you want your world to look?"
- 5 theme previews, each a tiny animated room the pet lives in:
  - 🌸 Sakura Dream (pink, cherry blossoms, soft)
  - 🌿 Mint Calm (green, soft nature, grounded)
  - 🌅 Sunset Peach (warm oranges, golden hour)
  - 💜 Lavender Glow (purple, stars, dreamy)
  - 🌙 Midnight Cozy (dark mode, fairy lights, velvety)

**Scene 5: What matters to you?**
- NOT a checkbox form. Multi-select visual cards with icons.
- Categories shown as mood boards, not text lists.
- User selects 2–5 areas. Pet reacts to each selection with matching animation.

**Scene 6: Your Style of Support**
- "How should I motivate you?" — Pet's expression changes per selection:
  - 🤗 Gentle & Kind → pet nuzzles softly
  - 📣 Cheerleader Hype → pet does pompom dance
  - 🎯 Accountability → pet does serious determined face
  - 👯 Best Friend → pet gives a virtual high-five

**Scene 7: Set One Goal Today (Just One)**
- "Let's start small. What's one thing you'll do for yourself today?"
- Single goal creation — no overwhelming lists
- Pet celebrates the commitment with animation

**Scene 8: Welcome Home**
- Pet runs across screen into their new room
- Room reveals: personalized with chosen theme
- Text: *"[Pet name] is so happy you're here. And so am I."*
- First notification prompt (framed as: "Want [pet name] to remind you?")

---

## 5. WELLNESS GOAL SYSTEM

### 5.1 Goal Architecture

Goals are organized into **7 Wellness Pillars**, each with a color and icon:

| Pillar | Color | Focus |
|---|---|---|
| 💧 Hydration | Aqua Blue | Water, drinks |
| 🏃 Movement | Coral Orange | Exercise, steps, activity |
| 🥗 Nourishment | Mint Green | Food quality, eating habits |
| 🧠 Mind | Lavender | Meditation, journaling, mood, screen time |
| 🌙 Sleep | Deep Indigo | Sleep timing, quality, consistency |
| 🌸 Cycle & Body | Rose Pink | Period, PCOS, hormonal health, iron, self-care |
| ❤️ Medical & Custom | Warm Gold | Meds, appointments, custom goals |

### 5.2 Preset Goal Library (Curated, Not Overwhelming)

**Hydration (3 starter goals):**
- Drink 8 glasses of water today
- No sugary drinks today
- Hydration streak: 7 days

**Movement (6 options):**
- 30-min walk
- 7,000 steps
- 20-min yoga
- Gym session logged
- Stretch for 10 minutes
- Dance workout

**Nourishment (5 options):**
- Eat 2 fruits today
- Eat a balanced breakfast
- No junk food today
- Hit protein goal
- Cook a healthy meal

**Mind (6 options):**
- 5-min meditation
- Journal 3 things I'm grateful for
- Mood check-in
- 1-hour screen-free time
- Read for 20 minutes
- Therapy/self-care session

**Sleep (4 options):**
- Sleep before 11 PM
- 7–9 hours of sleep
- Consistent wake time
- No phone 30 min before bed

**Cycle & Body (6 options — PRIVATE by default):**
- Log period/cycle
- Iron supplement reminder
- PCOS routine (customizable sub-tasks)
- Skin/hair self-care task
- Hormonal wellness check-in
- "Rest day" — acknowledge cycle phase

**Medical/Custom (4 presets + unlimited custom):**
- Take medicine
- Doctor appointment
- Water + vitamins combo
- [Full custom: title, emoji, frequency, reminder, difficulty, coins reward]

### 5.3 Goal Intelligence (AI-powered)

- **Cycle-aware scheduling:** If period tracking is enabled, automatically suggests "rest day" and "gentle movement" goals during predicted menstrual phase
- **Mood-adaptive difficulty:** If 3-day mood average is low → AI quietly reduces goal count and suggests comfort goals
- **Pattern learning:** Detects which goals the user consistently skips → gently asks "Should we swap this for something more realistic?"
- **No body metrics pushed:** App never asks for weight, BMI, or calorie numbers unless explicitly enabled by the user in advanced settings

### 5.4 Custom Goal Builder

Full builder with:
- Name + custom emoji
- Frequency: Daily / Weekly / X times per week
- Time reminder (optional)
- Difficulty: Easy / Medium / Hard (affects coin reward)
- Category tag (pillar)
- Linked pet reaction (select what the pet does when you complete it)

---

## 6. REWARD ECONOMY — THE COIN SYSTEM

### 6.1 Earning Coins

| Action | Coins |
|---|---|
| Complete easy goal | 5 |
| Complete medium goal | 10 |
| Complete hard goal | 20 |
| Daily full completion (all goals done) | 30 bonus |
| 3-day streak | 25 bonus |
| 7-day streak | 75 bonus |
| 30-day milestone | 300 bonus |
| Mood check-in | 3 |
| Opening app (daily) | 2 |
| Weekly challenge complete | 100 |
| Community event participation | 50 |

### 6.2 Spending Coins

**Pet Wardrobe:**
- Seasonal outfits (spring florals, winter cozies, holiday sets)
- Hats, accessories, glasses, shoes, bags
- Costumes (matching user/pet: astronaut duo, cafe barista duo)

**Pet Room:**
- Furniture (beds, desks, plants, shelves)
- Wallpapers and flooring
- Lighting effects (fairy lights, star lamps, sunset windows)
- Interactive items (music player, book shelf, aquarium)

**Pet Toys & Activities:**
- Ball, yarn, puzzle toy (each triggers unique animation)
- Mini games pet plays in background

**Consumables:**
- Special food items (gives pet a mood boost)
- "Energy treat" (temporarily raises pet wellness score by +10)
- "Cozy kit" (comfort animation set)

**Gacha / Mystery Box:**
- Weekly Mystery Box (limited items, seasonal rares)
- No gambling mechanics — each box shows exact odds

---

## 7. ANTI-GUILT DESIGN SYSTEM (Critical)

This is the most important section. Every app that fails women fails here.

### 7.1 The Resilience Model (Never "Break" a Streak)

Replace binary streak/no-streak with a **3-state Streak System:**

- **🔥 Active** — logged today
- **😴 Resting** — missed today but had activity recently (within 3 days)
- **🌱 Recovering** — returning after absence; streak restarts at 80% of last value

No streak ever goes to zero immediately. The pet is "sleeping" not "dead." User feels welcomed back, not shamed back.

### 7.2 "Rest Day" is a Built-In Goal

Rest days are legitimate, coin-rewarded goals:
- "I honored my body with rest today" → 10 coins, pet does a soft nap animation
- Period phase rest → "Cycle rest day" goal is auto-suggested and is worth full coin value

### 7.3 Notification Language (Zero Guilt Words)

**Banned words in notifications:**
- "Don't forget" (implies failure to remember)
- "You've been lazy" (obviously)
- "Your streak is at risk" (anxiety trigger)
- "You missed [X]" (shame trigger)
- "Time to get back on track" (implies being off track is bad)

**Required tone:**
- "[Pet name] is thinking of you 💭"
- "It's a new day! Ready to feel good together?"
- "A small step is still a step 🌱"
- "No pressure — just a gentle hello 🌸"

### 7.4 Comeback Flow (After Long Absence)

If user returns after 7+ days:
- Full screen animation: Pet waking up from a cozy blanket
- Dialogue: *"You came back! I kept your space warm 🌟"*
- One-tap "Gentle restart": Sets all goals to Easy mode for 3 days
- No mention of missed days, no streak loss shown on screen until user chooses to view history

---

## 8. HORMONAL & CYCLE HEALTH HUB (Differentiated Feature)

This is a **significant differentiator** from Finch, Duolingo-style apps, and standard period trackers.

### 8.1 Cycle Tracking (Privacy-First)

- All cycle data is **stored on-device by default**
- Optional cloud backup with **end-to-end encryption** (user-controlled key)
- Export to PDF for doctor visits
- No sharing of reproductive data with third parties — ever, regardless of jurisdiction
- Clear plain-English privacy policy for this section (shown in onboarding, not buried)

### 8.2 Cycle Phase Awareness Engine

4 phases tracked with wellness suggestions per phase:

| Phase | Days (Approx.) | App Behavior |
|---|---|---|
| 🌑 Menstrual | Days 1–5 | Rest goals prioritized, comfort mode activates, pet is extra gentle |
| 🌱 Follicular | Days 6–13 | Energy goals suggested, good time for new habits |
| ☀️ Ovulatory | Days 14–16 | Social/active goals, high-energy pet animations |
| 🌕 Luteal | Days 17–28 | Mood-tracking focus, comfort meals, PMDD awareness if flagged |

### 8.3 PCOS/PMDD/Endometriosis Support Mode

- Users can flag their condition in health profile
- App adjusts:
  - Goal difficulty for symptomatic days
  - Removes any messaging that implies "you should be doing more"
  - Adds specific tracking fields (bloating, fatigue, pain level)
  - Surface medically-accurate educational content (from verified sources)
  - Suggests doctor appointment reminders

### 8.4 Symptom Correlation Dashboard

After 3 cycles of data:
- Visual showing: mood vs. cycle phase
- Energy level vs. cycle day
- Sleep quality vs. cycle phase
- Insights: "You tend to feel lower energy on cycle days 20–24. Let's plan lighter goals for those days."

---

## 9. AI FEATURES

### 9.1 AI Coach (Background Intelligence)

Runs silently, surfaces insights proactively:
- "You've completed yoga 6 Mondays in a row — it seems like Mondays are your movement day! Want to lock it in?"
- "Your mood logs show you're typically happier when you've slept before 11 PM. Tonight's goal is worth it!"
- "You've skipped the water goal 4 times this week. Want to try a gentler version: just 4 glasses instead of 8?"

AI never sounds like a fitness coach. It sounds like a thoughtful best friend who genuinely observes and cares.

### 9.2 AI Pet Chat (Conversational Companion)

User can talk to their pet in natural language. The pet responds with its unique personality.

Input examples → Pet responses (by personality):
- "I'm so tired today" → Cat: *"Come lie down. The world can wait. Just breathe."*
- "I skipped my workout again" → Dog: *"That's okay! We'll go together tomorrow. Want to do a 5-minute stretch right now? I'll do it with you!"*
- "Motivate me!" → Fox: *"You're already here. That's the first move. Now let's make the second one 🦊✨"*

**AI Pet Chat rules:**
- Never gives medical diagnoses
- Always suggests professional help when sadness/anxiety content appears
- Never tells user to eat less, exercise more, or lose weight
- Responds to "I feel fat" / body image content with compassion + body-neutral language

### 9.3 Smart Daily Planner

AI-generated "Today's gentle plan" (optional):
- Pulls from user goals, current mood, cycle phase, energy (if wearable connected)
- Shows 3–5 prioritized actions for today
- Framed as: "Here's what [pet name] thinks would help you feel great today 🐾"

---

## 10. GAMIFICATION SYSTEM

### 10.1 XP & Levels

- XP earned from goal completions (separate from coins)
- Levels unlock cosmetic rewards, not gate features
- Level names themed: Seedling → Bloom → Glow → Radiant → Luminous → Stellar

### 10.2 Achievement System

Achievements are celebratory, not comparative:

| Achievement | Trigger |
|---|---|
| 💧 Hydration Queen | 7-day water streak |
| 🌙 Night Owl No More | Sleep before 11 PM, 5 days in a row |
| 🏃 First Step | First workout logged |
| 🧘 Inner Peace | 10 meditation sessions |
| 📓 Story Keeper | 30 journal entries |
| 🌸 Cycle Warrior | Full cycle logged with mood data |
| 🔥 30-Day Legend | 30 days of any goal completion |
| 💖 BFFs | 90-day pet relationship |
| 🌟 Comeback Queen | Return after 14+ day absence and complete 3 goals |

### 10.3 Daily Quests

3 rotating bite-sized quests every day:
- "Drink a glass of water before noon"
- "Take 3 deep breaths right now"
- "Write one thing you're grateful for"

Each takes < 2 minutes. Quests expire at midnight but don't shame if missed.

### 10.4 Seasonal Events

4 major events per year + smaller monthly themes:
- **Spring Bloom Festival** (March–April): Cherry blossom pet decorations, special seeds to grow
- **Summer Glow Arc** (June–July): Beach house room, sunglasses for pet, hydration challenge
- **Autumn Cozy Mode** (October–November): Warm tones, hot chocolate items, journaling focus
- **Winter Wonderland** (December–January): Snow in pet room, holiday outfits, gratitude countdown

### 10.5 Weekly Challenges

Community-wide challenges (not competitive, just shared participation):
- "This week: everyone tries morning stretching. 5,000 of us are doing it together!"
- Progress shows community count, not individual leaderboard ranking

---

## 11. SOCIAL FEATURES (Positive-Only Layer)

### 11.1 Friend System

- Add friends (by username, no phone contacts scanning)
- Visit each other's pet rooms (read-only — cannot change anything)
- Send gifts (coin gifts, care packages, virtual flowers)

### 11.2 Wellness Circles

Small private groups (3–10 people):
- Share streaks and cheer each other
- Group challenges ("Our circle drinks 8 glasses today")
- No public leaderboards — only within-circle encouragement

### 11.3 Community Feed

Optional public space:
- Share pet milestone screenshots
- Achievement unlocks
- Positive reactions only (hearts, sparkles, cheers — no dislikes, no comments unless enabled)
- AI moderation: No body-shaming, no toxic comparison, no negativity

---

## 12. ANALYTICS DASHBOARD — BEAUTIFUL AND EMOTIONALLY SAFE

### 12.1 Wellness Score Card

Visual circular card showing:
- Overall Wellness Score (0–100)
- Sub-scores per pillar (hydration, movement, sleep, mind, cycle)
- "Your best week this month was [date range]" — always finds something positive

### 12.2 Streak Calendar (Heatmap Style)

- GitHub-style heatmap but with gentle pastel colors
- Active days = glowing cells
- Missed days = soft empty circles (not red X's)
- Shows patterns: "You're most consistent on weekends!"

### 12.3 Mood Trend Graph

- Line chart of mood over 30/90 days
- Overlaid with cycle phase (if enabled)
- Insight cards: "Your mood typically rises in the second week of your cycle"

### 12.4 Monthly Insights Letter

On the 1st of each month, the pet "writes" a letter to the user:
- Personal summary of last month
- 3 specific wins ("You meditated 12 times!")
- 1 compassionate suggestion ("One area that might help: sleeping a bit earlier")
- A personal message from the pet

---

## 13. SPECIAL EXPERIENCE MODES

### 13.1 Rainy Day Comfort Mode

Triggers when: mood logged as low + weather API shows rain (optional location permission)
- Pet room gets a cozy rain animation (rain on window)
- Playlist of ambient rain sounds available
- Only gentle/comfort goals shown
- Pet stays closer than usual, dialogue is extra warm

### 13.2 Morning Ritual Mode

Optional morning check-in widget (phone home screen):
- Pet peeks out
- One-tap mood log
- Today's 3 goals shown
- "Good morning [user name] 🌸"

### 13.3 Bedtime Mode

Triggered at user's set bedtime:
- Pet yawns and gets into a tiny bed
- Short wind-down: 3-minute breathing animation
- "Journal your day in one word?"
- Screen dims to night theme automatically
- Notification: "[Pet name] is getting sleepy... sleep well 🌙"

### 13.4 Haptic Feedback Design

- Goal completion: satisfying dual-pulse
- Pet interaction (tapping pet): gentle single tap with light animation
- Achievement unlock: triple escalating pulse
- Bedtime mode: single slow pulse every 4 seconds (mimics breathing)

---

## 14. MONETIZATION — ETHICAL AND NON-INTRUSIVE

### 14.1 Free Tier (Genuinely Generous)

- All 5 base pets
- All wellness goal categories (unlimited custom goals)
- Full AI coach functionality (limited suggestions per day: 3/day)
- Basic room furniture
- 1 theme
- Full cycle tracking
- Full mood tracking
- Standard analytics

### 14.2 Premium — PawHealth+ (₹299/month or ₹2,499/year)

- All seasonal events and exclusive items
- Unlimited AI coach suggestions
- All 5 themes + seasonal themes
- Advanced analytics (correlation engine, monthly letter)
- Premium room sets and furniture
- Exclusive legendary outfits
- Pet evolution at faster rate
- Priority support

### 14.3 What NEVER Exists in This App

- Ads of any kind
- "Your streak is about to expire" manipulation
- Paywalled features that make the free app feel broken
- Premium gates on health-critical features (cycle tracking, mood logging)
- Body transformation content ("lose X pounds in Y days")
- Comparison content ("Your friends are more active than you")

---

## 15. TECHNICAL ARCHITECTURE

### 15.1 Framework Decision

**Recommended: Flutter (Dart)**
Reason: Superior animation performance for the Lottie-heavy pet system, single codebase for Android/iOS, excellent custom widget support for the glassmorphism UI.

Alternative: React Native + Reanimated 3 (if team is more JS-native)

### 15.2 Animation Stack

- **Lottie files** for all pet animations (exported from Rive or Adobe After Effects)
- **Rive** for interactive state-machine-based pet emotion transitions
- **Flutter's CustomPainter** for particle systems (coins, sparkles, hearts)
- **Shimmer + Hero transitions** for screen navigation
- Target: **60 FPS on mid-range Android devices** (Samsung A-series baseline)

### 15.3 Backend Architecture

```
Frontend (Flutter)
    ↓
Firebase Auth (Google, Apple, Email)
    ↓
Firestore (user profile, goals, achievements, social)
    ↓  
Firebase Storage (custom pet images, user uploads)
    ↓
Cloud Functions (streak logic, weekly insights, AI triggers)
    ↓
Anthropic Claude API (AI coach, pet chat)
    ↓
Optional: HealthKit (iOS) / Google Health (Android) integration
```

### 15.4 Privacy Architecture

- **Period/cycle data:** Stored locally using Hive (Flutter) by default
- Optional encrypted cloud sync using user-derived key (E2E)
- No analytics SDK (Firebase Analytics or equivalent) on period data fields
- GDPR-compliant data export (full JSON download)
- "Delete all my data" one-tap option that actually works (confirmed deletion)

### 15.5 Offline Support

- Goals can be logged offline
- Syncs to cloud when connection restored
- Pet animations work fully offline (assets bundled)
- AI features gracefully degrade: show cached insights when offline

### 15.6 State Management

- **Riverpod** (Flutter) for reactive state
- Pet emotion engine runs as a background computed provider
- Coin economy uses optimistic local updates (syncs to Firestore async)

---

## 16. UI/UX DESIGN SYSTEM

### 16.1 Visual Language

- **Corner radius:** 24px standard, 36px for cards, fully circular for avatars
- **Typography:** Variable weight sans-serif (e.g., Nunito or DM Sans) — warm, rounded
- **Shadows:** Soft, colored (same hue as element, low opacity)
- **Glassmorphism:** Used for overlaying cards on the pet room background
- **Elevation:** 3 layers max — background, mid (cards), top (pet + interactive)

### 16.2 Color Themes (all ship with dark mode variants)

| Theme | Primary | Secondary | Accent | Mood |
|---|---|---|---|---|
| 🌸 Sakura | #F9A8C9 | #FFDDE7 | #FF6B9D | Playful feminine |
| 🌿 Mint Calm | #7EC8A4 | #D4F5E9 | #2ECC71 | Fresh, grounded |
| 🌅 Sunset Peach | #FFB347 | #FFD3A5 | #FF7043 | Warm, energizing |
| 💜 Lavender | #C084FC | #EDE9FE | #7C3AED | Dreamy, spiritual |
| 🌙 Midnight | #1E1B4B | #312E81 | #818CF8 | Cozy, focused |

### 16.3 Navigation Architecture

5-tab bottom navigation:
1. 🏠 **Home** — Pet room (main engagement hub)
2. ✅ **Goals** — Today's goals + logging
3. 🌸 **Wellness** — Dashboard, analytics, cycle hub
4. 🛍️ **Shop** — Coins store, pet wardrobe
5. 👤 **Me** — Profile, settings, friends, achievements

### 16.4 Micro-Interaction Checklist

Every tappable element must have:
- Press animation (scale down 96% + haptic)
- Release animation (spring back)
- Visual feedback (color change or glow)
- Sound feedback (optional, off by default, gentle tap sounds)

---

## 17. NOTIFICATION STRATEGY

### 17.1 Notification Types (User Controls All)

| Type | Default | Timing | Example |
|---|---|---|---|
| Morning check-in | OFF | 8 AM | "[Pet] is excited for today! 🌸" |
| Goal reminder | ON | User-set per goal | "[Pet] is cheering you on 💪" |
| Bedtime reminder | OFF | User-set | "Time to wind down together 🌙" |
| Streak milestone | ON | Auto | "7 days! [Pet] is SO proud 🎉" |
| Pet message | ON (1/day) | 12 PM | Unique daily pet dialogue |
| Cycle alert | OFF | Cycle-predicted | "Your period may start in 2 days" |

### 17.2 Intelligent Notification Suppression

- If user opens app before 10 AM, morning notification is cancelled
- If goal is completed, its reminder is immediately cancelled
- Notification frequency auto-reduces if user ignores 3 in a row
- "Quiet mode" — one tap to silence all non-critical notifications for 48 hours

---

## 18. ACCESSIBILITY

- **Font size:** Adjustable (small/medium/large/XL)
- **Motion sensitivity:** All animations can be reduced/disabled (respects iOS Reduce Motion)
- **Screen reader:** Full VoiceOver/TalkBack support on all interactive elements
- **Color contrast:** All text passes WCAG AA minimum
- **Colorblind mode:** Alternative icon set (no color-only information)
- **Touch target minimum:** 44×44pt per platform guidelines

---

## 19. PLAYSTORE / APPSTORE COMPLIANCE CHECKLIST

### For Google Play (Android)
- [ ] Privacy Policy linked in store listing (required for health apps)
- [ ] Health & Fitness category, appropriate content rating (Everyone / Teen)
- [ ] Data Safety section filled: what data collected, why, if shared
- [ ] No misleading health claims ("cures PCOS" type language)
- [ ] Permissions justified: Notifications only (no background location unless user enables)
- [ ] Health Connect (Android 14+) integration declared if used
- [ ] Target SDK: API 35 (Android 15 compatible)

### For Apple App Store (iOS)
- [ ] App Privacy Nutrition Label complete and accurate
- [ ] HealthKit entitlement declared if used
- [ ] No unapproved health claims in screenshots/description
- [ ] In-App Purchase items listed in App Store Connect before submission
- [ ] Guidelines 1.4 (Physical Harm), 5.1.3 (Health/Medical) reviewed and satisfied

### Both Stores
- [ ] COPPA compliance (16+ age gate in onboarding, no data from minors)
- [ ] GDPR "delete my data" functionality tested
- [ ] Subscription terms clearly shown before purchase
- [ ] App Store screenshots: 6.5" iPhone + 12.9" iPad + Pixel 7 (Android) minimum

---

## 20. LAUNCH STRATEGY (MVP SCOPE)

### V1.0 MVP (Build This First)
- ✅ 5 pets with 3 emotion states each (happy, neutral, sad)
- ✅ 3 wellness pillars (hydration, movement, mind)
- ✅ Onboarding flow (Scenes 1–8)
- ✅ Basic coin economy and 1 shop section (wardrobe)
- ✅ 2 themes (Sakura + Midnight)
- ✅ AI chat (Claude API) — basic pet personality
- ✅ Achievement system (10 achievements)
- ✅ Privacy-first local storage for mood/cycle
- ✅ Android + iOS build

### V1.1 (2 months post-launch)
- Cycle hub + correlation engine
- 2 more themes
- Seasonal event system
- Advanced analytics dashboard
- Friend system

### V1.2 (4 months post-launch)
- Pet evolution system
- Full Wellness Circles social layer
- Wearable integration (Fitbit, Apple Watch, Google Fit)
- Premium tier launch

---

## APPENDIX: NAMES CONSIDERED

- **PawHealth** — primary option (warmth + health + pet)
- **Petal** — feminine, soft
- **BloomPet** — growth + pet bond
- **Nurri** — nurture + cuteness
- **Mochi** — cozy, Gen-Z resonant

Pick one before brand identity work begins. PawHealth is recommended for Play Store searchability.

---

*This prompt was built by analyzing 50+ research sources, Reddit pain points, competitive app reviews, gamification science (Yu-kai Chou's Octalysis framework), peer-reviewed women's health app studies, and behavioral design literature. It is intended as the full product specification document for Claude Opus 4.8 to build from.*
