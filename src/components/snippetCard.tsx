import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Border, Radius, Shadows, Spacing, Typography, type Palette } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { getLanguageStyle, parseTags, type Snippet } from '@/data/snippetsData';

const SnippetCard = ({ item }: { item: Snippet }) => {
    const router = useRouter();
    const { colors: Colors } = useTheme();
    const styles = useMemo(() => makeStyles(Colors), [Colors]);
    const { icon, bg } = getLanguageStyle(item.language, Colors);
    const tags = parseTags(item.tags);

    return (
        <Pressable
            onPress={() =>
                router.push({
                    pathname: "/snippet/[id]",
                    params: { id: String(item.id) },
                })
            }
            style={({ pressed }) => [
                styles.card,
                { backgroundColor: bg },
                pressed && styles.cardPressed,
            ]}
        >
            <View style={styles.cardTop}>
                <View style={styles.iconTile}>
                    <Ionicons name={icon} size={26} color={Colors.onSurface} />
                </View>

                <View style={styles.cardTitleCol}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={styles.cardSubtitle} numberOfLines={1}>
                        {item.language}
                    </Text>
                </View>

                <View style={styles.bookmark}>
                    <Ionicons
                        name={item.is_favorite ? 'bookmark' : 'bookmark-outline'}
                        size={18}
                        color={Colors.onSurface}
                    />
                </View>
            </View>

            {tags.length > 0 && (
                <View style={styles.tagRow}>
                    {tags.map((tag) => (
                        <View key={tag} style={styles.chip}>
                            <Text style={styles.chipText}>{tag}</Text>
                        </View>
                    ))}
                </View>
            )}
        </Pressable>
    );
};

export default SnippetCard;

const makeStyles = (Colors: Palette) => StyleSheet.create({
    card: {
        borderRadius: Radius.lg,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        padding: Spacing.innerPadding + 2,
        gap: Spacing.innerPadding,
        ...Shadows.sticker,
    },
    cardPressed: {
        transform: [{ translateX: 2 }, { translateY: 2 }],
        ...Shadows.pressed,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.innerPadding,
    },
    iconTile: {
        width: 48,
        height: 48,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        backgroundColor: Colors.surfaceContainerLowest,
    },
    cardTitleCol: {
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
        fontSize: 14,
        color: Colors.onSurface,
        opacity: 0.7,
    },
    bookmark: {
        width: 36,
        height: 36,
        borderRadius: Radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        backgroundColor: Colors.surfaceContainerLowest,
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
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
        color: Colors.onSurface,
    },
});
