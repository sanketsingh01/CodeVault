import { Epilogue_700Bold, Epilogue_800ExtraBold } from "@expo-google-fonts/epilogue";
import { JetBrainsMono_500Medium } from "@expo-google-fonts/jetbrains-mono";
import { WorkSans_400Regular, WorkSans_600SemiBold } from "@expo-google-fonts/work-sans";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { migrateDbIfNeeded } from "@/db/database";
import { SQLiteProvider } from "expo-sqlite";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Epilogue_700Bold,
    Epilogue_800ExtraBold,
    WorkSans_400Regular,
    WorkSans_600SemiBold,
    JetBrainsMono_500Medium,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SQLiteProvider databaseName="codevault.db" onInit={migrateDbIfNeeded}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="createSnippet"
          options={{ presentation: "modal" }}
        />
      </Stack>
    </SQLiteProvider>
  );
}
