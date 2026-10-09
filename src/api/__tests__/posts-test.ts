import { api } from '@/api/client';
import { fetchCommentCounts, fetchComments, fetchPosts } from '@/api/posts';

jest.mock('@/api/client', () => ({
  api: { get: jest.fn() },
}));

const get = jest.mocked(api.get);

beforeEach(() => {
  get.mockReset();
});

describe('post requests', () => {
  test('loads the post list from /posts', async () => {
    const posts = [{ userId: 1, id: 1, title: 'Hello', body: 'Note' }];
    get.mockResolvedValue({ data: posts });

    await expect(fetchPosts()).resolves.toEqual(posts);
    expect(get).toHaveBeenCalledWith('/posts');
  });

  test('counts comments from one /comments response', async () => {
    get.mockResolvedValue({
      data: [
        { postId: 1, id: 10, name: 'A', email: 'a@example.com', body: 'First' },
        { postId: 1, id: 11, name: 'B', email: 'b@example.com', body: 'Second' },
        { postId: 2, id: 12, name: 'C', email: 'c@example.com', body: 'Only' },
      ],
    });

    await expect(fetchCommentCounts()).resolves.toEqual({ 1: 2, 2: 1 });
    expect(get).toHaveBeenCalledWith('/comments');
  });

  test('loads comments for a single post', async () => {
    const comments = [{ postId: 4, id: 20, name: 'D', email: 'd@example.com', body: 'Hi' }];
    get.mockResolvedValue({ data: comments });

    await expect(fetchComments(4)).resolves.toEqual(comments);
    expect(get).toHaveBeenCalledWith('/comments', { params: { postId: 4 } });
  });
});
