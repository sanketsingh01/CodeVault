import { Border, Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

const snippets = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headertitle}>Snippets</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color={Colors.onSurface} />
        <TextInput
          placeholder='Search a snippet...'
          style={styles.searchPlaceholder}
        />
      </View>
    </SafeAreaView>
  )
}

export default snippets

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.innerPadding,
    borderBottomWidth: Border.default,
    borderBottomColor: Colors.outlineBlack,
  },
  headertitle: {
    ...Typography.headlineMd,
    color: Colors.primary,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.base,
    margin: Spacing.innerPadding,
    padding: Spacing.base - 3,
    backgroundColor: Colors.tertiaryFixedDim,
    borderRadius: Radius.md,
    borderWidth: Border.default,
    borderColor: Colors.outlineBlack,
    ...Shadows.sticker,
  },
  searchPlaceholder: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
  },
})