# StackForge — Product & System Design Tycoon (React Native / Expo)

A real cross-platform mobile game built with **React Native (Expo SDK 58)**, **TypeScript**, and **SVG live packet animations**. Compiles directly to a native Android `.aab` / `.apk` for the Google Play Store.

## Quick Start in VS Code

1. Unzip this folder and open it in **VS Code**.
2. Open the VS Code terminal (`Ctrl + ~`) and run:
   ```bash
   npm install
   npx expo install --fix
   ```
3. Start the development server:
   ```bash
   npx expo start
   ```
4. Install **Expo Go** on your Android phone and scan the QR code in the terminal to play it live on your device.

## Building for Google Play Store (.aab)

When you are ready to publish to the Play Store:
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile production
```

## Project Architecture
- `App.tsx` — Main game shell, HUD, and modal routing.
- `src/types/game.ts` — Strongly typed models for Build modules, Cloud Infra, Marketing, Crew, and Chaos Events.
- `src/data/gameData.ts` — Content definitions with dual **Explorer (Plain English)** and **Developer (Tech Specs)** modes.
- `src/engine/useGameEngine.ts` — Real-time simulation loop (traffic REQ/S, capacity, bottlenecks, cloud burn rate, revenue, and star rating).
- `src/components/ArchitectureCanvas.tsx` — Live animated circuit canvas with color-coded traffic packets.
- `src/components/BottomDeck.tsx` — Reference-inspired bottom control deck with one-tap upgrades.
