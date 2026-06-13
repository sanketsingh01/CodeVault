import { Colors } from '@/constants/theme';
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

const LANGUAGE_STYLE: Record<string, { icon: IconName; bg: string }> = {
    javascript: { icon: 'logo-javascript', bg: Colors.primaryContainer },
    typescript: { icon: 'code-slash', bg: Colors.secondaryContainer },
    python: { icon: 'logo-python', bg: Colors.tertiaryContainer },
    java: { icon: 'cafe', bg: Colors.primaryFixedDim },
    'c++': { icon: 'hardware-chip', bg: Colors.secondaryFixedDim },
};

export const getLanguageStyle = (language: string) =>
    LANGUAGE_STYLE[language.trim().toLowerCase()] ?? {
        icon: 'code-slash' as IconName,
        bg: Colors.surfaceContainerHighest,
    };

export const CHIP_COLORS = [Colors.tertiaryContainer, Colors.secondaryContainer];

export const parseTags = (tags: string | null) =>
    (tags ?? '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);