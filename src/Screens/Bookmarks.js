import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStyle } from '../Context/StyleContext';
import { useSurahData } from '../Hooks/useSurahData';
import Icon from '../Components/Icon';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BookmarkItem = ({
  item,
  colors,
  fontPixel,
  SIZES,
  fontSizes,
  onPress,
  onRemovePress,
  isConfirming,
  onConfirmDelete,
  onCancelDelete,
}) => {
  const styles = getStyles({ colors, fontPixel, SIZES, fontSizes });

  const handleRemovePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onRemovePress(item.id);
  };

  const handleCancelPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onCancelDelete();
  };

  const handleConfirmPress = () => {
    onConfirmDelete(item.id);
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.cardPressable} onPress={onPress}>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{item.arabicName}</Text>
          <Text style={styles.subtitleText}>
            {`${item.surahName}, ${item.surahId}:${item.verseId}`}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.actionsContainer}>
        {isConfirming ? (
          <>
            <TouchableOpacity
              style={[styles.pillButton, styles.confirmPillButton]}
              onPress={handleConfirmPress}
            >
              <Text style={[styles.pillButtonText, styles.confirmPillText]}>
                Confirm
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pillButton, styles.cancelPillButton]}
              onPress={handleCancelPress}
            >
              <Text style={[styles.pillButtonText, styles.cancelPillText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.pillButton, styles.removeButton]}
            onPress={handleRemovePress}
          >
            <Text style={[styles.pillButtonText, styles.removeButtonText]}>
              Remove
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const Bookmarks = ({ navigation }) => {
  const { colors, fontPixel, SIZES, fontSizes } = useStyle();
  const allSurahData = useSurahData();
  const [bookmarks, setBookmarks] = useState([]);
  const [itemToConfirmDelete, setItemToConfirmDelete] = useState(null);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const storedBookmarks = await AsyncStorage.getItem('bookmarks');
        const bookmarkList = storedBookmarks ? JSON.parse(storedBookmarks) : [];
        setBookmarks(bookmarkList);
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };
    loadBookmarks();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: `Bookmarks (${bookmarks.length})`,
    });
  }, [navigation, bookmarks.length]);

  const processedBookmarks = useMemo(() => {
    if (allSurahData.length === 0) return bookmarks;
    return bookmarks.map(bookmark => ({
      ...bookmark,
      surahName:
        allSurahData.find(s => s.id === bookmark.surahId)?.transliteration ||
        'Unknown',
      arabicName:
        allSurahData.find(s => s.id === bookmark.surahId)?.name || 'غير معروف',
    }));
  }, [bookmarks, allSurahData]);

  const handleNavigation = item => {
    navigation.navigate('Player', {
      surahId: item.surahId,
      verseId: item.verseId,
    });
  };

  const handleRemove = async id => {
    try {
      const updatedBookmarks = bookmarks.filter(item => item.id !== id);
      await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      setBookmarks(updatedBookmarks);
      setItemToConfirmDelete(null);
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const styles = getStyles({ colors, fontPixel, SIZES, fontSizes });

  return (
    <View style={styles.container}>
      <FlatList
        data={processedBookmarks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BookmarkItem
            item={item}
            colors={colors}
            fontPixel={fontPixel}
            SIZES={SIZES}
            fontSizes={fontSizes}
            onPress={() => handleNavigation(item)}
            onRemovePress={setItemToConfirmDelete}
            isConfirming={itemToConfirmDelete === item.id}
            onConfirmDelete={handleRemove}
            onCancelDelete={() => setItemToConfirmDelete(null)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon
              type="feather"
              name="bookmark"
              size={fontPixel(48)}
              color={colors.colors.textSecondary}
            />
            <Text style={styles.emptyText}>No Bookmarks Yet</Text>
            <Text style={styles.emptySubtext}>
              Add bookmarks from the Player screen.
            </Text>
          </View>
        }
        contentContainerStyle={
          processedBookmarks.length === 0
            ? styles.emptyListContainer
            : styles.listContentContainer
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const getStyles = ({ colors, fontPixel, SIZES, fontSizes }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.colors.bgPrimary,
    },
    listContentContainer: {
      paddingHorizontal: SIZES.width * 0.04,
      paddingVertical: SIZES.height * 0.01,
      paddingBottom: SIZES.height * 0.1,
    },
    emptyListContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: SIZES.width * 0.1,
      opacity: 0.8,
    },
    emptyText: {
      color: colors.colors.textPrimary,
      fontSize: fontPixel(fontSizes.translationEn + 2),
      fontWeight: '600',
      marginTop: SIZES.height * 0.03,
      textAlign: 'center',
    },
    emptySubtext: {
      color: colors.colors.textSecondary,
      fontSize: fontPixel(fontSizes.translationEn - 2),
      marginTop: SIZES.height * 0.01,
      textAlign: 'center',
      opacity: 0.8,
    },
    cardContainer: {
      backgroundColor: colors.colors.bgSecondary,
      borderRadius: 16,
      paddingVertical: SIZES.height * 0.01,
      paddingHorizontal: SIZES.width * 0.03,
      marginVertical: SIZES.height * 0.008,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors.colors.border,
    },
    cardPressable: {
      flex: 1,
    },
    textContainer: {
      flex: 1,
      marginRight: SIZES.width * 0.03,
    },
    titleText: {
      color: colors.colors.textPrimary,
      fontSize: fontPixel(22),
      fontWeight: '500',
      textAlign: 'left',
    },
    subtitleText: {
      color: colors.colors.textSecondary,
      fontSize: fontPixel(14),
      textAlign: 'left',
    },
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    pillButton: {
      borderRadius: 24,
      paddingVertical: SIZES.height * 0.005,
      paddingHorizontal: SIZES.width * 0.03,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: SIZES.width * 0.01,
      borderWidth: 1,
    },
    pillButtonText: {
      fontSize: fontPixel(fontSizes.translationEn - 2),
      fontWeight: '400',
    },
    removeButton: {
      backgroundColor: 'transparent',
      borderColor: colors.colors.textSecondary,
    },
    removeButtonText: {
      color: colors.colors.textSecondary,
    },
    confirmPillButton: {
      backgroundColor: colors.colors.accent,
      borderColor: colors.colors.accent,
    },
    confirmPillText: {
      color: colors.colors.bgPrimary,
    },
    cancelPillButton: {
      backgroundColor: 'transparent',
      borderColor: colors.colors.textSecondary,
    },
    cancelPillText: {
      color: colors.colors.textSecondary,
    },
  });

export default Bookmarks;