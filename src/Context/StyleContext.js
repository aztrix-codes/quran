import React, { createContext, useState, useEffect, useContext } from 'react';
import { Dimensions, PixelRatio } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'userTheme';
const FONT_SIZES_KEY = 'userFontSizes';
const DISPLAY_OPTIONS_KEY = 'userDisplayOptions';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const fontPixel = size => {
  const scale = SCREEN_WIDTH / 380;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const SIZES = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};

const initialColors = {
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
};

const initialFontSizes = {
  arabic: 24,
  translationEn: 14,
  transliterationEn: 14,
  translationUr: 14,
  transliterationUr: 14,
};

const initialDisplayOptions = {
  showArabic: true,
  showTranslationEn: true,
  showTransliterationEn: false,
  showTranslationUr: true,
  showTransliterationUr: false,
};

const defaultContextValue = {
  colors: initialColors,
  fontSizes: initialFontSizes,
  displayOptions: initialDisplayOptions,
  updateTheme: () => {},
  updateFontSizes: () => {},
  updateDisplayOptions: () => {},
  resetSettings: () => {},
  fontPixel: fontPixel,
  SIZES: SIZES,
};

export const StyleContext = createContext(defaultContextValue);

export const ThemeProvider = ({ children }) => {
  const [colors, setColors] = useState(initialColors);
  const [fontSizes, setFontSizes] = useState(initialFontSizes);
  const [displayOptions, setDisplayOptions] = useState(initialDisplayOptions);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [savedTheme, savedFontSizes, savedDisplayOptions] =
          await AsyncStorage.multiGet([
            THEME_KEY,
            FONT_SIZES_KEY,
            DISPLAY_OPTIONS_KEY,
          ]);

        if (savedTheme[1]) setColors(JSON.parse(savedTheme[1]));
        if (savedFontSizes[1]) setFontSizes(JSON.parse(savedFontSizes[1]));
        if (savedDisplayOptions[1])
          setDisplayOptions(JSON.parse(savedDisplayOptions[1]));
      } catch (error) {
        console.error('Failed to load settings from storage.', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadSettings();
  }, []);

  const updateTheme = async newThemeColors => {
    setColors(newThemeColors);
    try {
      await AsyncStorage.setItem(THEME_KEY, JSON.stringify(newThemeColors));
    } catch (error) {
      console.error('Failed to save theme.', error);
    }
  };

  const updateFontSizes = async newFontSizes => {
    setFontSizes(newFontSizes);
    try {
      await AsyncStorage.setItem(FONT_SIZES_KEY, JSON.stringify(newFontSizes));
    } catch (error) {
      console.error('Failed to save font sizes.', error);
    }
  };

  const updateDisplayOptions = async newDisplayOptions => {
    setDisplayOptions(newDisplayOptions);
    try {
      await AsyncStorage.setItem(
        DISPLAY_OPTIONS_KEY,
        JSON.stringify(newDisplayOptions),
      );
    } catch (error) {
      console.error('Failed to save display options.', error);
    }
  };

  const resetSettings = async () => {
    setColors(initialColors);
    setFontSizes(initialFontSizes);
    setDisplayOptions(initialDisplayOptions);
    try {
      await AsyncStorage.multiRemove([
        THEME_KEY,
        FONT_SIZES_KEY,
        DISPLAY_OPTIONS_KEY,
      ]);
    } catch (error) {
      console.error('Failed to reset settings.', error);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <StyleContext.Provider
      value={{
        colors,
        fontSizes,
        displayOptions,
        updateTheme,
        updateFontSizes,
        updateDisplayOptions,
        resetSettings,
        fontPixel,
        SIZES,
      }}
    >
      {children}
    </StyleContext.Provider>
  );
};

export const useStyle = () => useContext(StyleContext);
