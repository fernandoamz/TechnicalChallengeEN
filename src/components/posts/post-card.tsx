import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Post } from '@/api/types';
import { fontFamily, radius, space } from '@/design/tokens';
import { usePalette } from '@/design/use-palette';
import { commentLabel } from '@/lib/format';
import { useLibraryStore } from '@/store/library-store';

type PostCardProps = {
  post: Post;
  commentCount: number;
};

export function PostCard({ post, commentCount }: PostCardProps) {
  const colors = usePalette();
  const isFavorite = useLibraryStore((state) =>
    Boolean(state.favoriteIds[post.id]),
  );
  const toggleFavorite = useLibraryStore((state) => state.toggleFavorite);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.line,
        },
      ]}
    >
      {isFavorite ? (
        <View style={[styles.mark, { backgroundColor: colors.accent }]} />
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${post.title}. ${commentLabel(commentCount)}. ${isFavorite ? 'Saved' : 'Not saved'}`}
        android_ripple={{ color: colors.accentSoft }}
        onPress={() =>
          router.push({
            pathname: '/post/[id]',
            params: { id: String(post.id) },
          })
        }
        style={styles.copy}
      >
        <Text
          style={[
            styles.index,
            { color: colors.olive, fontFamily: fontFamily.bodySemibold },
          ]}
        >
          {String(post.id).padStart(2, '0')}
        </Text>
        <Text
          numberOfLines={2}
          style={[
            styles.title,
            { color: colors.ink, fontFamily: fontFamily.display },
          ]}
        >
          {post.title}
        </Text>
        <Text
          numberOfLines={2}
          style={[
            styles.body,
            { color: colors.inkMuted, fontFamily: fontFamily.body },
          ]}
        >
          {post.body}
        </Text>
        <Text
          style={[
            styles.meta,
            { color: colors.accent, fontFamily: fontFamily.bodyMedium },
          ]}
        >
          {commentLabel(commentCount)}
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isFavorite ? 'Remove saved' : 'Save post'}
        hitSlop={8}
        onPress={() => toggleFavorite(post.id)}
        style={styles.heartButton}
      >
        <Text
          style={[
            styles.heart,
            { color: isFavorite ? colors.accent : colors.inkMuted },
          ]}
        >
          {isFavorite ? '♥' : '♡'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    position: 'relative',
  },
  mark: {
    width: 4,
  },
  copy: {
    flex: 1,
    paddingLeft: space.lg,
    paddingRight: space.xxxl + space.lg,
    paddingTop: space.md,
    paddingBottom: space.lg,
    gap: space.sm,
  },
  index: {
    fontSize: 13,
    letterSpacing: 1.2,
  },
  heartButton: {
    position: 'absolute',
    top: space.sm,
    right: space.sm,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: {
    fontSize: 22,
    lineHeight: 26,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  meta: {
    fontSize: 13,
    marginTop: space.xs,
  },
});
