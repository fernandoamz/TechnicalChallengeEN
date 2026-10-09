import { useLibraryStore } from '@/store/library-store';

beforeEach(() => {
  useLibraryStore.setState({ search: '', filter: 'all', favoriteIds: {} });
});

describe('library store', () => {
  test('stores the search text and the Saved filter', () => {
    useLibraryStore.getState().setSearch('morning');
    useLibraryStore.getState().setFilter('saved');

    expect(useLibraryStore.getState()).toMatchObject({
      search: 'morning',
      filter: 'saved',
    });
  });

  test('toggles a post in and out of favorites', () => {
    useLibraryStore.getState().toggleFavorite(7);
    expect(useLibraryStore.getState().favoriteIds[7]).toBe(true);

    useLibraryStore.getState().toggleFavorite(7);
    expect(useLibraryStore.getState().favoriteIds[7]).toBeUndefined();
  });
});
