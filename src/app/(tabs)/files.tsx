import { Ionicons } from '@expo/vector-icons';
import { File, Paths } from 'expo-file-system';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Border, Radius, Shadows, Spacing, Typography, type Palette } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

type IconName = keyof typeof Ionicons.glyphMap;

const DB_NAME = 'codevault.db';

type Counts = {
    snippets: number;
    attachments: number;
};

type Screenshot = {
    id: number;
    title: string;
    screenshot_path: string;
};

const formatBytes = (bytes: number) => {
    if (bytes <= 0) return '0 KB';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
};

const getDatabaseSize = () => {
    const fileNames = [DB_NAME, `${DB_NAME}-wal`, `${DB_NAME}-shm`];
    let total = 0;
    for (const name of fileNames) {
        const file = new File(Paths.document, 'SQLite', name);
        if (file.exists) total += file.size ?? 0;
    }
    return total;
};

type Directory = {
    key: string;
    title: string;
    icon: IconName;
    count: number;
    unit: string;
    bg: string;
};

const Files = () => {
    const db = useSQLiteContext();
    const router = useRouter();
    const { colors: Colors } = useTheme();
    const styles = useMemo(() => makeStyles(Colors), [Colors]);

    const [counts, setCounts] = useState<Counts>({ snippets: 0, attachments: 0 });
    const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
    const [dbSize, setDbSize] = useState(0);

    const loadFiles = useCallback(async () => {
        const counted = await db.getFirstAsync<Counts>(
            `SELECT
                (SELECT COUNT(*) FROM snippets) AS snippets,
                (SELECT COUNT(*) FROM files) AS attachments;`
        );

        const shots = await db.getAllAsync<Screenshot>(
            `SELECT id, title, screenshot_path
               FROM snippets
              WHERE screenshot_path IS NOT NULL AND screenshot_path != ''
              ORDER BY created_at DESC;`
        );

        setCounts({
            snippets: counted?.snippets ?? 0,
            attachments: counted?.attachments ?? 0,
        });
        setScreenshots(shots);
        setDbSize(getDatabaseSize());
    }, [db]);

    useFocusEffect(
        useCallback(() => {
            loadFiles();
        }, [loadFiles])
    );

    const directories: Directory[] = [
        {
            key: 'snippets',
            title: 'Snippets',
            icon: 'code-slash',
            count: counts.snippets,
            unit: counts.snippets === 1 ? 'Item' : 'Items',
            bg: Colors.primaryContainer,
        },
        {
            key: 'attachments',
            title: 'Attachments',
            icon: 'document-attach',
            count: counts.attachments,
            unit: counts.attachments === 1 ? 'File' : 'Files',
            bg: Colors.secondaryContainer,
        },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Files</Text>
                <View style={styles.headerIcon}>
                    <Ionicons name="folder-open" size={22} color={Colors.onSurface} />
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Directories */}
                <View style={styles.sectionRow}>
                    <View style={styles.sectionTitleRow}>
                        <Ionicons name="folder" size={20} color={Colors.onSurface} />
                        <Text style={styles.sectionTitle}>Directories</Text>
                    </View>
                </View>

                <View style={styles.dirGrid}>
                    {directories.map((dir) => (
                        <View key={dir.key} style={[styles.dirCard, { backgroundColor: dir.bg }]}>
                            <View style={styles.dirIconTile}>
                                <Ionicons name={dir.icon} size={22} color={Colors.onSurface} />
                            </View>
                            <Text style={styles.dirTitle}>{dir.title}</Text>
                            <Text style={styles.dirMeta}>
                                {dir.count} {dir.unit}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Database backup — wide card, like the "System Backups" tile */}
                <Pressable
                    style={({ pressed }) => [
                        styles.backupCard,
                        pressed && styles.pressed,
                    ]}
                    onPress={() => router.push('/settings')}
                >
                    <View style={styles.backupIconTile}>
                        <Ionicons name="cloud-done" size={24} color={Colors.onSurface} />
                    </View>
                    <View style={styles.backupTextCol}>
                        <Text style={styles.dirTitle}>Database Backup</Text>
                        <Text style={styles.dirMeta}>Local vault · {formatBytes(dbSize)}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.onSurface} />
                </Pressable>

                {/* Screenshots */}
                <View style={styles.sectionRow}>
                    <View style={styles.sectionTitleRow}>
                        <Ionicons name="image" size={20} color={Colors.onSurface} />
                        <Text style={styles.sectionTitle}>Screenshots</Text>
                    </View>
                    <Text style={styles.sectionCount}>{screenshots.length}</Text>
                </View>

                {screenshots.length === 0 ? (
                    <View style={styles.empty}>
                        <Ionicons name="images-outline" size={48} color={Colors.onSurfaceVariant} />
                        <Text style={styles.emptyText}>No screenshots attached yet.</Text>
                    </View>
                ) : (
                    <View style={styles.shotGrid}>
                        {screenshots.map((shot) => (
                            <Pressable
                                key={shot.id}
                                style={({ pressed }) => [
                                    styles.shotCard,
                                    pressed && styles.pressed,
                                ]}
                                onPress={() =>
                                    router.push({
                                        pathname: '/snippet/[id]',
                                        params: { id: String(shot.id) },
                                    })
                                }
                            >
                                <Image
                                    source={{ uri: shot.screenshot_path }}
                                    style={styles.shotImage}
                                    contentFit="cover"
                                />
                                <Text style={styles.shotTitle} numberOfLines={1}>
                                    {shot.title}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Files;

const makeStyles = (Colors: Palette) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.innerPadding,
        borderBottomWidth: Border.default,
        borderBottomColor: Colors.outlineBlack,
    },
    headerTitle: {
        ...Typography.headlineMd,
        color: Colors.primary,
    },
    headerIcon: {
        padding: Spacing.base - 3,
        borderRadius: Radius.md,
        backgroundColor: Colors.surfaceContainerHighest,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        ...Shadows.sticker,
    },
    content: {
        padding: Spacing.innerPadding,
        gap: Spacing.stackGap,
        paddingBottom: Spacing.containerPadding * 2,
    },
    sectionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.base,
    },
    sectionTitle: {
        ...Typography.headlineMd,
        color: Colors.onSurface,
    },
    sectionCount: {
        ...Typography.labelSm,
        textTransform: 'none',
        color: Colors.onSurfaceVariant,
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.base - 5,
        borderRadius: Radius.full,
        borderWidth: Border.thin,
        borderColor: Colors.outlineBlack,
        backgroundColor: Colors.surfaceContainerHighest,
        overflow: 'hidden',
    },
    dirGrid: {
        flexDirection: 'row',
        gap: Spacing.stackGap,
    },
    dirCard: {
        flex: 1,
        gap: Spacing.base - 2,
        padding: Spacing.innerPadding + 4,
        borderRadius: Radius.lg,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        ...Shadows.sticker,
    },
    dirIconTile: {
        width: 44,
        height: 44,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.surfaceContainerLowest,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        marginBottom: Spacing.base - 4,
    },
    dirTitle: {
        ...Typography.headlineMd,
        fontSize: 18,
        lineHeight: 22,
        color: Colors.onSurface,
    },
    dirMeta: {
        ...Typography.bodyMd,
        fontSize: 13,
        color: Colors.onSurface,
        opacity: 0.7,
    },
    backupCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.innerPadding,
        padding: Spacing.innerPadding + 4,
        borderRadius: Radius.lg,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        backgroundColor: Colors.tertiaryContainer,
        ...Shadows.sticker,
    },
    backupIconTile: {
        width: 48,
        height: 48,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.surfaceContainerLowest,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
    },
    backupTextCol: {
        flex: 1,
        gap: 2,
    },
    pressed: {
        transform: [{ translateX: 2 }, { translateY: 2 }],
        ...Shadows.pressed,
    },
    shotGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.stackGap,
    },
    shotCard: {
        flexBasis: '47%',
        flexGrow: 1,
        gap: Spacing.base - 2,
        padding: Spacing.base - 2,
        borderRadius: Radius.lg,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        backgroundColor: Colors.surfaceContainerLowest,
        ...Shadows.sticker,
    },
    shotImage: {
        width: '100%',
        height: 110,
        borderRadius: Radius.md,
        borderWidth: Border.thin,
        borderColor: Colors.outlineBlack,
        backgroundColor: Colors.surfaceContainerHighest,
    },
    shotTitle: {
        ...Typography.labelSm,
        textTransform: 'none',
        color: Colors.onSurface,
        paddingHorizontal: Spacing.base - 4,
    },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.base,
        paddingVertical: Spacing.containerPadding * 2,
        borderRadius: Radius.lg,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        backgroundColor: Colors.surfaceContainerLow,
    },
    emptyText: {
        ...Typography.bodyMd,
        color: Colors.onSurfaceVariant,
    },
});
