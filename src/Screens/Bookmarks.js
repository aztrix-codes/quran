import React, { useState, useMemo } from 'react';
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
import { useStyle } from '../Context/StyleContext';
import { useSurahData } from '../Hooks/useSurahData';
import Icon from '../Components/Icon';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DUMMY_BOOKMARKS = [
  { id: 1, surahId: 2, verseId: 255 },
  { id: 2, surahId: 18, verseId: 10 },
  { id: 3, surahId: 114, verseId: 1 },
];

const BookmarkItem = ({
  item,
  colors,
  fontPixel,
  SIZES,
  onPress,
  onRemovePress,
  isConfirming,
  onConfirmDelete,
  onCancelDelete,
}) => {
  const styles = getStyles({ colors, fontPixel, SIZES });

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
            {`Surah ${item.surahId}:${item.verseId} - ${item.surahName}`}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actionsContainer}>
        {isConfirming ? (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={handleConfirmPress}
            >
              <Icon
                type="feather"
                name="check"
                size={fontPixel(18)}
                color={'#4CAF50'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancelPress}
            >
              <Icon
                type="feather"
                name="x"
                size={fontPixel(18)}
                color={'#F44336'}
              />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleRemovePress}
          >
            <Icon
              type="feather"
              name="x-circle"
              size={fontPixel(18)}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const Bookmarks = ({ navigation }) => {
  const { colors, fontPixel, SIZES } = useStyle();
  const [bookmarks, setBookmarks] = useState(DUMMY_BOOKMARKS);
  const [itemToConfirmDelete, setItemToConfirmDelete] = useState(null);
  const allSurahData = useSurahData();

  const processedBookmarks = useMemo(() => {
    if (allSurahData.length === 0) return [];
    return bookmarks.map(bookmark => {
      const surahInfo = allSurahData.find(s => s.id === bookmark.surahId);
      return {
        ...bookmark,
        surahName: surahInfo ? surahInfo.transliteration : '',
        arabicName: surahInfo ? surahInfo.name : '',
      };
    });
  }, [bookmarks, allSurahData]);

  const handleNavigation = item => {
    navigation.navigate('Player', {
      surahId: item.surahId,
      verseId: item.verseId,
    });
  };

  const handleRemove = id => {
    setBookmarks(prev => prev.filter(item => item.id !== id));
    setItemToConfirmDelete(null);
  };

  const styles = getStyles({ colors: colors.colors, fontPixel, SIZES });

  return (
    <View style={styles.container}>
      <FlatList
        data={processedBookmarks}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <BookmarkItem
            item={item}
            colors={colors.colors}
            fontPixel={fontPixel}
            SIZES={SIZES}
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
              size={fontPixel(50)}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>No Bookmarks Yet</Text>
            <Text style={styles.emptySubtext}>
              You can add bookmarks from the player screen.
            </Text>
          </View>
        }
        contentContainerStyle={
          bookmarks.length === 0
            ? styles.emptyListContainer
            : styles.listContentContainer
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const getStyles = ({ colors, fontPixel, SIZES }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgPrimary,
    },
    listContentContainer: {
      padding: SIZES.width * 0.04,
    },
    emptyListContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyText: {
      color: colors.textPrimary,
      fontSize: fontPixel(18),
      fontWeight: '600',
      marginTop: 16,
    },
    emptySubtext: {
      color: colors.textSecondary,
      fontSize: fontPixel(14),
      marginTop: 4,
    },
    cardContainer: {
      backgroundColor: colors.bgSecondary,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: SIZES.width * 0.04,
    },
    cardPressable: {
      flex: 1,
      paddingVertical: SIZES.height * 0.015,
    },
    textContainer: {
      flex: 1,
    },
    titleText: {
      color: colors.accent,
      fontSize: fontPixel(20),
      marginBottom: 3,
      textAlign: 'left',
    },
    subtitleText: {
      color: colors.textSecondary,
      fontSize: fontPixel(12),
    },
    actionsContainer: {
      flexDirection: 'row',
      paddingHorizontal: SIZES.width * 0.03,
    },
    actionButton: {
      padding: SIZES.width * 0.02,
    },
    confirmButton: {
      marginRight: SIZES.width * 0.01,
    },
    cancelButton: {
      marginLeft: SIZES.width * 0.01,
    },
    separator: {
      height: SIZES.height * 0.015,
    },
  });

export default Bookmarks;
