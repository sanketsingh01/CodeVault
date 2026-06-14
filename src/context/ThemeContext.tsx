import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import { darkColors, lightColors, type Palette } from "@/constants/theme";

export type ThemeMode = "light" | "dark";

/** Key the preference is stored under in AsyncStorage. */
const STORAGE_KEY = "codevault.themeMode";

type ThemeContextValue = {
    /** The active mode. */
    mode: ThemeMode;
    /** The resolved palette for the active mode. */
    colors: Palette;
    /** True once the persisted preference has been read from storage. */
    isReady: boolean;
    /** Set (and persist) the mode explicitly. */
    setMode: (mode: ThemeMode) => void;
    /** Flip between light and dark (and persist). */
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>("light");
    const [isReady, setIsReady] = useState(false);

    // Load the saved preference once on mount.
    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (active && (saved === "light" || saved === "dark")) {
                    setModeState(saved);
                }
            } catch {
                // Ignore read errors and fall back to the default mode.
            } finally {
                if (active) setIsReady(true);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    const setMode = useCallback((next: ThemeMode) => {
        setModeState(next);
        // Persist in the background; UI does not need to wait on the write.
        AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
    }, []);

    const toggleTheme = useCallback(() => {
        setModeState((current) => {
            const next = current === "dark" ? "light" : "dark";
            AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
            return next;
        });
    }, []);

    const value = useMemo<ThemeContextValue>(
        () => ({
            mode,
            colors: mode === "dark" ? darkColors : lightColors,
            isReady,
            setMode,
            toggleTheme,
        }),
        [mode, isReady, setMode, toggleTheme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
