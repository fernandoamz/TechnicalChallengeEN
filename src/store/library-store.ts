import { create } from 'zustand';

// Search, the Saved filter, and favorite ids stay on the device.
// They are not sent to the API and they reset when the process ends.

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
