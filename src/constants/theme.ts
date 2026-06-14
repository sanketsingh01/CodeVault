/**
 * Design tokens for the "Retro Script" design system.
 * Neo-brutalist, retro-illustrative aesthetic: warm cream surfaces,
 * bold black outlines, vibrant color blocks, and hard offset shadows.
 *
 * Source of truth: DESIGN.md
 */

export const Colors = {
  surface: "#fff9ec",
  surfaceDim: "#dfdacd",
  surfaceBright: "#fff9ec",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f9f3e6",
  surfaceContainer: "#f3ede1",
  surfaceContainerHigh: "#ede8db",
  surfaceContainerHighest: "#e8e2d5",
  onSurface: "#1d1c14",
  onSurfaceVariant: "#594139",
  inverseSurface: "#333028",
  inverseOnSurface: "#f6f0e3",
  outline: "#8d7168",
  outlineVariant: "#e1bfb5",
  surfaceTint: "#ab3500",

  primary: "#ab3500",
  onPrimary: "#ffffff",
  primaryContainer: "#ff6b35",
  onPrimaryContainer: "#5f1900",
  inversePrimary: "#ffb59d",

  secondary: "#24657e",
  onSecondary: "#ffffff",
  secondaryContainer: "#a6e2ff",
  onSecondaryContainer: "#24667f",

  tertiary: "#5f559a",
  onTertiary: "#ffffff",
  tertiaryContainer: "#9b90db",
  onTertiaryContainer: "#31276a",

  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",

  primaryFixed: "#ffdbd0",
  primaryFixedDim: "#ffb59d",
  onPrimaryFixed: "#390c00",
  onPrimaryFixedVariant: "#832600",

  secondaryFixed: "#bde9ff",
  secondaryFixedDim: "#93cfeb",
  onSecondaryFixed: "#001f2a",
  onSecondaryFixedVariant: "#004d64",

  tertiaryFixed: "#e5deff",
  tertiaryFixedDim: "#c8bfff",
  onTertiaryFixed: "#1b0c53",
  onTertiaryFixedVariant: "#473d81",

  background: "#fff9ec",
  onBackground: "#1d1c14",
  surfaceVariant: "#e8e2d5",

  /** Solid black used for the neo-brutalist outlines and hard shadows. */
  outlineBlack: "#1a1a1a",
} as const;

/**
 * A theme palette. Same shape as the light `Colors` token set, but with the
 * values widened to `string` so the dark palette (with different hex values)
 * is assignable to it.
 */
export type Palette = { [K in keyof typeof Colors]: string };
export type PaletteKey = keyof typeof Colors;

/** The default (light) palette. */
export const lightColors: Palette = Colors;

/**
 * Dark variant of the "Retro Script" system.
 *
 * The page + card surfaces go dark, and anything that was black in the light
 * theme (body text, headings, the neo-brutalist outlines) flips to white/cream
 * so it stays visible. The vibrant accent containers are deepened so light text
 * remains legible on top of them.
 */
export const darkColors: Palette = {
  ...lightColors,

  // Surfaces -> dark
  surface: "#14120b",
  surfaceDim: "#14120b",
  surfaceBright: "#26241b",
  surfaceContainerLowest: "#100e08",
  surfaceContainerLow: "#1c1a12",
  surfaceContainer: "#211e15",
  surfaceContainerHigh: "#2b281e",
  surfaceContainerHighest: "#363228",
  background: "#14120b",
  surfaceVariant: "#363228",

  // Black text/icons -> white/cream
  onSurface: "#f6f0e3",
  onSurfaceVariant: "#d8c2b8",
  onBackground: "#f6f0e3",

  // Black outline -> light, so the sticker borders show on dark
  outlineBlack: "#efe6d4",
  outline: "#a48d83",
  outlineVariant: "#5c4a43",

  // Deepen the accent containers so light text/icons stay legible on them
  primary: "#ab3500",
  onPrimary: "#ffffff",
  primaryContainer: "#ff6b35",
  onPrimaryContainer: "#5f1900",
  secondary: "#24657e",
  onSecondary: "#e5d0d0",
  secondaryContainer: "#2eb2f5",
  tertiaryContainer: "#3c336e",
  onTertiaryContainer: "#bcaeef",
  primaryFixedDim: "#f6784e",
  secondaryFixedDim: "#62ccfe",
  tertiaryFixed: "#e5deff",
  tertiaryFixedDim: "#7463e8",
  onTertiaryFixedVariant: "#382a89",
};

/**
 * Font family names. These match the export names from the
 * @expo-google-fonts packages and the keys loaded via `useFonts`
 * in the root layout.
 */
export const Fonts = {
  displayBold: "Epilogue_800ExtraBold",
  headline: "Epilogue_700Bold",
  body: "WorkSans_400Regular",
  label: "WorkSans_600SemiBold",
  code: "JetBrainsMono_500Medium",
} as const;

/**
 * Typographic scale. `lineHeight` is expressed in absolute units (dp)
 * since React Native does not support unitless multipliers.
 */
export const Typography = {
  displayLg: {
    fontFamily: Fonts.displayBold,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.8,
  },
  headlineMd: {
    fontFamily: Fonts.headline,
    fontSize: 24,
    lineHeight: 29,
  },
  bodyMd: {
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 24,
  },
  codeBlock: {
    fontFamily: Fonts.code,
    fontSize: 14,
    lineHeight: 22,
  },
  labelSm: {
    fontFamily: Fonts.label,
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
} as const;

/** Border radius scale (in dp). */
export const Radius = {
  sm: 4,
  default: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

/** Spacing scale (in dp). */
export const Spacing = {
  base: 8,
  containerPadding: 20,
  stackGap: 16,
  innerPadding: 12,
} as const;

/** Outline / border widths for the "sticker" effect. */
export const Border = {
  thin: 1,
  default: 2,
  thick: 3,
} as const;

/**
 * Hard, offset shadow used to give elements a lifted "sticker" look.
 * On press, collapse the offset to 0 for a tactile "pushed down" feel.
 */
export const Shadows = {
  sticker: {
    shadowColor: Colors.outlineBlack,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  pressed: {
    shadowColor: Colors.outlineBlack,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
} as const;

const theme = {
  Colors,
  Fonts,
  Typography,
  Radius,
  Spacing,
  Border,
  Shadows,
};

export default theme;
