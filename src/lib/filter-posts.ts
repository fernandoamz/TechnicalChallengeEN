import type { Post } from '@/api/types';

// Applied to the cached posts. Changing search or Saved does not start a new request.
export function filterPosts(
  posts: Post[],
  search: string,
  filter: 'all' | 'saved',
  favoriteIds: Record<number, true>,
) {
  const query = search.trim().toLowerCase();

  return posts.filter((post) => {
    if (filter === 'saved' && !favoriteIds[post.id]) {
      return false;
    }
    if (!query) {
      return true;
    }
    return post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query);
  });
}
