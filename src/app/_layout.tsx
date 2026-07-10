import { Epilogue_700Bold, Epilogue_800ExtraBold } from "@expo-google-fonts/epilogue";
import { JetBrainsMono_500Medium } from "@expo-google-fonts/jetbrains-mono";
import { WorkSans_400Regular, WorkSans_600SemiBold } from "@expo-google-fonts/work-sans";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { migrateDbIfNeeded } from "@/db/database";
import { SQLiteProvider } from "expo-sqlite";

SplashScreen.preventAutoHideAsync();

function AppShell({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { mode, colors, isReady } = useTheme();

  useEffect(() => {
    if (fontsLoaded && isReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isReady]);

  // Keep the splash screen up until both fonts and the saved theme are ready,
  // so the app never flashes the wrong palette on launch.
  if (!fontsLoaded || !isReady) {
    return null;
  }

  return (
    <>
      <StatusBar style={mode === "dark" ? "light" : "light"} />
      <SQLiteProvider databaseName="codevault.db" onInit={migrateDbIfNeeded}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="createSnippet" options={{ presentation: "modal" }} />
          <Stack.Screen name="snippet/[id]" />
        </Stack>
      </SQLiteProvider>
    </>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Epilogue_700Bold,
    Epilogue_800ExtraBold,
    WorkSans_400Regular,
    WorkSans_600SemiBold,
    JetBrainsMono_500Medium,
  });

  return (
    <ThemeProvider>
      <AppShell fontsLoaded={loaded || !!error} />
    </ThemeProvider>
  );
}
