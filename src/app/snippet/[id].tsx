import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Border, Colors, Radius, Shadows, Spacing, Typography } from "@/constants/theme";
import { getLanguageStyle, parseTags, type Snippet } from "@/data/snippetsData";
import { useFocusEffect } from "expo-router";

import SyntaxHighlighter from "react-native-syntax-highlighter";
import githubStyle from "react-syntax-highlighter/styles/hljs/github";

type IconName = keyof typeof Ionicons.glyphMap;

const AI_ACTIONS: { key: string; label: string; icon: IconName; bg: string }[] = [
    { key: "explain", label: "Explain", icon: "sparkles", bg: Colors.primaryContainer },
    { key: "summarize", label: "Summarize", icon: "reader", bg: Colors.secondaryContainer },
    { key: "improve", label: "Improve", icon: "build", bg: Colors.tertiaryContainer },
];

const EXPORT_ACTIONS: { key: string; label: string; icon: IconName }[] = [
    { key: "copy", label: "Copy", icon: "copy-outline" },
    { key: "markdown", label: "Markdown", icon: "logo-markdown" },
    { key: "image", label: "Image", icon: "image-outline" },
];

const SnippetDetail = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const db = useSQLiteContext();
    const router = useRouter();

    const [snippet, setSnippet] = useState<Snippet | null>(null);
    const [code, setCode] = useState("");
    const [copied, setCopied] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    const loadSnippet = useCallback(async () => {
        const row = await db.getFirstAsync<Snippet>(
            "SELECT * FROM snippets WHERE id = ?;",
            [Number(id)]
        );
        setSnippet(row ?? null);
        setCode(row?.code_content ?? "");
    }, [db, id]);

    useFocusEffect(
        useCallback(() => {
            loadSnippet();
        }, [loadSnippet])
    );

    const handleCopy = async () => {
        await Clipboard.setStringAsync(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleSave = async () => {
        if (!snippet) return;
        setSaving(true);
        try {
            await db.runAsync(
                "UPDATE snippets SET code_content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;",
                [code, snippet.id]
            );
            setSnippet({ ...snippet, code_content: code });
            setEditing(false);
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setCode(snippet?.code_content ?? "");
        setEditing(false);
    };

    const isDirty = snippet !== null && code !== snippet.code_content;

    if (!snippet) {
        return (
            <SafeAreaView style={styles.container} edges={["top"]}>
                <View style={styles.header}>
                    <Pressable style={styles.iconButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={22} color={Colors.onSurface} />
                    </Pressable>
                    <Text style={styles.headerTitle}>Snippet</Text>
                    <View style={styles.iconButton} />
                </View>
                <View style={styles.emptyState}>
                    <Ionicons name="alert-circle-outline" size={48} color={Colors.onSurfaceVariant} />
                    <Text style={styles.emptyText}>Snippet not found.</Text>
                </View>
            </SafeAreaView>
        );
    }

    const { bg } = getLanguageStyle(snippet.language);
    const tags = parseTags(snippet.tags);

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.iconButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color={Colors.onSurface} />
                </Pressable>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {snippet.title}
                </Text>
                <Pressable style={styles.iconButton}>
                    <Ionicons
                        name={snippet.is_favorite ? "bookmark" : "bookmark-outline"}
                        size={20}
                        color={Colors.onSurface}
                    />
                </Pressable>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Language badge */}
                <View style={[styles.badge, { backgroundColor: bg }]}>
                    <Text style={styles.badgeText}>{snippet.language}</Text>
                </View>

                {/* Title */}
                <Text style={styles.title}>{snippet.title}</Text>

                {/* Tags */}
                {tags.length > 0 && (
                    <View style={styles.tagRow}>
                        {tags.map((tag) => (
                            <View key={tag} style={styles.chip}>
                                <Text style={styles.chipText}>#{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Screenshot */}
                {snippet.screenshot_path && (
                    <Image
                        source={{ uri: snippet.screenshot_path }}
                        style={styles.screenshot}
                        contentFit="cover"
                    />
                )}

                {/* Code block */}
                <View style={[styles.codeCard, styles.sticker]}>
                    <View style={styles.codeHeader}>
                        <View style={styles.dots}>
                            <View style={[styles.dot, { backgroundColor: Colors.error }]} />
                            <View style={[styles.dot, { backgroundColor: Colors.outline }]} />
                            <View style={[styles.dot, { backgroundColor: Colors.secondary }]} />
                        </View>
                        <View style={styles.codeHeaderActions}>
                            <Pressable
                                style={styles.codeHeaderButton}
                                onPress={() => (editing ? handleCancelEdit() : setEditing(true))}
                            >
                                <Ionicons
                                    name={editing ? "eye-outline" : "create-outline"}
                                    size={14}
                                    color={Colors.onPrimaryContainer}
                                />
                                <Text style={styles.codeHeaderButtonText}>
                                    {editing ? "View" : "Edit"}
                                </Text>
                            </Pressable>
                            <Pressable style={styles.codeHeaderButton} onPress={handleCopy}>
                                <Ionicons
                                    name={copied ? "checkmark" : "copy-outline"}
                                    size={14}
                                    color={Colors.onPrimaryContainer}
                                />
                                <Text style={styles.codeHeaderButtonText}>
                                    {copied ? "Copied!" : "Copy"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {editing ? (
                        <TextInput
                            style={styles.codeInput}
                            value={code}
                            onChangeText={setCode}
                            multiline
                            autoCapitalize="none"
                            autoCorrect={false}
                            spellCheck={false}
                            textAlignVertical="top"
                            placeholder="Write your code here..."
                            placeholderTextColor={Colors.onSurfaceVariant}
                        />
                    ) : (
                        <View style={styles.codeViewer}>
                            <SyntaxHighlighter
                                language={snippet.language.toLowerCase()}
                                style={githubStyle}
                                customStyle={styles.highlighterContainer}
                                fontFamily={Typography.codeBlock.fontFamily}
                                fontSize={Typography.codeBlock.fontSize}
                                PreTag={ScrollView}
                                CodeTag={ScrollView}
                            >
                                {code}
                            </SyntaxHighlighter>
                        </View>
                    )}
                </View>

                {/* Save button (only while editing) */}
                {editing && (
                    <Pressable
                        style={[styles.saveButton, (!isDirty || saving) && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={!isDirty || saving}
                    >
                        <Ionicons name="save-outline" size={18} color={Colors.onSurface} />
                        <Text style={styles.saveButtonText}>
                            {saving ? "Saving..." : isDirty ? "Save Changes" : "Saved"}
                        </Text>
                    </Pressable>
                )}

                {/* AI Actions (functionality coming later) */}
                <Text style={styles.sectionTitle}>AI Actions</Text>
                <View style={styles.actionRow}>
                    {AI_ACTIONS.map((action) => (
                        <View
                            key={action.key}
                            style={[styles.actionButton, { backgroundColor: action.bg }]}
                        >
                            <Ionicons name={action.icon} size={18} color={Colors.onSurface} />
                            <Text style={styles.actionText}>{action.label}</Text>
                        </View>
                    ))}
                </View>

                {/* AI explanation placeholder */}
                <View style={styles.explanationBox}>
                    <Ionicons name="sparkles-outline" size={20} color={Colors.onTertiaryContainer} />
                    <Text style={styles.explanationText}>
                        AI explanation will appear here. Coming soon.
                    </Text>
                </View>

                {/* Export As (functionality coming later) */}
                <Text style={styles.sectionTitle}>Export As</Text>
                <View style={styles.actionRow}>
                    {EXPORT_ACTIONS.map((action) => (
                        <View key={action.key} style={styles.exportButton}>
                            <Ionicons name={action.icon} size={20} color={Colors.onSurface} />
                            <Text style={styles.exportText}>{action.label}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SnippetDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    sticker: {
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        ...Shadows.sticker,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: Spacing.base,
        padding: Spacing.innerPadding,
        borderBottomWidth: Border.default,
        borderBottomColor: Colors.outlineBlack,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: Radius.md,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.surfaceContainerHighest,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
    },
    headerTitle: {
        ...Typography.headlineMd,
        flex: 1,
        textAlign: "center",
        color: Colors.onSurface,
    },
    content: {
        padding: Spacing.containerPadding,
        gap: Spacing.stackGap,
        paddingBottom: Spacing.containerPadding * 2,
    },
    badge: {
        alignSelf: "flex-start",
        paddingHorizontal: Spacing.innerPadding,
        paddingVertical: Spacing.base - 4,
        borderRadius: Radius.full,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
    },
    badgeText: {
        ...Typography.labelSm,
        color: Colors.onSurface,
    },
    title: {
        ...Typography.displayLg,
        fontSize: 30,
        lineHeight: 34,
        color: Colors.onSurface,
    },
    tagRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: Spacing.base,
    },
    chip: {
        paddingHorizontal: Spacing.innerPadding,
        paddingVertical: Spacing.base - 4,
        borderRadius: Radius.full,
        borderWidth: Border.thin,
        borderColor: Colors.outlineBlack,
        backgroundColor: Colors.surfaceContainerLowest,
    },
    chipText: {
        ...Typography.labelSm,
        textTransform: "none",
        color: Colors.onSurface,
    },
    screenshot: {
        width: "100%",
        height: 200,
        borderRadius: Radius.lg,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
    },
    codeCard: {
        borderRadius: Radius.lg,
        overflow: "hidden",
        backgroundColor: Colors.surfaceContainerLowest,
    },
    codeHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: Colors.primaryContainer,
        paddingHorizontal: Spacing.innerPadding,
        paddingVertical: Spacing.base,
        borderBottomWidth: Border.default,
        borderBottomColor: Colors.outlineBlack,
    },
    dots: {
        flexDirection: "row",
        gap: Spacing.base - 2,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: Radius.full,
        borderWidth: Border.thin,
        borderColor: Colors.outlineBlack,
    },
    codeHeaderActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.base - 4,
    },
    codeHeaderButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.base - 4,
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.base - 5,
        borderRadius: Radius.sm,
        borderWidth: Border.thin,
        borderColor: Colors.outlineBlack,
        backgroundColor: Colors.surfaceContainerLowest,
    },
    codeHeaderButtonText: {
        ...Typography.labelSm,
        textTransform: "none",
        color: Colors.onPrimaryContainer,
    },
    codeInput: {
        ...Typography.codeBlock,
        color: Colors.onSurface,
        backgroundColor: Colors.surfaceContainerLowest,
        padding: Spacing.innerPadding,
        minHeight: 160,
    },
    codeViewer: {
        backgroundColor: Colors.surfaceContainerLowest,
        minHeight: 160,
    },
    highlighterContainer: {
        backgroundColor: Colors.surfaceContainerLowest,
        padding: Spacing.innerPadding,
    },
    saveButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: Spacing.base,
        paddingVertical: Spacing.innerPadding,
        borderRadius: Radius.md,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        backgroundColor: Colors.primaryContainer,
        ...Shadows.sticker,
    },
    saveButtonDisabled: {
        backgroundColor: Colors.surfaceContainerHigh,
        opacity: 0.7,
    },
    saveButtonText: {
        ...Typography.headlineMd,
        fontSize: 18,
        color: Colors.onSurface,
    },
    sectionTitle: {
        ...Typography.headlineMd,
        color: Colors.onSurface,
    },
    actionRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: Spacing.base,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.base - 4,
        paddingHorizontal: Spacing.innerPadding,
        paddingVertical: Spacing.base,
        borderRadius: Radius.full,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        ...Shadows.sticker,
    },
    actionText: {
        ...Typography.labelSm,
        textTransform: "none",
        color: Colors.onSurface,
    },
    explanationBox: {
        flexDirection: "row",
        gap: Spacing.base,
        padding: Spacing.innerPadding + 2,
        borderRadius: Radius.lg,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        backgroundColor: Colors.tertiaryFixed,
    },
    explanationText: {
        ...Typography.bodyMd,
        flex: 1,
        color: Colors.onTertiaryFixedVariant,
    },
    exportButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.base - 4,
        paddingHorizontal: Spacing.innerPadding,
        paddingVertical: Spacing.base,
        borderRadius: Radius.md,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        backgroundColor: Colors.surfaceContainerLowest,
        ...Shadows.sticker,
    },
    exportText: {
        ...Typography.labelSm,
        textTransform: "none",
        color: Colors.onSurface,
    },
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: Spacing.base,
    },
    emptyText: {
        ...Typography.bodyMd,
        color: Colors.onSurfaceVariant,
    },
});
