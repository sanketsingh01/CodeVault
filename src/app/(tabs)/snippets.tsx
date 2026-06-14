import { Border, Radius, Shadows, Spacing, Typography, type Palette } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

import { type Snippet } from '@/data/snippetsData';
import { SafeAreaView } from 'react-native-safe-area-context';

import SnippetCard from '@/components/snippetCard';

const snippets = () => {
  const db = useSQLiteContext();
  const { colors: Colors } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [data, setData] = useState<Snippet[]>([]);
  const [query, setQuery] = useState('');

  const loadSnippets = useCallback(async () => {
    const rows = await db.getAllAsync<Snippet>(
      'SELECT * FROM snippets ORDER BY created_at DESC;'
    );
    setData(rows);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadSnippets();
    }, [loadSnippets])
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.language.toLowerCase().includes(q) ||
        (s.tags ?? '').toLowerCase().includes(q)
    );
  }, [data, query]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headertitle}>Snippets</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <SnippetCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            {/* Search Bar */}
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color={Colors.onSurface} />
              <TextInput
                placeholder="Search a snippet..."
                placeholderTextColor={Colors.onSurfaceVariant}
                style={styles.searchPlaceholder}
                value={query}
                onChangeText={setQuery}
              />
            </View>

            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Recent Snippets</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="document-text-outline"
              size={48}
              color={Colors.onSurfaceVariant}
            />
            <Text style={styles.emptyText}>
              {query ? 'No snippets match your search.' : 'No snippets yet.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default snippets;

const makeStyles = (Colors: Palette) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.innerPadding,
    borderBottomWidth: Border.default,
    borderBottomColor: Colors.outlineBlack,
  },
  headertitle: {
    ...Typography.headlineMd,
    color: Colors.primary,
  },
  listContent: {
    padding: Spacing.innerPadding,
    gap: Spacing.stackGap,
    paddingBottom: Spacing.containerPadding * 2,
  },
  listHeader: {
    gap: Spacing.stackGap,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    padding: Spacing.base - 3,
    backgroundColor: Colors.tertiaryFixedDim,
    borderRadius: Radius.md,
    borderWidth: Border.default,
    borderColor: Colors.outlineBlack,
    ...Shadows.sticker,
  },
  searchPlaceholder: {
    ...Typography.bodyMd,
    flex: 1,
    color: Colors.onSurface,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.base,
    paddingVertical: Spacing.containerPadding * 2,
  },
  emptyText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
  },
});
