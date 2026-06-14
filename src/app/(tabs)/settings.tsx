import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { File, Paths } from "expo-file-system";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Border, Colors, Radius, Shadows, Spacing, Typography } from "@/constants/theme";

const DB_NAME = "codevault.db";
// Soft budget used only to render the storage bar proportionally.
const STORAGE_BUDGET_BYTES = 100 * 1024 * 1024;

type ThemeMode = "light" | "dark";
type DbTask = "vacuum" | "analyze" | null;

const formatBytes = (bytes: number) => {
    if (bytes <= 0) return "0 KB";
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
};

const getDatabaseSize = () => {
    const fileNames = [DB_NAME, `${DB_NAME}-wal`, `${DB_NAME}-shm`];
    let total = 0;
    for (const name of fileNames) {
        const file = new File(Paths.document, "SQLite", name);
        if (file.exists) total += file.size ?? 0;
    }
    return total;
};

const Settings = () => {
    const db = useSQLiteContext();

    const [theme, setTheme] = useState<ThemeMode>("light");
    const [openAiKey, setOpenAiKey] = useState("");
    const [anthropicKey, setAnthropicKey] = useState("");
    const [showOpenAi, setShowOpenAi] = useState(false);
    const [showAnthropic, setShowAnthropic] = useState(false);

    const [dbSize, setDbSize] = useState(0);
    const [busy, setBusy] = useState<DbTask>(null);
    const [status, setStatus] = useState<string | null>(null);

    const loadStorage = useCallback(() => {
        setDbSize(getDatabaseSize());
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadStorage();
        }, [loadStorage])
    );

    const runMaintenance = async (task: Exclude<DbTask, null>) => {
        if (busy) return;
        setBusy(task);
        setStatus(null);
        try {
            await db.execAsync(task === "vacuum" ? "VACUUM;" : "ANALYZE;");
            loadStorage();
            setStatus(task === "vacuum" ? "Database compacted." : "Statistics updated.");
        } catch (error) {
            setStatus(
                error instanceof Error ? error.message : "Maintenance task failed."
            );
        } finally {
            setBusy(null);
        }
    };

    const storagePercent = Math.min(dbSize / STORAGE_BUDGET_BYTES, 1);
    const appVersion = Constants.expoConfig?.version ?? "1.0.0";

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={styles.versionBadge}>
                    <Text style={styles.versionText}>v{appVersion}</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Theme Preferences */}
                <View style={[styles.card, styles.themeCard]}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardHeaderText}>
                            <Text style={styles.cardTitle}>Theme Preferences</Text>
                            <Text style={styles.cardSubtitle}>Light or Dark aesthetic</Text>
                        </View>
                        <View style={styles.themeToggle}>
                            <Pressable
                                style={[styles.themeButton, theme === "light" && styles.themeButtonActive]}
                                onPress={() => setTheme("light")}
                            >
                                <Ionicons name="sunny" size={20} color={Colors.onSurface} />
                            </Pressable>
                            <Pressable
                                style={[styles.themeButton, theme === "dark" && styles.themeButtonActive]}
                                onPress={() => setTheme("dark")}
                            >
                                <Ionicons name="moon" size={20} color={Colors.onSurface} />
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* API Keys */}
                <View style={[styles.card, styles.apiCard]}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardIcon}>
                            <Ionicons name="key" size={20} color={Colors.onSurface} />
                        </View>
                        <View style={styles.cardHeaderText}>
                            <Text style={styles.cardTitle}>API Keys</Text>
                            <Text style={styles.cardSubtitle}>Manage AI Service Credentials</Text>
                        </View>
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.fieldLabel}>OpenAI API Key</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                value={openAiKey}
                                onChangeText={setOpenAiKey}
                                placeholder="sk-..."
                                placeholderTextColor={Colors.onSurfaceVariant}
                                secureTextEntry={!showOpenAi}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <Pressable
                                style={styles.eyeButton}
                                onPress={() => setShowOpenAi((v) => !v)}
                            >
                                <Ionicons
                                    name={showOpenAi ? "eye-off" : "eye"}
                                    size={18}
                                    color={Colors.onSurface}
                                />
                            </Pressable>
                        </View>
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Anthropic Key</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                value={anthropicKey}
                                onChangeText={setAnthropicKey}
                                placeholder="Enter key..."
                                placeholderTextColor={Colors.onSurfaceVariant}
                                secureTextEntry={!showAnthropic}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <Pressable
                                style={styles.eyeButton}
                                onPress={() => setShowAnthropic((v) => !v)}
                            >
                                <Ionicons
                                    name={showAnthropic ? "eye-off" : "eye"}
                                    size={18}
                                    color={Colors.onSurface}
                                />
                            </Pressable>
                        </View>
                    </View>

                    <Text style={styles.apiNote}>
                        Keys are stored locally on this device.
                    </Text>
                </View>

                {/* Database Maintenance */}
                <View style={[styles.card, styles.dbCard]}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardIcon}>
                            <Ionicons name="server" size={20} color={Colors.onSurface} />
                        </View>
                        <View style={styles.cardHeaderText}>
                            <Text style={styles.cardTitle}>Database Maintenance</Text>
                            <Text style={styles.cardSubtitle}>SQLite Management & Optimization</Text>
                        </View>
                    </View>

                    <View style={styles.dbButtonRow}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.dbButton,
                                busy !== null && styles.dbButtonDisabled,
                                pressed && styles.dbButtonPressed,
                            ]}
                            onPress={() => runMaintenance("vacuum")}
                            disabled={busy !== null}
                        >
                            {busy === "vacuum" ? (
                                <ActivityIndicator size="small" color={Colors.onSurface} />
                            ) : (
                                <Ionicons name="construct" size={18} color={Colors.onSurface} />
                            )}
                            <Text style={styles.dbButtonText}>Vacuum DB</Text>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.dbButton,
                                busy !== null && styles.dbButtonDisabled,
                                pressed && styles.dbButtonPressed,
                            ]}
                            onPress={() => runMaintenance("analyze")}
                            disabled={busy !== null}
                        >
                            {busy === "analyze" ? (
                                <ActivityIndicator size="small" color={Colors.onSurface} />
                            ) : (
                                <Ionicons name="analytics" size={18} color={Colors.onSurface} />
                            )}
                            <Text style={styles.dbButtonText}>Analyze</Text>
                        </Pressable>
                    </View>

                    <View style={styles.storageBlock}>
                        <View style={styles.storageLabelRow}>
                            <Text style={styles.storageLabel}>Storage Used</Text>
                            <Text style={styles.storageValue}>{formatBytes(dbSize)}</Text>
                        </View>
                        <View style={styles.storageBarTrack}>
                            <View
                                style={[
                                    styles.storageBarFill,
                                    { width: `${Math.max(storagePercent * 100, 2)}%` },
                                ]}
                            />
                        </View>
                    </View>

                    {status && <Text style={styles.statusText}>{status}</Text>}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: Spacing.innerPadding,
        borderBottomWidth: Border.default,
        borderBottomColor: Colors.outlineBlack,
    },
    headerTitle: {
        ...Typography.headlineMd,
        color: Colors.primary,
    },
    versionBadge: {
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.base - 5,
        borderRadius: Radius.full,
        borderWidth: Border.thin,
        borderColor: Colors.outlineBlack,
        backgroundColor: Colors.surfaceContainerHighest,
    },
    versionText: {
        ...Typography.labelSm,
        textTransform: "none",
        color: Colors.onSurfaceVariant,
    },
    content: {
        padding: Spacing.innerPadding,
        gap: Spacing.stackGap,
        paddingBottom: Spacing.containerPadding * 2,
    },
    card: {
        borderRadius: Radius.lg,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        padding: Spacing.innerPadding + 4,
        gap: Spacing.stackGap,
        ...Shadows.sticker,
    },
    themeCard: {
        backgroundColor: Colors.secondaryContainer,
    },
    apiCard: {
        backgroundColor: Colors.primaryContainer,
    },
    dbCard: {
        backgroundColor: Colors.tertiaryContainer,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.base,
    },
    cardIcon: {
        width: 40,
        height: 40,
        borderRadius: Radius.md,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.surfaceContainerLowest,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
    },
    cardHeaderText: {
        flex: 1,
        gap: 2,
    },
    cardTitle: {
        ...Typography.headlineMd,
        fontSize: 18,
        lineHeight: 22,
        color: Colors.onSurface,
    },
    cardSubtitle: {
        ...Typography.bodyMd,
        fontSize: 13,
        color: Colors.onSurface,
        opacity: 0.7,
    },
    themeToggle: {
        flexDirection: "row",
        gap: Spacing.base - 4,
    },
    themeButton: {
        width: 44,
        height: 44,
        borderRadius: Radius.md,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.surfaceContainerLowest,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
    },
    themeButtonActive: {
        backgroundColor: Colors.primaryContainer,
        ...Shadows.sticker,
    },
    field: {
        gap: Spacing.base - 2,
    },
    fieldLabel: {
        ...Typography.labelSm,
        textTransform: "none",
        color: Colors.onSurface,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.base,
        backgroundColor: Colors.surfaceContainerLowest,
        borderRadius: Radius.md,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        paddingHorizontal: Spacing.innerPadding,
    },
    input: {
        ...Typography.codeBlock,
        flex: 1,
        color: Colors.onSurface,
        paddingVertical: Spacing.innerPadding,
    },
    eyeButton: {
        padding: Spacing.base - 4,
    },
    apiNote: {
        ...Typography.bodyMd,
        fontSize: 12,
        fontStyle: "italic",
        color: Colors.onSurface,
        opacity: 0.7,
    },
    dbButtonRow: {
        flexDirection: "row",
        gap: Spacing.base,
    },
    dbButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: Spacing.base - 2,
        paddingVertical: Spacing.innerPadding,
        borderRadius: Radius.md,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        backgroundColor: Colors.surfaceContainerLowest,
        ...Shadows.sticker,
    },
    dbButtonPressed: {
        transform: [{ translateX: 2 }, { translateY: 2 }],
        ...Shadows.pressed,
    },
    dbButtonDisabled: {
        opacity: 0.6,
    },
    dbButtonText: {
        ...Typography.labelSm,
        textTransform: "none",
        color: Colors.onSurface,
    },
    storageBlock: {
        gap: Spacing.base,
        padding: Spacing.innerPadding,
        borderRadius: Radius.md,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        backgroundColor: Colors.surfaceContainerLowest,
    },
    storageLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    storageLabel: {
        ...Typography.labelSm,
        textTransform: "none",
        color: Colors.onSurface,
    },
    storageValue: {
        ...Typography.labelSm,
        textTransform: "none",
        color: Colors.onSurface,
    },
    storageBarTrack: {
        height: 12,
        borderRadius: Radius.full,
        borderWidth: Border.thin,
        borderColor: Colors.outlineBlack,
        backgroundColor: Colors.surfaceContainerHighest,
        overflow: "hidden",
    },
    storageBarFill: {
        height: "100%",
        backgroundColor: Colors.primaryContainer,
    },
    statusText: {
        ...Typography.bodyMd,
        fontSize: 13,
        color: Colors.onSurface,
    },
});
