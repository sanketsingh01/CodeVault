import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Border, Colors, Radius, Shadows, Spacing, Typography } from "@/constants/theme";

export default function Index() {
  const router = useRouter();

  const handlePush = () => {
    router.push("/(tabs)");
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CodeVault</Text>
      <Text style={styles.body}>
        Your retro-script design tokens are ready to use.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>React</Text>
        <Text style={styles.code}>const vault = useSnippets();</Text>
      </View>

      <View style={styles.card}>
        <Pressable onPress={handlePush}>
          <Text>Go to Home</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: Spacing.stackGap,
    padding: Spacing.containerPadding,
    backgroundColor: Colors.background,
  },
  title: {
    ...Typography.displayLg,
    color: Colors.primary,
  },
  body: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
  },
  card: {
    padding: Spacing.innerPadding,
    gap: Spacing.base,
    backgroundColor: Colors.secondaryContainer,
    borderRadius: Radius.lg,
    borderWidth: Border.default,
    borderColor: Colors.outlineBlack,
    ...Shadows.sticker,
  },
  label: {
    ...Typography.labelSm,
    color: Colors.onSecondaryContainer,
  },
  code: {
    ...Typography.codeBlock,
    color: Colors.onSurface,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.md,
    borderWidth: Border.default,
    borderColor: Colors.outlineBlack,
    padding: Spacing.innerPadding,
  },
});
