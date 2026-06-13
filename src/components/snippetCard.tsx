import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { Border, Colors, Radius, Shadows, Spacing, Typography } from "@/constants/theme";
import { CHIP_COLORS, getLanguageStyle, parseTags, type Snippet } from '@/data/snippetsData';

const SnippetCard = ({ item }: { item: Snippet }) => {
    const { icon, bg } = getLanguageStyle(item.language);
    const tags = parseTags(item.tags);

    return (
        <View style={styles.card}>
            <View style={styles.cardTop}>
                <View style={[styles.iconTile, { backgroundColor: bg }]}>
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
                    {tags.map((tag, index) => (
                        <View
                            key={tag}
                            style={[
                                styles.chip,
                                { backgroundColor: CHIP_COLORS[index % CHIP_COLORS.length] },
                            ]}
                        >
                            <Text style={styles.chipText}>{tag}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

export default SnippetCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surfaceContainerLowest,
        borderRadius: Radius.lg,
        borderWidth: Border.default,
        borderColor: Colors.outlineBlack,
        padding: Spacing.innerPadding + 2,
        gap: Spacing.innerPadding,
        ...Shadows.sticker,
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
        color: Colors.onSurfaceVariant,
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
    },
    chipText: {
        ...Typography.labelSm,
        color: Colors.onSurface,
    },
});