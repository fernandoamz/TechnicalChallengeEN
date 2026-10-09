import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FeedControls } from '@/components/posts/feed-controls';
import { PostCard } from '@/components/posts/post-card';
import { usePalette } from '@/design/use-palette';
import { fontFamily, space } from '@/design/tokens';
import { filterPosts } from '@/lib/filter-posts';
import { errorMessage } from '@/lib/format';
import { useCommentCounts, usePosts } from '@/queries/posts';
import { useLibraryStore } from '@/store/library-store';

export default function PostsScreen() {
  const colors = usePalette();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const postsQuery = usePosts();
  const countsQuery = useCommentCounts();
  const search = useLibraryStore((state) => state.search);
  const filter = useLibraryStore((state) => state.filter);
  const favoriteIds = useLibraryStore((state) => state.favoriteIds);

  const posts = useMemo(
    () => filterPosts(postsQuery.data ?? [], search, filter, favoriteIds),
    [postsQuery.data, search, filter, favoriteIds],
  );

  const isLoading = postsQuery.isPending || countsQuery.isPending;
  const error = postsQuery.error ?? countsQuery.error;
  const isRefreshing =
    (postsQuery.isRefetching || countsQuery.isRefetching) && !isLoading;

  async function refresh() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['posts'] }),
      queryClient.invalidateQueries({ queryKey: ['comments'] }),
    ]);
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.canvas, paddingTop: insets.top }]}>
      <FlatList
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + space.xxl },
          posts.length === 0 && styles.emptyContent,
        ]}
        data={isLoading || error ? [] : posts}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator color={colors.accent} size="large" style={styles.loader} />
          ) : error ? (
            <View style={styles.message}>
              <Text style={[styles.messageTitle, { color: colors.ink, fontFamily: fontFamily.display }]}>
                Couldn’t load posts
              </Text>
              <Text style={[styles.messageBody, { color: colors.inkMuted, fontFamily: fontFamily.body }]}>
                {errorMessage(error)}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  postsQuery.refetch();
                  countsQuery.refetch();
                }}
                style={[styles.retry, { backgroundColor: colors.accent }]}>
                <Text style={[styles.retryLabel, { color: colors.onAccent, fontFamily: fontFamily.bodySemibold }]}>
                  Try again
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.message}>
              <Text style={[styles.messageTitle, { color: colors.ink, fontFamily: fontFamily.display }]}>
                {filter === 'saved' ? 'Nothing saved yet' : 'No matching posts'}
              </Text>
              <Text style={[styles.messageBody, { color: colors.inkMuted, fontFamily: fontFamily.body }]}>
                {filter === 'saved'
                  ? 'Tap the heart on a post to keep it in this list.'
                  : 'Try a different word from a title or note.'}
              </Text>
            </View>
          )
        }
        ListHeaderComponent={
          <View>
            <Text style={[styles.kicker, { color: colors.olive, fontFamily: fontFamily.bodySemibold }]}>
              READING ROOM
            </Text>
            <Text style={[styles.title, { color: colors.ink, fontFamily: fontFamily.displayBold }]}>
              Field Notes
            </Text>
            <View style={[styles.rule, { backgroundColor: colors.accent }]} />
            <FeedControls />
          </View>
        }
        refreshControl={
          <RefreshControl
            colors={[colors.accent]}
            onRefresh={refresh}
            refreshing={isRefreshing}
            tintColor={colors.accent}
          />
        }
        renderItem={({ item }) => (
          <PostCard commentCount={countsQuery.data?.[item.id] ?? 0} post={item} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
  },
  emptyContent: {
    flexGrow: 1,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.6,
  },
  title: {
    fontSize: 40,
    lineHeight: 46,
    marginTop: space.xs,
  },
  rule: {
    width: 48,
    height: 3,
    borderRadius: 2,
    marginTop: space.md,
    marginBottom: space.xl,
  },
  separator: {
    height: space.md,
  },
  loader: {
    marginTop: space.xxxl,
  },
  message: {
    paddingTop: space.xxl,
    gap: space.sm,
    alignItems: 'flex-start',
  },
  messageTitle: {
    fontSize: 28,
    lineHeight: 34,
  },
  messageBody: {
    fontSize: 16,
    lineHeight: 24,
  },
  retry: {
    marginTop: space.sm,
    borderRadius: 999,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  retryLabel: {
    fontSize: 15,
  },
});
