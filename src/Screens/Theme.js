import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
  TextInput,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { useStyle } from '../Context/StyleContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../Components/Icon';
import ColorPicker from 'react-native-wheel-color-picker';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const presets = [
  {
    name: 'Light',
    colors: {
      bgPrimary: '#F5F8FF',
      bgSecondary: '#EAF2FF',
      textPrimary: '#1C1E21',
      textSecondary: '#5A6B8C',
      accent: '#0A4174',
      border: '#DDE3F0',
      barStyle: 'dark-content',
    },
  },
  {
    name: 'Gentle Sakura',
    colors: {
      bgPrimary: '#FFF9F9',
      bgSecondary: '#F8F0F2',
      textPrimary: '#5D4037',
      textSecondary: '#8D6E63',
      accent: '#E98FA9',
      border: '#E8D8DA',
      barStyle: 'dark-content',
    },
  },
  {
    name: 'Emerald Mosque',
    colors: {
      bgPrimary: '#F7FFFA',
      bgSecondary: '#E9F5EE',
      textPrimary: '#073B3A',
      textSecondary: '#507661',
      accent: '#2D8A68',
      border: '#DCE7E0',
      barStyle: 'dark-content',
    },
  },
  {
    name: 'Desert Jasper',
    colors: {
      bgPrimary: '#FAF6F0',
      bgSecondary: '#F2EBE2',
      textPrimary: '#6D4C41',
      textSecondary: '#A1887F',
      accent: '#B85C47',
      border: '#E3DCD3',
      barStyle: 'dark-content',
    },
  },
  {
    name: 'Lavender Day',
    colors: {
      bgPrimary: '#F9F7FD',
      bgSecondary: '#EFEBF5',
      textPrimary: '#4A2C7A',
      textSecondary: '#83739E',
      accent: '#8B70C2',
      border: '#E4DEED',
      barStyle: 'dark-content',
    },
  },
  {
    name: 'Dark',
    colors: {
      bgPrimary: '#18191A',
      bgSecondary: '#242526',
      textPrimary: '#E4E6EB',
      textSecondary: '#B0B3B8',
      accent: '#2194f2',
      border: '#3A3B3C',
      barStyle: 'light-content',
    },
  },
  {
    name: 'AMOLED Dark',
    colors: {
      bgPrimary: '#000000',
      bgSecondary: '#121212',
      textPrimary: '#FFFFFF',
      textSecondary: '#A9A9A9',
      accent: '#2194f2',
      border: '#212121',
      barStyle: 'light-content',
    },
  },
  {
    name: 'Moonlit Night',
    colors: {
      bgPrimary: '#04091A',
      bgSecondary: '#0E1735',
      textPrimary: '#F5EEDD',
      textSecondary: '#A8B8D0',
      accent: '#FFE8A3',
      border: '#212C4A',
      barStyle: 'light-content',
    },
  },
  {
    name: 'Winter Frost',
    colors: {
      bgPrimary: '#070B13',
      bgSecondary: '#101827',
      textPrimary: '#EAF2FF',
      textSecondary: '#899BC1',
      accent: '#A8C5FF',
      border: '#1F293A',
      barStyle: 'light-content',
    },
  },
  {
    name: 'Crystalline',
    colors: {
      bgPrimary: '#070B13',
      bgSecondary: '#101827',
      textPrimary: '#EAF2FF',
      textSecondary: '#899BC1',
      accent: '#5dadec',
      border: '#1F293A',
      barStyle: 'light-content',
    },
  },
  {
    name: 'Starry Night',
    colors: {
      bgPrimary: '#04091A',
      bgSecondary: '#0E1735',
      textPrimary: '#F5EEDD',
      textSecondary: '#A8B8D0',
      accent: '#3d85c6',
      border: '#212C4A',
      barStyle: 'light-content',
    },
  },
  {
    name: 'Midnight Bloom',
    colors: {
      bgPrimary: '#10141C',
      bgSecondary: '#222B3A',
      textPrimary: '#D8DCE2',
      textSecondary: '#6B788E',
      accent: '#A2B2C8',
      border: '#2E3A4E',
      barStyle: 'light-content',
    },
  },
  {
    name: 'Verdant Peace',
    colors: {
      bgPrimary: '#051F20',
      bgSecondary: '#0B2B26',
      textPrimary: '#f7faf8ff',
      textSecondary: '#DAF1DE',
      accent: '#8EB69B',
      border: '#163832',
      barStyle: 'light-content',
    },
  },
  {
    name: 'Lavender Night',
    colors: {
      bgPrimary: '#000000',
      bgSecondary: '#121212',
      textPrimary: '#EAE6F3',
      textSecondary: '#A098B5',
      accent: '#8B70C2',
      border: '#1F1D2B',
      barStyle: 'light-content',
    },
  },
  {
    name: 'Deep Ocean',
    colors: {
      bgPrimary: '#0A1928',
      bgSecondary: '#10253A',
      textPrimary: '#E1EAF2',
      textSecondary: '#88A0B8',
      accent: '#38CCBD',
      border: '#1A3651',
      barStyle: 'light-content',
    },
  },
  {
    name: 'GreenWood',
    colors: {
      bgPrimary: '#121A16',
      bgSecondary: '#1B2621',
      textPrimary: '#E8EAE4',
      textSecondary: '#909893',
      accent: '#58A375',
      border: '#2A3A33',
      barStyle: 'light-content',
    },
  },
];
const colorOptions = [
  { key: 'accent', label: 'Accent' },
  { key: 'bgPrimary', label: 'Primary BG' },
  { key: 'bgSecondary', label: 'Secondary BG' },
  { key: 'textPrimary', label: 'Primary Text' },
  { key: 'textSecondary', label: 'Secondary Text' },
  { key: 'border', label: 'Borders' },
];
const displaySettingsConfig = [
  { key: 'showArabic', label: 'Arabic Text', fontKey: 'arabic' },
  {
    key: 'showTranslationEn',
    label: 'English Translation',
    fontKey: 'translationEn',
  },
  {
    key: 'showTransliterationEn',
    label: 'English Transliteration',
    fontKey: 'transliterationEn',
  },
  {
    key: 'showTranslationUr',
    label: 'Urdu Translation',
    fontKey: 'translationUr',
  },
  {
    key: 'showTransliterationUr',
    label: 'Urdu Transliteration',
    fontKey: 'transliterationUr',
  },
];

const ThemeCard = ({ preset, onPress, isSelected, SIZES }) => {
  const cardStyles = getCardStyles({
    colors: preset.colors,
    isSelected,
    SIZES,
  });
  return (
    <TouchableOpacity onPress={onPress} style={cardStyles.container}>
      {isSelected && (
        <View style={cardStyles.checkContainer}>
          <Icon
            type="materialcommunity"
            name="check"
            size={SIZES.width * 0.035}
            color="#FFFFFF"
          />
        </View>
      )}
      <View style={cardStyles.previewContainer}>
        <View style={cardStyles.mainPreview}>
          <View style={cardStyles.body}>
            <View style={cardStyles.accentCircle} />
            <View style={cardStyles.textLine1} />
            <View style={cardStyles.textLine2} />
          </View>
        </View>
      </View>
      <View style={cardStyles.labelContainer}>
        <Text style={cardStyles.labelText} numberOfLines={1}>
          {preset.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const DisplaySettingRow = ({
  label,
  isEnabled,
  fontSize,
  onToggle,
  onSizeChange,
  colors,
  fontPixel,
  SIZES,
}) => {
  const styles = getStyles({ colors, fontPixel, SIZES, fontSizes: {} });
  return (
    <View style={styles.displayRow}>
      <TouchableOpacity style={styles.displayRowToggle} onPress={onToggle}>
        <View
          style={[
            styles.checkbox,
            isEnabled && {
              backgroundColor: colors.accent,
              borderColor: colors.accent,
            },
          ]}
        >
          {isEnabled && (
            <Icon
              type="materialcommunity"
              name="check"
              size={fontPixel(16)}
              color={colors.bgPrimary}
            />
          )}
        </View>
        <Text style={styles.checkboxLabel}>{label}</Text>
      </TouchableOpacity>
      <View style={styles.stepper}>
        <TouchableOpacity
          onPress={() => onSizeChange('decrement')}
          style={styles.stepperButton}
        >
          <Icon
            type="materialcommunity"
            name="minus"
            size={fontPixel(18)}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <Text style={styles.stepperValue}>{fontSize}</Text>
        <TouchableOpacity
          onPress={() => onSizeChange('increment')}
          style={styles.stepperButton}
        >
          <Icon
            type="materialcommunity"
            name="plus"
            size={fontPixel(18)}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Theme = () => {
  const {
    colors,
    fontSizes,
    displayOptions,
    updateTheme,
    updateFontSizes,
    updateDisplayOptions,
    fontPixel,
    SIZES,
  } = useStyle();

  const [editingColorKey, setEditingColorKey] = useState(null);
  const flatListRef = useRef(null);



  useEffect(() => {
    const selectedIndex = presets.findIndex(
      p => JSON.stringify(p.colors) === JSON.stringify(colors.colors),
    );
    if (selectedIndex > -1 && flatListRef.current) {
      const timer = setTimeout(() => {
        flatListRef.current.scrollToIndex({
          animated: true,
          index: selectedIndex,
          viewPosition: 0.5,
        });
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [colors]);

  const handleLiveThemeUpdate = newColor => {
    if (!editingColorKey) return;
    const isDark = isColorDark(newColor);
    const updatedColors = {
      ...colors.colors,
      [editingColorKey]: newColor,
      ...(editingColorKey === 'bgPrimary' && {
        barStyle: isDark ? 'light-content' : 'dark-content',
      }),
    };
    updateTheme({ ...colors, colors: updatedColors });
  };

  const handleTextInputThemeUpdate = newColor => {
    if (!editingColorKey) return;
    const isDark = isColorDark(newColor);
    const updatedColors = {
      ...colors.colors,
      [editingColorKey]: newColor,
      ...(editingColorKey === 'bgPrimary' && {
        barStyle: isDark ? 'light-content' : 'dark-content',
      }),
    };
    updateTheme({ ...colors, colors: updatedColors });
  };

  const isColorDark = hexColor => {
    try {
      if (!hexColor || typeof hexColor !== 'string') return true;
      const r = parseInt(hexColor.substr(1, 2), 16);
      const g = parseInt(hexColor.substr(3, 2), 16);
      const b = parseInt(hexColor.substr(5, 2), 16);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq < 128;
    } catch (e) {
      return true;
    }
  };

  const handleDisplayOptionChange = key => {
    const newOptions = { ...displayOptions, [key]: !displayOptions[key] };
    updateDisplayOptions(newOptions);
  };

  const handleFontSizeChange = (fontKey, direction) => {
    const currentSize = fontSizes[fontKey];
    const newSize =
      direction === 'increment' ? currentSize + 1 : currentSize - 1;
    const MIN_SIZE = 12;
    const MAX_SIZE = fontKey === 'arabic' ? 40 : 24;

    if (newSize >= MIN_SIZE && newSize <= MAX_SIZE) {
      updateFontSizes({ ...fontSizes, [fontKey]: newSize });
    }
  };

  const toggleColorEditor = key => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setEditingColorKey(prevKey => (prevKey === key ? null : key));
  };

  const styles = getStyles({
    colors: colors.colors,
    fontPixel,
    SIZES,
    fontSizes,
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <StatusBar
        barStyle={colors.colors.barStyle || 'dark-content'}
        backgroundColor={colors.colors.bgPrimary}
      />
      <ScrollView
        overScrollMode="never"
        bounces={false}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Editor</Text>
          <View style={styles.settingsCard}>
            {colorOptions.map(opt => (
              <View key={opt.key}>
                <TouchableOpacity
                  style={styles.editorRow}
                  onPress={() => toggleColorEditor(opt.key)}
                >
                  <View style={styles.editorRowLeft}>
                    <View
                      style={[
                        styles.editorSwatch,
                        { backgroundColor: colors.colors[opt.key] },
                      ]}
                    />
                    <Text style={styles.editorLabel}>{opt.label}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      style={styles.editorInput}
                      value={colors.colors[opt.key]}
                      onChangeText={newColor =>
                        handleTextInputThemeUpdate(newColor)
                      }
                      autoCapitalize="none"
                    />
                    <Icon
                      type="materialcommunity"
                      name={
                        editingColorKey === opt.key
                          ? 'chevron-up'
                          : 'chevron-down'
                      }
                      size={fontPixel(24)}
                      color={colors.colors.textSecondary}
                    />
                  </View>
                </TouchableOpacity>
                {editingColorKey === opt.key && (
                  <View style={styles.colorPickerContainer}>
                    <ColorPicker
                      color={colors.colors[editingColorKey]}
                      onColorChangeComplete={handleLiveThemeUpdate}
                      thumbSize={SIZES.width * 0.07}
                      sliderSize={SIZES.width * 0.07}
                      noSnap={true}
                      row={false}
                      swatches={false}
                    />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Presets</Text>
          <FlatList
            overScrollMode="never"
            bounces={false}
            ref={flatListRef}
            data={presets}
            renderItem={({ item }) => {
              const isSelected =
                JSON.stringify(colors.colors) === JSON.stringify(item.colors);
              return (
                <ThemeCard
                  preset={item}
                  isSelected={isSelected}
                  onPress={() =>
                    updateTheme({ ...colors, colors: item.colors })
                  }
                  SIZES={SIZES}
                />
              );
            }}
            keyExtractor={item => item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            getItemLayout={(data, index) => ({
              length: SIZES.width * 0.4 + SIZES.width * 0.04,
              offset: (SIZES.width * 0.4 + SIZES.width * 0.04) * index,
              index,
            })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewVerseNumber}>1:1</Text>
              <Icon
                type="materialcommunity"
                name="bookmark-outline"
                size={fontPixel(24)}
                color={colors.colors.accent}
              />
            </View>
            {displayOptions.showArabic && (
              <Text
                style={[
                  styles.previewArabic,
                  { fontSize: fontPixel(fontSizes.arabic) },
                ]}
              >
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </Text>
            )}
            {displayOptions.showTranslationEn && (
              <Text
                style={[
                  styles.previewText,
                  { fontSize: fontPixel(fontSizes.translationEn) },
                ]}
              >
                In the name of Allah, the Most Gracious, the Most Merciful.
              </Text>
            )}
            {displayOptions.showTransliterationEn && (
              <Text
                style={[
                  styles.previewText,
                  styles.previewTransliteration,
                  { fontSize: fontPixel(fontSizes.transliterationEn) },
                ]}
              >
                Bismillāhi r-raḥmāni r-raḥīm.
              </Text>
            )}
            {displayOptions.showTranslationUr && (
              <Text
                style={[
                  styles.previewUrdu,
                  { fontSize: fontPixel(fontSizes.translationUr) },
                ]}
              >
                شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔
              </Text>
            )}
            {displayOptions.showTransliterationUr && (
              <Text
                style={[
                  styles.previewText,
                  styles.previewTransliteration,
                  { fontSize: fontPixel(fontSizes.transliterationUr) },
                ]}
              >
                Shuru Allah ke naam se jo bara meherban nehayat reham wala hai.
              </Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display & Font Options</Text>
          <View style={styles.settingsCard}>
            {displaySettingsConfig.map(setting => (
              <DisplaySettingRow
                key={setting.key}
                label={setting.label}
                isEnabled={displayOptions[setting.key]}
                fontSize={fontSizes[setting.fontKey]}
                onToggle={() => handleDisplayOptionChange(setting.key)}
                onSizeChange={dir => handleFontSizeChange(setting.fontKey, dir)}
                colors={colors.colors}
                fontPixel={fontPixel}
                SIZES={SIZES}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = ({ colors, fontPixel, SIZES, fontSizes }) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.bgPrimary },
    container: { paddingBottom: SIZES.height * 0.04 },
    section: { marginTop: SIZES.height * 0.03 },
    sectionTitle: {
      color: colors.textPrimary,
      fontSize: fontPixel(20),
      fontWeight: '700',
      marginBottom: SIZES.height * 0.015,
      paddingHorizontal: SIZES.width * 0.04,
    },
    horizontalList: { paddingHorizontal: SIZES.width * 0.04 },
    settingsCard: {
      backgroundColor: colors.bgSecondary,
      borderRadius: 16,
      marginHorizontal: SIZES.width * 0.04,
      paddingHorizontal: SIZES.width * 0.04,
      paddingVertical: SIZES.height * 0.01,
    },

    editorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: SIZES.height * 0.015,
    },
    editorRowLeft: { flexDirection: 'row', alignItems: 'center' },
    editorSwatch: {
      width: SIZES.width * 0.07,
      height: SIZES.width * 0.07,
      borderRadius: SIZES.width * 0.035,
      borderWidth: 2,
      borderColor: colors.border,
    },
    editorLabel: {
      color: colors.textPrimary,
      fontSize: fontPixel(16),
      marginLeft: SIZES.width * 0.04,
    },
    editorInput: {
      color: colors.textSecondary,
      fontSize: fontPixel(14),
      padding: 0,
      marginRight: SIZES.width * 0.03,
    },
    colorPickerContainer: {
      height: SIZES.width * 0.6,
      alignSelf: 'center',
      width: '100%',
      paddingVertical: SIZES.height * 0.02,
    },

    previewCard: {
      backgroundColor: colors.bgSecondary,
      borderRadius: 16,
      marginHorizontal: SIZES.width * 0.04,
      paddingVertical: SIZES.height * 0.02,
      paddingHorizontal: SIZES.width * 0.04,
    },
    previewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SIZES.height * 0.02,
    },
    previewVerseNumber: {
      color: colors.textSecondary,
      fontSize: fontPixel(14),
      fontWeight: 'bold',
    },
    previewArabic: {
      fontFamily: 'PDMSSALEEMQURANFONTQESHIP0',
      color: colors.textPrimary,
      textAlign: 'right',
      marginBottom: SIZES.height * 0.01,
      lineHeight: fontPixel((fontSizes?.arabic || 28) * 1.5),
    },
    previewText: {
      color: colors.textPrimary,
      marginBottom: SIZES.height * 0.01,
      lineHeight: fontPixel((fontSizes?.translationEn || 16) * 1.5),
    },
    previewTransliteration: {
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    previewUrdu: {
      fontFamily: 'NotoNastaliqUrdu-Regular',
      color: colors.textSecondary,
      textAlign: 'right',
      marginBottom: SIZES.height * 0.01,
      lineHeight: fontPixel((fontSizes?.translationUr || 18) * 1.7),
    },

    displayRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: SIZES.height * 0.01,
    },
    displayRowToggle: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    checkbox: {
      width: SIZES.width * 0.06,
      height: SIZES.width * 0.06,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxLabel: {
      color: colors.textPrimary,
      fontSize: fontPixel(16),
      marginLeft: SIZES.width * 0.04,
    },

    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.bgPrimary,
      borderRadius: 8,
    },
    stepperButton: { padding: SIZES.width * 0.025 },
    stepperValue: {
      color: colors.textPrimary,
      fontSize: fontPixel(16),
      fontWeight: '600',
      minWidth: SIZES.width * 0.08,
      textAlign: 'center',
    },
  });

const getCardStyles = ({ colors, isSelected, SIZES }) =>
  StyleSheet.create({
    container: {
      width: SIZES.width * 0.4,
      marginRight: SIZES.width * 0.04,
      borderRadius: 16,
      backgroundColor: colors.bgSecondary,
      borderWidth: 2,
      borderColor: isSelected ? colors.accent : colors.border,
      overflow: 'hidden',
    },
    previewContainer: { padding: 8 },
    mainPreview: {
      height: 140,
      borderRadius: 12,
      backgroundColor: colors.bgPrimary,
      overflow: 'hidden',
    },
    accentCircle: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.accent,
      marginBottom: 12,
    },
    body: { padding: 8 },
    textLine1: {
      height: 10,
      width: '70%',
      borderRadius: 5,
      backgroundColor: colors.textPrimary,
      marginBottom: 8,
    },
    textLine2: {
      height: 10,
      width: '50%',
      borderRadius: 5,
      backgroundColor: colors.textSecondary,
    },
    labelContainer: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: colors.bgSecondary,
      borderTopWidth: 1,
      borderColor: colors.border,
    },
    labelText: { color: colors.textPrimary, fontWeight: '600' },
    checkContainer: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: colors.accent,
      width: SIZES.width * 0.05,
      height: SIZES.width * 0.05,
      borderRadius: SIZES.width * 0.03,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      elevation: 5,
    },
  });

export default Theme;
