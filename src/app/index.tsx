import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Border, Radius, Shadows, Spacing, Typography, type Palette } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";

const avatar = require("../../assets/images/onboarding-avatar.png");

export default function Index() {
  const router = useRouter();
  const { colors: Colors } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.brandRow}>
        <View style={styles.brandBadge}>
          <Ionicons name="code-slash" size={20} color={Colors.onSurface} />
        </View>
        <Text style={styles.brand}>CodeVault</Text>
      </View>

      <View style={styles.hero}>
        {/* Speech bubble sticker */}
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>Stay Organized!</Text>
          <View style={styles.bubbleTail} />
        </View>

        {/* Avatar illustration card */}
        <View style={styles.avatarCard}>
          <Image source={avatar} style={styles.avatar} contentFit="contain" />
        </View>
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>Your code,{"\n"}neatly vaulted.</Text>
        <Text style={styles.subtitle}>
          Save snippets, attach screenshots, and find everything in seconds.
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={styles.ctaText}>Get Started</Text>
        <Ionicons name="arrow-forward" size={20} color={Colors.onSurface} />
      </Pressable>
    </SafeAreaView>
  );
}

const makeStyles = (Colors: Palette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: Spacing.containerPadding,
      backgroundColor: Colors.background,
    },
    brandRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.base,
    },
    brandBadge: {
      width: 40,
      height: 40,
      borderRadius: Radius.md,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.primaryContainer,
      borderWidth: Border.default,
      borderColor: Colors.outlineBlack,
      ...Shadows.sticker,
    },
    brand: {
      ...Typography.headlineMd,
      color: Colors.primary,
    },
    hero: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    bubble: {
      alignSelf: "center",
      zIndex: 2,
      marginBottom: -14,
      transform: [{ rotate: "-3deg" }],
      paddingHorizontal: Spacing.innerPadding + 2,
      paddingVertical: Spacing.base,
      borderRadius: Radius.md,
      borderWidth: Border.default,
      borderColor: Colors.outlineBlack,
      backgroundColor: Colors.inverseSurface,
      ...Shadows.sticker,
    },
    bubbleText: {
      ...Typography.headlineMd,
      fontSize: 18,
      lineHeight: 22,
      color: Colors.inverseOnSurface,
    },
    bubbleTail: {
      position: "absolute",
      bottom: -8,
      left: 28,
      width: 14,
      height: 14,
      backgroundColor: Colors.inverseSurface,
      borderRightWidth: Border.default,
      borderBottomWidth: Border.default,
      borderColor: Colors.outlineBlack,
      transform: [{ rotate: "45deg" }],
    },
    avatarCard: {
      width: "86%",
      aspectRatio: 1,
      padding: Spacing.innerPadding,
      borderRadius: Radius.xl,
      borderWidth: Border.thick,
      borderColor: Colors.outlineBlack,
      backgroundColor: Colors.surfaceContainerLow,
      overflow: "hidden",
      ...Shadows.sticker,
    },
    avatar: {
      width: "100%",
      height: "100%",
    },
    copy: {
      gap: Spacing.base,
      marginBottom: Spacing.stackGap,
    },
    title: {
      ...Typography.displayLg,
      color: Colors.onSurface,
    },
    subtitle: {
      ...Typography.bodyMd,
      color: Colors.onSurfaceVariant,
    },
    cta: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.base,
      paddingVertical: Spacing.innerPadding + 4,
      borderRadius: Radius.md,
      borderWidth: Border.default,
      borderColor: Colors.outlineBlack,
      backgroundColor: Colors.primaryContainer,
      ...Shadows.sticker,
    },
    ctaPressed: {
      transform: [{ translateX: 2 }, { translateY: 2 }],
      ...Shadows.pressed,
    },
    ctaText: {
      ...Typography.headlineMd,
      color: Colors.onSurface,
    },
  });
