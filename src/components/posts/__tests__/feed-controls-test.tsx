import { fireEvent, render } from '@testing-library/react-native';

import { FeedControls } from '@/components/posts/feed-controls';
import { useLibraryStore } from '@/store/library-store';

beforeEach(() => {
  useLibraryStore.setState({ search: '', filter: 'all', favoriteIds: {} });
});

describe('FeedControls', () => {
  test('shows how many posts are saved and switches the filter', async () => {
    useLibraryStore.setState({ favoriteIds: { 1: true, 2: true } });

    const { getByRole } = await render(<FeedControls />);

    fireEvent.press(getByRole('button', { name: 'Saved 2' }));

    expect(useLibraryStore.getState().filter).toBe('saved');
  });

  test('writes the search text into the store', async () => {
    const { getByLabelText } = await render(<FeedControls />);

    fireEvent.changeText(getByLabelText('Search posts'), 'lunch');

    expect(useLibraryStore.getState().search).toBe('lunch');
  });
});
