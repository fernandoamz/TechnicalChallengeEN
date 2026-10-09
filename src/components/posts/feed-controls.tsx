import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { usePalette } from '@/design/use-palette';
import { fontFamily, radius, space } from '@/design/tokens';
import { useLibraryStore, type FeedFilter } from '@/store/library-store';

const filters: { id: FeedFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'saved', label: 'Saved' },
];

export function FeedControls() {
  const colors = usePalette();
  const search = useLibraryStore((state) => state.search);
  const filter = useLibraryStore((state) => state.filter);
  const setSearch = useLibraryStore((state) => state.setSearch);
  const setFilter = useLibraryStore((state) => state.setFilter);
  const savedCount = useLibraryStore(
    (state) => Object.keys(state.favoriteIds).length,
  );

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.search,
          { backgroundColor: colors.surface, borderColor: colors.line },
        ]}
      >
        <Text style={[styles.searchMark, { color: colors.inkMuted }]}>⌕</Text>
        <TextInput
          accessibilityLabel="Search posts"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setSearch}
          placeholder="Search titles and notes"
          placeholderTextColor={colors.inkMuted}
          returnKeyType="search"
          style={[
            styles.input,
            { color: colors.ink, fontFamily: fontFamily.body },
          ]}
          value={search}
        />
        {search.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={8}
            onPress={() => setSearch('')}
          >
            <Text
              style={[
                styles.clear,
                { color: colors.inkMuted, fontFamily: fontFamily.bodyMedium },
              ]}
            >
              Clear
            </Text>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.filters}>
        {filters.map((item) => {
          const selected = filter === item.id;
          const label =
            item.id === 'saved' ? `Saved ${savedCount}` : item.label;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={item.id}
              onPress={() => setFilter(item.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: selected ? colors.ink : colors.surface,
                  borderColor: selected ? colors.ink : colors.line,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipLabel,
                  {
                    color: selected ? colors.canvas : colors.ink,
                    fontFamily: fontFamily.bodySemibold,
                  },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: space.md,
    paddingBottom: space.lg,
  },
  search: {
    minHeight: 48,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.lg,
    gap: space.sm,
  },
  searchMark: {
    fontSize: 20,
    lineHeight: 22,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: space.md,
  },
  clear: {
    fontSize: 14,
  },
  filters: {
    flexDirection: 'row',
    gap: space.sm,
  },
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
  },
  chipLabel: {
    fontSize: 14,
  },
});
