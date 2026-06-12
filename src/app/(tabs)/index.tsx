import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Border, Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const index = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.headertitle}>CodeVault</Text>

                <View style={styles.headerIcon}>
                    <Ionicons name="notifications-outline" size={24} color={Colors.onSurface} />
                </View>
            </View>

            {/* Title Section */}
            <View style={styles.titleSection}>
                <Text style={styles.greetings}>Hello, Developer! 👋</Text>
                <Text style={styles.title}>Ready to code?</Text>
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

export default index

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
    headerIcon: {
        padding: Spacing.base - 3,
        borderRadius: Radius.md,
        backgroundColor: Colors.surfaceContainerHighest,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        ...Shadows.sticker,
    },
    titleSection: {
        padding: Spacing.innerPadding,
        paddingTop: Spacing.containerPadding,
        gap: Spacing.base - 4,
    },
    greetings: {
        ...Typography.bodyMd,
        color: Colors.onSurfaceVariant,
    },
    title: {
        ...Typography.displayLg,
        color: Colors.onSurface,
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