import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useStyle } from '../Context/StyleContext';
import { useSurahData } from '../Hooks/useSurahData';
import Icon from '../Components/Icon';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const sajdahVerses = new Set(['7:206', '13:15', '16:50', '17:109', '19:58', '22:18', '25:60', '27:26', '32:15', '38:24', '41:38', '53:62', '84:21', '96:19']);
const toUrduNumerals = num => {
  const urduNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).split('').map(digit => urduNumbers[parseInt(digit)] || digit).join('');
};
const formatTime = seconds => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const VerseItem = memo(({ item: verse, verseNumber, surahId }) => {
  const { colors, fontSizes, displayOptions, fontPixel, SIZES } = useStyle();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const styles = getStyles({ colors: colors.colors, fontPixel, SIZES, fontSizes });
  const isSajdah = sajdahVerses.has(`${surahId}:${verse.id}`);

  return (
    <Pressable style={styles.verseCard}>
      <View style={styles.verseHeader}>
        <Text style={styles.verseNumber}>{verseNumber}</Text>
        {isSajdah && <Text style={styles.sajdahText}>سجدہ</Text>}
        <TouchableOpacity onPress={() => setIsBookmarked(!isBookmarked)}>
          <Icon
            name={isBookmarked ? 'bookmark-check' : 'bookmark-outline'}
            type="materialcommunity"
            size={fontPixel(24)}
            color={colors.colors.accent}
          />
        </TouchableOpacity>
      </View>
      {displayOptions.showArabic && (
        <Text style={styles.verseArabic}>
          {verse.segement.join(' ')}
          <Text style={styles.arabicVerseEnd}>{` \u06DD${toUrduNumerals(verse.id)}`}</Text>
        </Text>
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
    </Pressable>
  );
});

const SurahPage = memo(({ item: surah }) => {
  const { colors, fontPixel, SIZES, fontSizes } = useStyle();
  const styles = getStyles({ colors: colors.colors, fontPixel, SIZES, fontSizes });

  const Bismillah = () => (
    <View style={styles.headerFrame}>
      <View style={styles.bismillahContainer}>
        <Text style={styles.bismillahText}>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.surahPageContainer}>
      <FlatList bounces={false} overScrollMode='never'
        data={surah.verses}
        keyExtractor={v => v.id.toString()}
        ListHeaderComponent={surah.bismillah_pre ? <Bismillah /> : null}
        renderItem={({ item, index }) => (
          <VerseItem item={item} surahId={surah.id} verseNumber={`${surah.id}:${index + 1}`} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.verseListContainer}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
});

const FooterControls = ({ onPrevious, onNext, isBeginning, isEnd, isPlaying, onPlayPause }) => {
  const { colors, fontPixel, SIZES, fontSizes } = useStyle();
  const styles = getStyles({ colors: colors.colors, fontPixel, SIZES, fontSizes });

  return (
    <View style={styles.footerContainer}>
       <View style={styles.sliderContainer}>
        <View style={styles.sliderTrack}>
          <View style={styles.sliderProgress} />
        </View>
      </View>
      <View style={styles.sliderRow}>
        <Text style={styles.timeText}>{formatTime(100)}</Text>
        <Text style={styles.timeText}>{formatTime(350)}</Text>
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.controlButton}>
          <MaterialIcon name="replay-10" size={fontPixel(28)} color={colors.colors.textSecondary}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={onPrevious} disabled={isBeginning}>
          <Icon name="skip-previous" type="materialcommunity" size={fontPixel(32)} color={isBeginning ? colors.colors.border : colors.colors.textPrimary}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={onPlayPause}>
          <MaterialIcon name={isPlaying ? 'pause' : 'play-arrow'} size={fontPixel(38)} color={colors.colors.accent}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={onNext} disabled={isEnd}>
          <Icon name="skip-next" type="materialcommunity" size={fontPixel(32)} color={isEnd ? colors.colors.border : colors.colors.textPrimary}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <MaterialIcon name="forward-10" size={fontPixel(28)} color={colors.colors.textSecondary}/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Player = ({ route, navigation }) => {
  const { surahId = 1 } = route.params || {};
  const allSurahData = useSurahData();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const horizontalListRef = useRef(null);

  useEffect(() => {
    if (allSurahData.length > 0) {
      const initialIndex = allSurahData.findIndex(s => s.id === surahId);
      if (initialIndex !== -1) {
        setCurrentIndex(initialIndex);
      } else {
        setCurrentIndex(0);
      }
      setIsDataReady(true);
    }
  }, [surahId, allSurahData]);

  useEffect(() => {
    if (isDataReady && currentIndex !== -1 && horizontalListRef.current) {
      setTimeout(() => {
        horizontalListRef.current?.scrollToIndex({
          index: currentIndex,
          animated: false,
        });
      }, 0);
    }
  }, [isDataReady, currentIndex]);


  const HeaderTitle = ({ surah }) => {
    const { colors, fontPixel, SIZES, fontSizes } = useStyle();
    const styles = getStyles({ colors: colors.colors, fontPixel, SIZES, fontSizes });
    if (!surah) return null;
    return (
      <View style={{ alignItems: 'center', flexDirection:'row-reverse', justifyContent:'center' , gap: fontPixel(8)}}>
        <Text style={styles.headerTitleArabic}>{surah.name}</Text>
        <Text style={styles.headerTitleTransliteration}>•</Text>
        <Text style={styles.headerTitleTransliteration}>{surah.transliteration}</Text>
      </View>
    );
  };

  const HeaderRight = ({ surah }) => {
    const { colors, fontPixel, SIZES, fontSizes } = useStyle();
    const styles = getStyles({ colors: colors.colors, fontPixel, SIZES, fontSizes });
    if (!surah) return null;
    return (
      <Text style={styles.headerRightText}>{surah.id}:{surah.total_verses}</Text>
    );
  };

  useEffect(() => {
    if (isDataReady && allSurahData.length > 0 && currentIndex !== -1 && allSurahData[currentIndex]) {
      const currentSurah = allSurahData[currentIndex];
      navigation.setOptions({
        headerTitle: () => <HeaderTitle surah={currentSurah} />,
        headerRight: () => <HeaderRight surah={currentSurah} />,
      });
    } else {
      navigation.setOptions({ headerTitle: 'Loading...', headerRight: () => null });
    }
  }, [currentIndex, allSurahData, navigation, isDataReady]);

  const handleNext = () => {
    if (currentIndex < allSurahData.length - 1) {
      const nextIndex = currentIndex + 1;
      horizontalListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      horizontalListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
      setCurrentIndex(prevIndex);
    }
  };

  const getItemLayout = useCallback(
    (data, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index }),
    []
  );

  if (!isDataReady || currentIndex === -1) {
    const { colors } = useStyle();
    const styles = getStyles({ colors: colors.colors, fontPixel: () => {}, SIZES: {}, fontSizes: {} });
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.colors.accent} />
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
        getItemLayout={getItemLayout}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.bgPrimary,
    },
    surahPageContainer: { width: SCREEN_WIDTH, flex: 1, backgroundColor: colors.bgPrimary },
    verseListContainer: {  paddingBottom: SIZES.height * 0.07 },
    verseCard: { paddingVertical: SIZES.height * 0.02, paddingHorizontal: SIZES.width * 0.03, borderBottomWidth: 1, borderBottomColor: colors.border },
    verseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.height * 0.02 },
    verseNumber: { color: colors.textSecondary, fontSize: fontPixel(14), fontWeight: 'bold' },
    sajdahText: { color: colors.accent, fontSize: fontPixel(16), fontWeight: 'bold', position: 'absolute', left: '50%', transform: [{ translateX: -fontPixel(16) }] },
    verseArabic: { fontSize: fontPixel(fontSizes.arabic), color: colors.textPrimary, textAlign: 'right', lineHeight: fontPixel(fontSizes.arabic * 1.8), marginBottom: SIZES.height * 0.015 },
    arabicVerseEnd: { fontSize: fontPixel(18), color: colors.accent, textAlign: 'left' },
    verseUrdu: { fontSize: fontPixel(fontSizes.translationUr), color: colors.textSecondary, lineHeight: fontPixel(fontSizes.translationUr * 1.7), textAlign: 'right', fontFamily: 'NotoNastaliqUrdu-Regular', marginBottom: SIZES.height * 0.02 },
    verseTranslation: { fontSize: fontPixel(fontSizes.translationEn), color: colors.textPrimary, lineHeight: fontPixel(fontSizes.translationEn * 1.5), textAlign: 'left', marginBottom: SIZES.height * 0.01 },
    verseTransliteration: { fontSize: fontPixel(fontSizes.transliterationEn), color: colors.textSecondary, lineHeight: fontPixel(fontSizes.transliterationEn * 1.5), fontStyle: 'italic', textAlign: 'left', marginBottom: SIZES.height * 0.02 },
    headerFrame: { marginVertical: SIZES.height * 0.01, padding: 3, borderWidth: 1, borderColor: colors.border },
    bismillahContainer: { paddingVertical: SIZES.height * 0.01, paddingHorizontal: SIZES.width * 0.05, backgroundColor: colors.bgSecondary, borderWidth: 1, borderColor: colors.border },
    bismillahText: { fontSize: fontPixel(22), color: colors.textPrimary, textAlign: 'center' },
    headerTitleArabic: { color: colors.textPrimary, fontSize: fontPixel(22), textAlign: 'center' },
    headerTitleTransliteration: { color: colors.textPrimary, fontSize: fontPixel(16), textAlign: 'center'},
    headerRightText: { color: colors.textSecondary, fontSize: fontPixel(16), fontWeight: '600', paddingRight: SIZES.width * 0.03 },
    footerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.bgSecondary, borderTopWidth: 1, borderColor: colors.border, justifyContent: 'center', paddingBottom: SIZES.height * 0.005 },
    sliderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SIZES.width * 0.04, paddingTop: SIZES.height * 0.01 },
    sliderContainer: { width: '100%', alignItems: 'center' },
    sliderTrack: { width: '100%', height: 3, borderRadius: 2, backgroundColor: colors.border },
    sliderProgress: { width: '30%', height: 3, borderRadius: 2, backgroundColor: colors.accent },
    timeText: { color: colors.textSecondary, fontSize: fontPixel(12) },
    controlsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: -SIZES.width * 0.055, paddingHorizontal: SIZES.width * 0.2 },
    controlButton: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SIZES.width * 0.01 },
  });

export default Player;

