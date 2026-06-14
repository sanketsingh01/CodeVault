import { lightColors, type Palette, type PaletteKey } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export type Snippet = {
    id: number;
    title: string;
    code_content: string;
    language: string;
    tags: string | null;
    is_favorite: number;
    screenshot_path: string | null;
};

type IconName = keyof typeof Ionicons.glyphMap;
export const buildTxt = (s: Snippet) => s.code_content;

const LANGUAGE_STYLE: Record<string, { icon: IconName; bg: PaletteKey }> = {
    javascript: { icon: 'logo-javascript', bg: 'primaryContainer' },
    typescript: { icon: 'code-slash', bg: 'secondaryContainer' },
    python: { icon: 'logo-python', bg: 'tertiaryContainer' },
    java: { icon: 'cafe', bg: 'primaryFixedDim' },
    'c++': { icon: 'hardware-chip', bg: 'secondaryFixedDim' },
};

export const getLanguageStyle = (language: string, colors: Palette = lightColors) => {
    const style = LANGUAGE_STYLE[language.trim().toLowerCase()];
    return {
        icon: style?.icon ?? ('code-slash' as IconName),
        bg: colors[style?.bg ?? 'surfaceContainerHighest'],
    };
};

export const CHIP_COLORS = [lightColors.tertiaryContainer, lightColors.secondaryContainer];

export const parseTags = (tags: string | null) =>
    (tags ?? '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

export const buildMarkdown = (s: Snippet) => {
    const tags = parseTags(s.tags).map((t) => `\`#${t}\``).join(" ");
    return [
        `# ${s.title}`,
        tags ? `\n${tags}` : "",
        `\n\n\`\`\`${s.language.toLowerCase()}`,
        s.code_content,
        "```",
    ].join("\n");
};

export const buildJson = (s: Snippet) =>
    JSON.stringify(
        {
            title: s.title,
            language: s.language,
            tags: parseTags(s.tags),
            code: s.code_content,
            is_favorite: !!s.is_favorite,
        },
        null,
        2
    );