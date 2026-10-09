import { useQuery } from '@tanstack/react-query';

import { fetchCommentCounts, fetchComments, fetchPosts } from '@/api/posts';

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });
}

// Same cache key as usePosts, so opening a post does not send a second GET /posts.
export function usePost(postId: number) {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    enabled: Number.isInteger(postId) && postId > 0,
    select: (posts) => posts.find((post) => post.id === postId) ?? null,
  });
}

export function useCommentCounts() {
  return useQuery({
    queryKey: ['comments', 'counts'],
    queryFn: fetchCommentCounts,
  });
}

// Separate from the feed's count query so this screen can load and retry on its own.
export function usePostComments(postId: number) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
    enabled: Number.isInteger(postId) && postId > 0,
  });
}
