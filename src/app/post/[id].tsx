import { router, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePalette } from '@/design/use-palette';
import { fontFamily, radius, space } from '@/design/tokens';
import { commentLabel, errorMessage } from '@/lib/format';
import { usePost, usePostComments } from '@/queries/posts';
import { useLibraryStore } from '@/store/library-store';

export default function PostDetailScreen() {
  const colors = usePalette();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const postId = Number(rawId);
  const postQuery = usePost(postId);
  const commentsQuery = usePostComments(postId);
  const isFavorite = useLibraryStore((state) => Boolean(state.favoriteIds[postId]));
  const toggleFavorite = useLibraryStore((state) => state.toggleFavorite);
  const post = postQuery.data;

  function goBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.canvas }]}>
      <View style={[styles.toolbar, { paddingTop: insets.top + space.sm }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back" hitSlop={8} onPress={goBack}>
          <Text style={[styles.back, { color: colors.ink, fontFamily: fontFamily.bodySemibold }]}>
            ← Back
          </Text>
        </Pressable>
        {Number.isInteger(postId) && postId > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? 'Remove from saved' : 'Save post'}
            hitSlop={8}
            onPress={() => toggleFavorite(postId)}>
            <Text style={[styles.heart, { color: isFavorite ? colors.accent : colors.inkMuted }]}>
              {isFavorite ? '♥' : '♡'}
            </Text>
          </Pressable>
        ) : (
          <View />
        )}
      </View>

      {postQuery.isLoading ? (
        <ActivityIndicator color={colors.accent} size="large" style={styles.loader} />
      ) : postQuery.isError ? (
        <View style={styles.message}>
          <Text style={[styles.messageTitle, { color: colors.ink, fontFamily: fontFamily.display }]}>
            Couldn’t open this post
          </Text>
          <Text style={[styles.messageBody, { color: colors.inkMuted, fontFamily: fontFamily.body }]}>
            {errorMessage(postQuery.error)}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => postQuery.refetch()}
            style={[styles.retry, { backgroundColor: colors.accent }]}>
            <Text style={[styles.retryLabel, { color: colors.onAccent, fontFamily: fontFamily.bodySemibold }]}>
              Try again
            </Text>
          </Pressable>
        </View>
      ) : !post ? (
        <View style={styles.message}>
          <Text style={[styles.messageTitle, { color: colors.ink, fontFamily: fontFamily.display }]}>
            Post not found
          </Text>
          <Text style={[styles.messageBody, { color: colors.inkMuted, fontFamily: fontFamily.body }]}>
            This note isn’t in the collection.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + space.xxxl }}
          contentInsetAdjustmentBehavior="automatic">
          <View style={styles.article}>
            <Text style={[styles.kicker, { color: colors.olive, fontFamily: fontFamily.bodySemibold }]}>
              POST {post.id} · USER {post.userId}
            </Text>
            <Text style={[styles.title, { color: colors.ink, fontFamily: fontFamily.displayBold }]}>
              {post.title}
            </Text>
            <Text style={[styles.body, { color: colors.ink, fontFamily: fontFamily.body }]}>{post.body}</Text>
          </View>

          <View style={styles.comments}>
            <Text style={[styles.section, { color: colors.ink, fontFamily: fontFamily.display }]}>
              Comments
            </Text>
            {commentsQuery.isPending ? (
              <ActivityIndicator color={colors.accent} style={styles.commentsLoader} />
            ) : commentsQuery.isError ? (
              <View style={styles.commentMessage}>
                <Text style={[styles.messageBody, { color: colors.inkMuted, fontFamily: fontFamily.body }]}>
                  {errorMessage(commentsQuery.error)}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => commentsQuery.refetch()}
                  style={[styles.retry, { backgroundColor: colors.accent }]}>
                  <Text
                    style={[styles.retryLabel, { color: colors.onAccent, fontFamily: fontFamily.bodySemibold }]}>
                    Try again
                  </Text>
                </Pressable>
              </View>
            ) : commentsQuery.data.length === 0 ? (
              <Text style={[styles.messageBody, { color: colors.inkMuted, fontFamily: fontFamily.body }]}>
                No comments on this post.
              </Text>
            ) : (
              <View style={styles.commentList}>
                <Text style={[styles.count, { color: colors.accent, fontFamily: fontFamily.bodyMedium }]}>
                  {commentLabel(commentsQuery.data.length)}
                </Text>
                {commentsQuery.data.map((comment) => (
                  <View
                    key={comment.id}
                    style={[styles.comment, { backgroundColor: colors.surface, borderColor: colors.line }]}>
                    <Text style={[styles.commentName, { color: colors.ink, fontFamily: fontFamily.bodySemibold }]}>
                      {comment.name}
                    </Text>
                    <Text style={[styles.email, { color: colors.olive, fontFamily: fontFamily.bodyMedium }]}>
                      {comment.email}
                    </Text>
                    <Text style={[styles.commentBody, { color: colors.inkMuted, fontFamily: fontFamily.body }]}>
                      {comment.body}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  toolbar: {
    paddingHorizontal: space.xl,
    paddingBottom: space.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    fontSize: 16,
  },
  heart: {
    fontSize: 24,
    lineHeight: 28,
  },
  loader: {
    marginTop: space.xxxl,
  },
  article: {
    paddingHorizontal: space.xl,
    paddingTop: space.md,
    gap: space.md,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.4,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
  },
  body: {
    fontSize: 17,
    lineHeight: 28,
    marginTop: space.sm,
  },
  comments: {
    paddingHorizontal: space.xl,
    paddingTop: space.xxxl,
    gap: space.md,
  },
  section: {
    fontSize: 28,
    lineHeight: 34,
  },
  count: {
    fontSize: 14,
  },
  commentList: {
    gap: space.md,
  },
  comment: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space.lg,
    gap: space.sm,
  },
  commentName: {
    fontSize: 16,
    lineHeight: 22,
  },
  email: {
    fontSize: 13,
  },
  commentBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  commentsLoader: {
    alignSelf: 'flex-start',
  },
  commentMessage: {
    gap: space.sm,
    alignItems: 'flex-start',
  },
  message: {
    paddingHorizontal: space.xl,
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
    borderRadius: radius.pill,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  retryLabel: {
    fontSize: 15,
  },
});
