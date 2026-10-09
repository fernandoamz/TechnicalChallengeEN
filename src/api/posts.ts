import { api } from '@/api/client';
import type { Comment, Post } from '@/api/types';

export async function fetchPosts() {
  const { data } = await api.get<Post[]>('/posts');
  return data;
}

// One /comments response feeds every card. The detail screen uses fetchComments(postId) instead.
export async function fetchCommentCounts() {
  const { data } = await api.get<Comment[]>('/comments');
  const counts: Record<number, number> = {};

  for (const comment of data) {
    counts[comment.postId] = (counts[comment.postId] ?? 0) + 1;
  }

  return counts;
}

export async function fetchComments(postId: number) {
  const { data } = await api.get<Comment[]>('/comments', {
    params: { postId },
  });
  return data;
}
