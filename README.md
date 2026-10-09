# Field Notes

An Expo app that lists posts from [JSONPlaceholder](https://jsonplaceholder.typicode.com). It installs as its own app and does not run inside Expo Go.

## Features

- List every post with its title, body, and comment count.
- Open a post and read its comments.
- Search titles and bodies.
- Save a post and show only saved posts.
- Pull to refresh the list.

Saved posts last until the app process ends. They are not stored on disk and they are not sent to the API.

## Stack

- Expo SDK 57 and Expo Router
- Axios for REST
- TanStack Query for server state
- Zustand for search, the Saved filter, and favorite ids
- Jest and React Native Testing Library

## Requirements

- Node.js 22 or newer
- npm
- Android Studio with an emulator or a USB device, for an Android build
- JDK 17. Android Studio’s bundled JDK 25 fails the native CMake step. Set Android Studio’s Gradle JDK to JDK 17, or set `org.gradle.java.home` in `android/gradle.properties`. The `android/` folder is generated and is not committed.

## Getting started

```bash
npm install
npm run android
```

The first Android command compiles the app and installs **TechChallengeEN**. After that, start the dev server and open that icon:

```bash
npm start
```

`npm run android:release` builds a binary that includes the JavaScript, so it opens with the dev server stopped.

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Starts the dev server for the installed development build |
| `npm run android` | Compiles and installs the debug app |
| `npm run android:release` | Builds a release app with the bundle inside it |
| `npm run ios` | Compiles and installs the iOS app (macOS) |
| `npm run web` | Starts the web preview |
| `npm test` | Runs the unit tests once |
| `npm run lint` | Runs the Expo linter |

## Project structure

```
src/app            screens and navigation
src/components     post cards and the search bar
src/queries        TanStack Query hooks and cache keys
src/api            Axios client, requests, and response types
src/store          Zustand store
src/design         color, font, spacing, and radius tokens
src/lib            list filtering and display helpers
```

## Architecture

Screens do not call HTTP. A screen uses a query hook, the hook calls `src/api`, and Axios talks to the server. `QueryClientProvider` in `src/app/_layout.tsx` wraps the stack, so the list and the detail screen share one cache.

Search, the All/Saved filter, and favorite ids live in Zustand. Changing them filters the cached posts and does not start a new request.

| When | Request | Cache key |
|---|---|---|
| The list opens | `GET /posts` | `['posts']` |
| The list opens | `GET /comments` | `['comments', 'counts']` |
| A post opens | `GET /comments?postId={id}` | `['comments', postId]` |

The list counts comments from one `/comments` response. The detail screen does not fetch a single post. `usePost` selects it from the `['posts']` cache. Pull to refresh invalidates `['posts']` and `['comments']`.

## Data structures

```ts
type Post = { userId: number; id: number; title: string; body: string };

type Comment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};
```

The feed stores counts, not the comment bodies: `Record<postId, number>`.

```ts
type LibraryState = {
  search: string;
  filter: 'all' | 'saved';
  favoriteIds: Record<number, true>;
};
```

Search matches `title` and `body`. Saved keeps only ids present in `favoriteIds`.

## Tests

```bash
npm test
```

The tests cover list filtering, the three Axios calls, the Zustand store, comment labels, and the search and Saved controls.

## Next steps

Unit tests check functions and one control in isolation. They do not launch the app or hit JSONPlaceholder.

- **End-to-end tests.** Add Maestro flows that install the development build, open the list, search, save a post, filter to Saved, and open the detail screen to confirm the comments. Run those flows on an Android emulator in CI after the unit tests pass.
- **CI.** Add a GitHub Actions workflow that runs `npm test` and `npx tsc --noEmit` on every pull request. A later job can call `eas build --platform android --profile preview`, which is already defined in `eas.json`, and publish the APK as a build artifact.
- **Saved posts that survive a restart.** Move `favoriteIds` into persisted Zustand storage so a saved post is still there after the app is closed.
- **Release path.** Use the preview APK for review, then a production EAS build when the app is ready to ship. The release profile in `eas.json` is the starting point.
