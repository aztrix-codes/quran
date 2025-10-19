import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useStyle } from '../Context/StyleContext';
import { useSurahData } from '../Hooks/useSurahData';
import Icon from '../Components/Icon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Word = ({ text, colors, fontPixel, SIZES, fontSizes }) => {
  const styles = getStyles({ colors, fontPixel, SIZES, fontSizes });
  return <Text style={styles.verseArabicWord}>{text}</Text>;
};

const VerseItem = ({ item: verse, verseNumber }) => {
  const { colors, fontSizes, displayOptions, fontPixel, SIZES } = useStyle();
  const styles = getStyles({
    colors: colors.colors,
    fontPixel,
    SIZES,
    fontSizes,
  });

  return (
    <View style={styles.verseCard}>
      <View style={styles.verseHeader}>
        <Text style={styles.verseNumber}>{verseNumber}</Text>
        <Icon
          type="materialcommunity"
          name="bookmark-plus-outline"
          size={fontPixel(22)}
          color={colors.colors.textSecondary}
        />
      </View>
      {displayOptions.showArabic && (
        <View style={styles.arabicContainer}>
          {verse.segement.map((word, index) => (
            <Word
              key={index}
              text={word}
              colors={colors.colors}
              fontPixel={fontPixel}
              SIZES={SIZES}
              fontSizes={fontSizes}
            />
          ))}
        </View>
      )}
      {displayOptions.showTranslationUr && (
        <Text style={styles.verseUrdu}>{verse.translationUr}</Text>
      )}
      {displayOptions.showTransliterationEn && (
        <Text style={styles.verseTransliteration}>
          {verse.transilerationEn}
        </Text>
      )}
      {displayOptions.showTranslationEn && (
        <Text style={styles.verseTranslation}>{verse.translationEn}</Text>
      )}
    </View>
  );
};

const SurahPage = ({ item: surah }) => {
  const { colors, fontPixel, SIZES, fontSizes } = useStyle();
  const styles = getStyles({
    colors: colors.colors,
    fontPixel,
    SIZES,
    fontSizes,
  });

  const Bismillah = () => (
    <View style={styles.bismillahContainer}>
      <Text style={styles.bismillahText}>
        بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
      </Text>
    </View>
  );

  return (
    <View style={styles.surahPageContainer}>
      <FlatList
        data={surah.verses}
        keyExtractor={verse => verse.id.toString()}
        ListHeaderComponent={surah.bismillah_pre ? <Bismillah /> : null}
        renderItem={({ item, index }) => (
          <VerseItem item={item} verseNumber={`${surah.id}:${index + 1}`} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.verseListContainer}
      />
    </View>
  );
};

const FooterControls = ({
  onPrevious,
  onNext,
  isBeginning,
  isEnd,
  isPlaying,
  onPlayPause,
}) => {
  const { colors, fontPixel, SIZES, fontSizes } = useStyle();
  const styles = getStyles({
    colors: colors.colors,
    fontPixel,
    SIZES,
    fontSizes,
  });

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.footerActionButton}>
        <Icon
          type="materialcommunity"
          name="cog-outline"
          size={fontPixel(22)}
          color={colors.colors.textSecondary}
        />
      </TouchableOpacity>
      <View style={styles.mainControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onPrevious}
          disabled={isBeginning}
        >
          <Icon
            type="materialcommunity"
            name="skip-previous"
            size={fontPixel(30)}
            color={
              isBeginning ? colors.colors.border : colors.colors.textPrimary
            }
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playButton} onPress={onPlayPause}>
          <Icon
            type="feather"
            name={isPlaying ? 'pause' : 'play'}
            size={fontPixel(24)}
            color={colors.colors.bgPrimary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onNext}
          disabled={isEnd}
        >
          <Icon
            type="materialcommunity"
            name="skip-next"
            size={fontPixel(30)}
            color={isEnd ? colors.colors.border : colors.colors.textPrimary}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.footerActionButton}>
        <Icon
          type="materialcommunity"
          name="playlist-music-outline"
          size={fontPixel(24)}
          color={colors.colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
};

const Player = ({ route, navigation }) => {
  const { surahId = 1 } = route.params || {};
  const allSurahData = useSurahData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const horizontalListRef = useRef(null);

  useEffect(() => {
    if (allSurahData.length > 0) {
      const initialIndex = allSurahData.findIndex(s => s.id === surahId);
      if (initialIndex !== -1) {
        setCurrentIndex(initialIndex);
      }
    }
  }, [surahId, allSurahData]);

  const HeaderTitle = ({ surah }) => {
    const { colors, fontPixel, SIZES, fontSizes } = useStyle();
    const styles = getStyles({
      colors: colors.colors,
      fontPixel,
      SIZES,
      fontSizes,
    });
    return (
      <View>
        <Text style={styles.headerTitleArabic}>{surah.name}</Text>
        <Text style={styles.headerTitleTransliteration}>
          {surah.transliteration}
        </Text>
      </View>
    );
  };

  const HeaderRight = ({ surah }) => {
    const { colors, fontPixel, SIZES, fontSizes } = useStyle();
    const styles = getStyles({
      colors: colors.colors,
      fontPixel,
      SIZES,
      fontSizes,
    });
    return (
      <View style={styles.headerRightContainer}>
        <Text style={styles.headerRightText}>
          {surah.id}:{surah.total_verses}
        </Text>
        <Icon
          type="materialcommunity"
          name="dots-vertical"
          size={fontPixel(22)}
          color={colors.colors.textSecondary}
        />
      </View>
    );
  };

  useEffect(() => {
    if (allSurahData.length > 0 && allSurahData[currentIndex]) {
      const currentSurah = allSurahData[currentIndex];
      navigation.setOptions({
        headerTitle: () => <HeaderTitle surah={currentSurah} />,
        headerRight: () => <HeaderRight surah={currentSurah} />,
      });
    }
  }, [currentIndex, allSurahData, navigation]);

  const handleNext = () => {
    if (currentIndex < allSurahData.length - 1) {
      const nextIndex = currentIndex + 1;
      horizontalListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      horizontalListRef.current?.scrollToIndex({
        index: prevIndex,
        animated: true,
      });
      setCurrentIndex(prevIndex);
    }
  };

  const getItemLayout = useCallback(
    (data, index) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    [],
  );

  if (allSurahData.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={horizontalListRef}
        data={allSurahData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <SurahPage item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        initialScrollIndex={currentIndex}
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={e => {
          const newIndex = Math.round(
            e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
          );
          setCurrentIndex(newIndex);
        }}
      />
      <FooterControls
        onPrevious={handlePrevious}
        onNext={handleNext}
        isBeginning={currentIndex === 0}
        isEnd={currentIndex === allSurahData.length - 1}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
      />
    </View>
  );
};

const getStyles = ({ colors, fontPixel, SIZES, fontSizes }) =>
  StyleSheet.create({
    headerTitleArabic: {
      color: colors.textPrimary,
      fontSize: fontPixel(20),
      textAlign: 'center',
    },
    headerTitleTransliteration: {
      color: colors.textSecondary,
      fontSize: fontPixel(12),
      textAlign: 'center',
    },
    headerRightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerRightText: {
      color: colors.textSecondary,
      fontSize: fontPixel(14),
      fontWeight: '600',
    },
    surahPageContainer: {
      width: SCREEN_WIDTH,
      flex: 1,
      backgroundColor: colors.bgPrimary,
    },
    verseListContainer: {
      paddingHorizontal: SIZES.width * 0.04,
      paddingBottom: SIZES.height * 0.15,
    },
    verseCard: {
      paddingVertical: SIZES.height * 0.02,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    verseHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SIZES.height * 0.02,
    },
    verseNumber: {
      color: colors.accent,
      fontSize: fontPixel(14),
      fontWeight: '600',
    },
    arabicContainer: {
      flexDirection: 'row-reverse',
      flexWrap: 'wrap',
      marginBottom: SIZES.height * 0.015,
    },
    verseArabicWord: {
      fontSize: fontPixel(fontSizes.arabic),
      color: colors.textPrimary,
      margin: 2,
    },
    verseUrdu: {
      fontSize: fontPixel(fontSizes.translationUr),
      color: colors.textPrimary,
      textAlign: 'right',
      lineHeight: fontPixel(fontSizes.translationUr * 1.8),
      fontFamily: 'NotoNastaliqUrdu-Regular',
      marginBottom: SIZES.height * 0.015,
    },
    verseTransliteration: {
      fontSize: fontPixel(fontSizes.transliterationEn),
      color: colors.textSecondary,
      fontStyle: 'italic',
      lineHeight: fontPixel(fontSizes.transliterationEn * 1.5),
      marginBottom: SIZES.height * 0.01,
    },
    verseTranslation: {
      fontSize: fontPixel(fontSizes.translationEn),
      color: colors.textPrimary,
      lineHeight: fontPixel(fontSizes.translationEn * 1.5),
    },
    bismillahContainer: {
      paddingVertical: SIZES.height * 0.03,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    bismillahText: {
      fontSize: fontPixel(24),
      color: colors.accent,
    },
    footerContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.bgSecondary,
      borderTopWidth: 1,
      borderColor: colors.border,
      paddingBottom: SIZES.height * 0.02,
      paddingHorizontal: SIZES.width * 0.04,
    },
    mainControls: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: SIZES.height * 0.01,
    },
    footerActionButton: {
      position: 'absolute',
      bottom: SIZES.height * 0.04,
      padding: SIZES.width * 0.02,
    },
    mainControls: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    controlButton: {
      padding: SIZES.width * 0.03,
    },
    playButton: {
      backgroundColor: colors.accent,
      width: SIZES.width * 0.14,
      height: SIZES.width * 0.14,
      borderRadius: SIZES.width * 0.07,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default Player;