import type { Post } from '@/api/types';
import { filterPosts } from '@/lib/filter-posts';

const posts: Post[] = [
  { userId: 1, id: 1, title: 'Morning notes', body: 'A walk before work' },
  { userId: 1, id: 2, title: 'Lunch plan', body: 'Soup and bread' },
  {
    userId: 2,
    id: 3,
    title: 'Evening notes',
    body: 'Read the morning pages again',
  },
];

describe('filterPosts', () => {
  test('returns every post when search is blank and the filter is All', () => {
    expect(filterPosts(posts, '   ', 'all', {})).toEqual(posts);
  });

  test('matches title or body without caring about case', () => {
    expect(
      filterPosts(posts, 'MORNING', 'all', {}).map((post) => post.id),
    ).toEqual([1, 3]);
  });

  test('keeps only saved posts, then applies the search', () => {
    const favoriteIds = { 1: true as const, 3: true as const };

    expect(
      filterPosts(posts, '', 'saved', favoriteIds).map((post) => post.id),
    ).toEqual([1, 3]);
    expect(
      filterPosts(posts, 'evening', 'saved', favoriteIds).map(
        (post) => post.id,
      ),
    ).toEqual([3]);
  });
});
