import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Border, Fonts, Radius, Shadows, type Palette } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";

const TAB_BAR_CONTENT_HEIGHT = 60;

type IconName = keyof typeof Ionicons.glyphMap;

function TabBarIcon({ name, focused }: { name: IconName; focused: boolean }) {
  const { colors: Colors } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      <Ionicons
        name={name}
        size={22}
        color={focused ? Colors.onPrimaryContainer : Colors.onSurface}
      />
    </View>
  );
}

export default function TabsLayout() {
  const { colors: Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.onSurface,
        tabBarInactiveTintColor: Colors.onSurfaceVariant,
        // Fixed height disables React Navigation's automatic inset; include it
        // manually so the bar clears gesture nav / home indicators.
        tabBarStyle: [
          styles.tabBar,
          {
            height: TAB_BAR_CONTENT_HEIGHT + insets.bottom,
            paddingBottom: 8 + insets.bottom,
          },
        ],
        tabBarItemStyle: styles.tabItem,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabBarIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="snippets"
        options={{
          title: "Snippets",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="code-slash" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          title: "Files",
          tabBarIcon: ({ focused }) => <TabBarIcon name="folder" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="settings" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const makeStyles = (Colors: Palette) =>
  StyleSheet.create({
    tabBar: {
      backgroundColor: Colors.surfaceContainerLowest,
      borderTopWidth: Border.thick,
      borderTopColor: Colors.outlineBlack,
      paddingTop: 4,
    },
    tabItem: {
      paddingVertical: 4,
    },
    tabLabel: {
      fontFamily: Fonts.label,
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    iconWrapper: {
      width: 44,
      height: 36,
      borderRadius: Radius.md,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: Border.default,
      borderColor: "transparent",
    },
    iconWrapperActive: {
      backgroundColor: Colors.primaryContainer,
      borderColor: Colors.outlineBlack,
      ...Shadows.sticker,
    },
  });
