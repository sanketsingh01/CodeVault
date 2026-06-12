import { Ionicons } from "@expo/vector-icons";
import { Alert, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Border, Colors, Radius, Shadows, Spacing, Typography } from "@/constants/theme";
import { useState } from "react";

import { File, Paths } from "expo-file-system";
import * as ImagePIcker from 'expo-image-picker';

const Snippets = () => {
  const [title, setTitle] = useState<string>("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('JavaScript');
  const [screenshotUri, setScreenshotUri] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [code, setCode] = useState<string>('');

  const languages = ['JavaScript', 'Python', 'TypeScript', 'Java', 'C++'];

  const pickScreenshot = async () => {
    const permission = await ImagePIcker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission denied', 'You need to grant permission to access your photos.');
      return;
    }

    const result = await ImagePIcker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setScreenshotUri(result.assets[0].uri);
    }
  };

  const addTag = () => {
    const clean = tagInput.trim().replace(/^#/, "").toLowerCase();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  async function presistScreenshot(tempUri: string): Promise<string> {
    const fileName = `screenshot_${Date.now()}.png`;
    const source = new File(tempUri);
    const destination = new File(Paths.document, fileName);

    await source.copy(destination);

    return destination.uri;
  }

  // function to handle the save user input
  const handleSave = async () => {
    let savedScrrenshotPath: string | null = null;
    if (screenshotUri) {
      savedScrrenshotPath = await presistScreenshot(screenshotUri);
    };

    console.log({
      title,
      language: selectedLanguage,
      screenshot: savedScrrenshotPath,
      tags,
      code
    });

    setTitle("");
    setSelectedLanguage('JavaScript');
    setScreenshotUri(null);
    setTags([]);
    setCode('');
  };

  // function to discard all changes
  const handleDiscoard = () => {
    setTitle("");
    setSelectedLanguage('JavaScript');
    setScreenshotUri(null);
    setTags([]);
    setCode('');
  }


  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        {/* <Pressable style={styles.iconButton}>
          <Ionicons name="arrow-back" size={22} color={Colors.onSurface} />
        </Pressable> */}
        <Text style={styles.brand}>Snippets</Text>
        {/* <View style={styles.avatar}>
          <Ionicons name="person" size={20} color={Colors.onSurfaceVariant} />
        </View> */}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Create Snippet</Text>

        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            placeholder="Explain your code block..."
            placeholderTextColor={Colors.onSurfaceVariant}
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Language + Attachment row */}
        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Language</Text>
            <Pressable
              style={[styles.dropdown, styles.sticker]}
              onPress={() => setDropdownVisible(true)}
            >
              <Text style={styles.dropdownText}>{selectedLanguage}</Text>
              <Ionicons name="chevron-down" size={18} color={Colors.onSurface} />
            </Pressable>
          </View>

          <View style={styles.rowItem}>
            <Text style={styles.label}>Attachment</Text>
            <Pressable onPress={pickScreenshot} style={[styles.attachment, styles.sticker]}>
              <Ionicons name="camera-outline" size={18} color={Colors.onSurface} />
              <Text style={styles.attachmentText}>
                {screenshotUri ? "Change" : "Screenshot"}
              </Text>
            </Pressable>

            {screenshotUri && (
              <Image
                source={{ uri: screenshotUri }}
                style={{ width: 100, height: 100, borderRadius: 8 }}
              />
            )}
          </View>
        </View>

        <Modal
          visible={dropdownVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setDropdownVisible(false)}
        >
          {/* This Pressable acts as an overlay to close the modal if tapped outside */}
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setDropdownVisible(false)}
          >
            <View style={styles.dropdownMenu}>
              <FlatList
                data={languages}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedLanguage(item);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      selectedLanguage === item && styles.selectedText // Optional: highlight selected
                    ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </Pressable>
        </Modal>

        {/* Tags */}
        <View style={[styles.tagsContainer, styles.sticker]}>
          {tags.map((tag) => (
            <View key={tag} style={styles.chip}>
              <Text style={styles.chipText}>#{tag}</Text>
              <Pressable onPress={() => removeTag(tag)}>
                <Ionicons name="close" size={14} color={Colors.onSurface} />
              </Pressable>
            </View>
          ))}
          <TextInput
            placeholder="Add tags..."
            placeholderTextColor={Colors.onTertiaryContainer}
            style={styles.addTags}
            value={tagInput}
            onChangeText={setTagInput}
            onSubmitEditing={addTag}
            blurOnSubmit={false}
            returnKeyType="done"
          />
        </View>

        {/* Code Content */}
        <View style={styles.field}>
          <Text style={styles.label}>Code Content</Text>
          <View style={[styles.codeCard, styles.sticker]}>
            <View style={styles.codeHeader}>
              <View style={styles.dots}>
                <View style={[styles.dot, { backgroundColor: Colors.error }]} />
                <View style={[styles.dot, { backgroundColor: Colors.outline }]} />
                <View style={[styles.dot, { backgroundColor: Colors.secondary }]} />
              </View>
              <Text style={styles.codeFile}>MAIN.JS</Text>
            </View>
            <View style={styles.codeBody}>
              <TextInput
                multiline
                placeholder="const code = () => { console.log('Happy Coding!'); }"
                placeholderTextColor={Colors.onSurfaceVariant}
                style={styles.codeInput}
                textAlignVertical="top"
                value={code}
                onChangeText={setCode}
              />
            </View>
          </View>
        </View>

        {/* Actions */}
        <Pressable onPress={handleSave} style={[styles.saveButton, styles.sticker]}>
          <Ionicons name="save-outline" size={20} color={Colors.onSurface} />
          <Text style={styles.saveText}>Save Snippet</Text>
        </Pressable>

        <Pressable onPress={handleDiscoard} style={styles.discardButton}>
          <Text style={styles.discardText}>Discard Draft</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Snippets;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  sticker: {
    borderWidth: Border.default,
    borderColor: Colors.outlineBlack,
    ...Shadows.sticker,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.containerPadding,
    paddingBottom: Spacing.innerPadding,
    borderBottomWidth: Border.default,
    borderBottomColor: Colors.outlineBlack,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: Border.default,
    borderColor: Colors.outlineBlack,
  },
  brand: {
    ...Typography.headlineMd,
    color: Colors.primary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: Border.default,
    borderColor: Colors.outlineBlack,
  },
  content: {
    padding: Spacing.containerPadding,
    gap: Spacing.stackGap,
    paddingBottom: Spacing.containerPadding * 2,
  },
  pageTitle: {
    ...Typography.displayLg,
    color: Colors.onSurface,
  },
  field: {
    gap: Spacing.base,
  },
  label: {
    ...Typography.labelSm,
    color: Colors.onSurface,
  },
  input: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.md,
    borderWidth: Border.default,
    borderColor: Colors.outlineBlack,
    paddingHorizontal: Spacing.innerPadding,
    paddingVertical: Spacing.innerPadding,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.stackGap,
  },
  rowItem: {
    flex: 1,
    gap: Spacing.base,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.secondaryContainer,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.innerPadding,
    paddingVertical: Spacing.innerPadding,
  },
  dropdownText: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
  },
  attachment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.base - 2,
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.innerPadding,
    paddingVertical: Spacing.innerPadding,
  },
  attachmentText: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center', // Centers the menu on screen
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dimmed background
  },
  dropdownMenu: {
    width: '80%',
    backgroundColor: '#FFF', // Or your Colors.surface
    borderRadius: 8,
    paddingVertical: 10,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadows for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333', // Or your Colors.onSurface
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#007AFF', // Your primary color
  },
  tagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.base,
    backgroundColor: Colors.tertiaryContainer,
    borderRadius: Radius.md,
    padding: Spacing.innerPadding,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.base - 4,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.full,
    borderWidth: Border.thin,
    borderColor: Colors.outlineBlack,
    paddingHorizontal: Spacing.innerPadding,
    paddingVertical: Spacing.base - 4,
  },
  chipText: {
    ...Typography.labelSm,
    textTransform: "none",
    color: Colors.onSurface,
  },
  addTags: {
    ...Typography.bodyMd,
    color: Colors.onTertiaryContainer,
  },
  codeCard: {
    borderRadius: Radius.lg,
    overflow: "hidden",
    backgroundColor: Colors.surfaceContainerLowest,
  },
  codeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: Spacing.innerPadding,
    paddingVertical: Spacing.base,
    borderBottomWidth: Border.default,
    borderBottomColor: Colors.outlineBlack,
  },
  dots: {
    flexDirection: "row",
    gap: Spacing.base - 2,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: Radius.full,
    borderWidth: Border.thin,
    borderColor: Colors.outlineBlack,
  },
  codeFile: {
    ...Typography.labelSm,
    color: Colors.onPrimaryContainer,
  },
  codeBody: {
    padding: Spacing.innerPadding,
    minHeight: 180,
  },
  codeInput: {
    ...Typography.codeBlock,
    color: Colors.onSurface,
    flex: 1,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.base,
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radius.md,
    paddingVertical: Spacing.innerPadding + 2,
  },
  saveText: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
  },
  discardButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.md,
    borderWidth: Border.thin,
    borderColor: Colors.outline,
    paddingVertical: Spacing.innerPadding,
  },
  discardText: {
    ...Typography.labelSm,
    textTransform: "none",
    color: Colors.onSurfaceVariant,
  },
});
