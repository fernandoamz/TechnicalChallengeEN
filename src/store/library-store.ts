import { create } from 'zustand';

// Search is used to filter the feed.
// The Saved filter is used to filter the feed to only show saved posts.
// Favorite ids are used to store the ids of the posts that are favorited.

export type FeedFilter = 'all' | 'saved';

type LibraryState = {
  search: string;
  filter: FeedFilter;
  favoriteIds: Record<number, true>;
  setSearch: (search: string) => void;
  setFilter: (filter: FeedFilter) => void;
  toggleFavorite: (postId: number) => void;
};

export const useLibraryStore = create<LibraryState>((set) => ({
  search: '',
  filter: 'all',
  favoriteIds: {},
  setSearch: (search) => set({ search }),
  setFilter: (filter) => set({ filter }),
  toggleFavorite: (postId) =>
    set((state) => {
      const favoriteIds = { ...state.favoriteIds };
      if (favoriteIds[postId]) {
        delete favoriteIds[postId];
      } else {
        favoriteIds[postId] = true;
      }
      return { favoriteIds };
    }),
}));
