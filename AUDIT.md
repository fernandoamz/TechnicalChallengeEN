# Requirements audit

Checked against the Posts App brief. Update this file when a requirement changes.

`[x]` means the current code meets the item. `[ ]` means it does not, or only part of it is done.

## Product behavior

- [x] List posts from `https://jsonplaceholder.typicode.com/posts`. `fetchPosts` in `src/api/posts.ts`.
- [x] Each row shows `title`. `PostCard` in `src/components/posts/post-card.tsx`.
- [x] Each row shows `body`. Same card, two lines.
- [x] Each row shows the comment count. The list loads `GET /comments` once and groups by `postId` in `fetchCommentCounts`.
- [x] Tapping a post opens a detail screen. `src/app/post/[id].tsx`.
- [x] The detail screen shows the selected post’s title, body, user, and id.
- [x] The detail screen lists that post’s comments. `GET /comments?postId={id}` in `fetchComments`.
- [x] A search bar filters posts by title or body as the text changes. `filterPosts` in `src/lib/filter-posts.ts`.
- [x] A post can be marked favorite. Heart control on the card and on the detail screen.
- [x] Favorites can be filtered. The Saved chip keeps only ids in the Zustand store.
- [x] The theme uses a design-token file for colors and font families. `src/design/tokens.ts` (`palette`, `fontFamily`). Light and dark palettes cover background, text, accent, and a second accent.
- [ ] Font sizes for headings and body text are not tokens. They are set in each screen’s `StyleSheet`. Families are tokens; sizes are not.

## Minimum criteria

- [x] Expo managed app. Routing and config live in `src/app` and `app.json`. `ios/` and `android/` are generated and gitignored, not a React Native CLI project.
- [x] The app can launch without Expo Go. `expo-dev-client` is installed, `npm start` uses `--dev-client`, and `eas.json` has development and preview profiles. `npm run android` installs that binary.
- [x] REST only. No GraphQL client or query language in `src`.
- [x] Axios performs the HTTP calls. `src/api/client.ts`.
- [x] TanStack Query owns server state, including loading and error UI on the list and the detail screen. `src/queries/posts.ts`.
- [x] Zustand owns client state: search, All/Saved, and favorite ids. `src/store/library-store.ts`.

## Evaluation

- [x] Readable, separated architecture. Screens, query hooks, the Axios layer, and the Zustand store are separate folders. `README.md` describes that split.
- [x] Non-obvious behavior is commented: shared posts cache, the single comments request used for counts, and the fact that search does not hit the network.
- [x] The solution stays small. One shared posts cache, one count map for the list, and local filtering instead of extra endpoints.
- [ ] The README does not explain how agent-assisted coding was used in the architecture.
- [ ] The README does not describe the author’s usual development process.

## Delivery

- [x] `README.md` describes the architecture, folder layout, state strategy, and how to build and run on Android and iOS.
- [x] Trade-offs are stated. Saved posts reset when the process ends, and unit tests do not launch the app.
- [x] The source remote is `https://github.com/fernandoamz/TechnicalChallengeEN`. This check did not confirm that the repository is public. `README.md` also links a demo video.
- [x] This audit file is in the repository. Update it in the same change as any requirement work.

## Not required, and not done

These are documented as next steps, not as gaps in the brief:

- End-to-end tests
- Favorites that survive a restart

Android CI is in `.github/workflows/android-release.yml`. It still needs the `EXPO_TOKEN` repository secret before a build can finish.
