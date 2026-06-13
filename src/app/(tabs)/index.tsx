import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Border, Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

type Stats = {
    snippets: number;
    screenshots: number;
};

const index = () => {
    const router = useRouter();
    const db = useSQLiteContext();

    const [stats, setStats] = useState<Stats>({ snippets: 0, screenshots: 0 });

    const loadStats = useCallback(async () => {
        const row = await db.getFirstAsync<Stats>(
            `SELECT
                COUNT(*) AS snippets,
                SUM(CASE WHEN screenshot_path IS NOT NULL AND screenshot_path != '' THEN 1 ELSE 0 END) AS screenshots
             FROM snippets;`
        );

        setStats({
            snippets: row?.snippets ?? 0,
            screenshots: row?.screenshots ?? 0,
        });
    }, [db]);

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [loadStats])
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.headertitle}>CodeVault</Text>

                <View style={styles.headerIcon}>
                    <Ionicons name="notifications-outline" size={24} color={Colors.onSurface} />
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text style={styles.greetings}>Hello, Developer! 👋</Text>
                    <Text style={styles.title}>Ready to code?</Text>
                </View>

                {/* New Snippet Button */}
                <Pressable
                    style={styles.newSnippetButton}
                    onPress={() => router.push('/createSnippet')}
                >
                    <Ionicons name="add" size={22} color={Colors.onSurface} />
                    <Text style={styles.newSnippetText}>New Snippet</Text>
                </Pressable>

                {/* Stat Boxes */}
                <View style={[styles.statCard, styles.statCardSnippets]}>
                    <Ionicons
                        name="code-slash"
                        size={120}
                        color={Colors.onSurface}
                        style={styles.statDecoration}
                    />
                    <Text style={styles.statNumber}>{stats.snippets}</Text>
                    <View style={styles.statLabelRow}>
                        <Text style={styles.statLabel}>Snippets</Text>
                        <Ionicons name="arrow-forward" size={16} color={Colors.onSurface} />
                    </View>
                </View>

                <View style={[styles.statCard, styles.statCardScreenshots]}>
                    <Ionicons
                        name="image"
                        size={120}
                        color={Colors.onSurface}
                        style={styles.statDecoration}
                    />
                    <Text style={styles.statNumber}>{stats.screenshots}</Text>
                    <View style={styles.statLabelRow}>
                        <Text style={styles.statLabel}>Screenshots</Text>
                        <Ionicons name="arrow-forward" size={16} color={Colors.onSurface} />
                    </View>
                </View>

                {/* Promo Card */}
                <View style={styles.promoCard}>
                    <View style={styles.promoBadge}>
                        <Ionicons name="rocket" size={28} color={Colors.onPrimary} />
                    </View>
                    <Text style={styles.promoTitle}>Build Faster</Text>
                    <Text style={styles.promoSubtitle}>
                        Access the world's most robust snippet library for modern craftsmen.
                    </Text>
                    <Pressable
                        style={styles.promoButton}
                        onPress={() => router.push('/snippets')}
                    >
                        <Text style={styles.promoButtonText}>Explore Library</Text>
                    </Pressable>
                </View>
            </ScrollView>
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
    content: {
        padding: Spacing.innerPadding,
        gap: Spacing.stackGap,
    },
    titleSection: {
        paddingTop: Spacing.base,
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
    newSnippetButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: Spacing.base,
        paddingVertical: Spacing.innerPadding,
        backgroundColor: Colors.primaryContainer,
        borderRadius: Radius.md,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        ...Shadows.sticker,
    },
    newSnippetText: {
        ...Typography.headlineMd,
        color: Colors.onSurface,
    },
    statCard: {
        minHeight: 120,
        padding: Spacing.innerPadding + 4,
        borderRadius: Radius.lg,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        overflow: "hidden",
        justifyContent: "space-between",
        ...Shadows.sticker,
    },
    statCardSnippets: {
        backgroundColor: Colors.secondaryContainer,
    },
    statCardScreenshots: {
        backgroundColor: Colors.primaryContainer,
    },
    statDecoration: {
        position: "absolute",
        right: -10,
        bottom: -20,
        opacity: 0.18,
    },
    statNumber: {
        ...Typography.displayLg,
        color: Colors.onSurface,
    },
    statLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.base - 2,
        marginTop: Spacing.base,
    },
    statLabel: {
        ...Typography.codeBlock,
        color: Colors.onSurface,
    },
    promoCard: {
        padding: Spacing.containerPadding,
        borderRadius: Radius.lg,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        backgroundColor: Colors.tertiaryFixed,
        gap: Spacing.base,
        overflow: "hidden",
        ...Shadows.sticker,
    },
    promoBadge: {
        width: 56,
        height: 56,
        borderRadius: Radius.md,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.tertiary,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        transform: [{ rotate: "-8deg" }],
        ...Shadows.sticker,
    },
    promoTitle: {
        ...Typography.displayLg,
        fontSize: 32,
        lineHeight: 36,
        color: Colors.onTertiaryContainer,
        marginTop: Spacing.base,
    },
    promoSubtitle: {
        ...Typography.bodyMd,
        color: Colors.onTertiaryFixedVariant,
    },
    promoButton: {
        alignSelf: "flex-start",
        marginTop: Spacing.base,
        paddingHorizontal: Spacing.containerPadding,
        paddingVertical: Spacing.innerPadding,
        backgroundColor: Colors.primaryContainer,
        borderRadius: Radius.md,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        ...Shadows.sticker,
    },
    promoButtonText: {
        ...Typography.headlineMd,
        color: Colors.onSurface,
    },
})
