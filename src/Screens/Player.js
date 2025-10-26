import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Pressable,
  Animated,
} from 'react-native';
import TrackPlayer, {
  useProgress,
  Event,
  State,
  usePlaybackState,
} from 'react-native-track-player';
import { useStyle } from '../Context/StyleContext';
import { useSurahData } from '../Hooks/useSurahData';
import Icon from '../Components/Icon';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const surahAudioMap = {
  1: require('../../assets/surahs/surah_1.mp3'),
  2: require('../../assets/surahs/surah_2.mp3'),
  3: require('../../assets/surahs/surah_3.mp3'),
  4: require('../../assets/surahs/surah_4.mp3'),
  5: require('../../assets/surahs/surah_5.mp3'),
  6: require('../../assets/surahs/surah_6.mp3'),
  7: require('../../assets/surahs/surah_7.mp3'),
  8: require('../../assets/surahs/surah_8.mp3'),
  9: require('../../assets/surahs/surah_9.mp3'),
  10: require('../../assets/surahs/surah_10.mp3'),
  11: require('../../assets/surahs/surah_11.mp3'),
  12: require('../../assets/surahs/surah_12.mp3'),
  13: require('../../assets/surahs/surah_13.mp3'),
  14: require('../../assets/surahs/surah_14.mp3'),
  15: require('../../assets/surahs/surah_15.mp3'),
  16: require('../../assets/surahs/surah_16.mp3'),
  17: require('../../assets/surahs/surah_17.mp3'),
  18: require('../../assets/surahs/surah_18.mp3'),
  19: require('../../assets/surahs/surah_19.mp3'),
  20: require('../../assets/surahs/surah_20.mp3'),
  21: require('../../assets/surahs/surah_21.mp3'),
  22: require('../../assets/surahs/surah_22.mp3'),
  23: require('../../assets/surahs/surah_23.mp3'),
  24: require('../../assets/surahs/surah_24.mp3'),
  25: require('../../assets/surahs/surah_25.mp3'),
  26: require('../../assets/surahs/surah_26.mp3'),
  27: require('../../assets/surahs/surah_27.mp3'),
  28: require('../../assets/surahs/surah_28.mp3'),
  29: require('../../assets/surahs/surah_29.mp3'),
  30: require('../../assets/surahs/surah_30.mp3'),
  31: require('../../assets/surahs/surah_31.mp3'),
  32: require('../../assets/surahs/surah_32.mp3'),
  33: require('../../assets/surahs/surah_33.mp3'),
  34: require('../../assets/surahs/surah_34.mp3'),
  35: require('../../assets/surahs/surah_35.mp3'),
  36: require('../../assets/surahs/surah_36.mp3'),
  37: require('../../assets/surahs/surah_37.mp3'),
  38: require('../../assets/surahs/surah_38.mp3'),
  39: require('../../assets/surahs/surah_39.mp3'),
  40: require('../../assets/surahs/surah_40.mp3'),
  41: require('../../assets/surahs/surah_41.mp3'),
  42: require('../../assets/surahs/surah_42.mp3'),
  43: require('../../assets/surahs/surah_43.mp3'),
  44: require('../../assets/surahs/surah_44.mp3'),
  45: require('../../assets/surahs/surah_45.mp3'),
  46: require('../../assets/surahs/surah_46.mp3'),
  47: require('../../assets/surahs/surah_47.mp3'),
  48: require('../../assets/surahs/surah_48.mp3'),
  49: require('../../assets/surahs/surah_49.mp3'),
  50: require('../../assets/surahs/surah_50.mp3'),
  51: require('../../assets/surahs/surah_51.mp3'),
  52: require('../../assets/surahs/surah_52.mp3'),
  53: require('../../assets/surahs/surah_53.mp3'),
  54: require('../../assets/surahs/surah_54.mp3'),
  55: require('../../assets/surahs/surah_55.mp3'),
  56: require('../../assets/surahs/surah_56.mp3'),
  57: require('../../assets/surahs/surah_57.mp3'),
  58: require('../../assets/surahs/surah_58.mp3'),
  59: require('../../assets/surahs/surah_59.mp3'),
  60: require('../../assets/surahs/surah_60.mp3'),
  61: require('../../assets/surahs/surah_61.mp3'),
  62: require('../../assets/surahs/surah_62.mp3'),
  63: require('../../assets/surahs/surah_63.mp3'),
  64: require('../../assets/surahs/surah_64.mp3'),
  65: require('../../assets/surahs/surah_65.mp3'),
  66: require('../../assets/surahs/surah_66.mp3'),
  67: require('../../assets/surahs/surah_67.mp3'),
  68: require('../../assets/surahs/surah_68.mp3'),
  69: require('../../assets/surahs/surah_69.mp3'),
  70: require('../../assets/surahs/surah_70.mp3'),
  71: require('../../assets/surahs/surah_71.mp3'),
  72: require('../../assets/surahs/surah_72.mp3'),
  73: require('../../assets/surahs/surah_73.mp3'),
  74: require('../../assets/surahs/surah_74.mp3'),
  75: require('../../assets/surahs/surah_75.mp3'),
  76: require('../../assets/surahs/surah_76.mp3'),
  77: require('../../assets/surahs/surah_77.mp3'),
  78: require('../../assets/surahs/surah_78.mp3'),
  79: require('../../assets/surahs/surah_79.mp3'),
  80: require('../../assets/surahs/surah_80.mp3'),
  81: require('../../assets/surahs/surah_81.mp3'),
  82: require('../../assets/surahs/surah_82.mp3'),
  83: require('../../assets/surahs/surah_83.mp3'),
  84: require('../../assets/surahs/surah_84.mp3'),
  85: require('../../assets/surahs/surah_85.mp3'),
  86: require('../../assets/surahs/surah_86.mp3'),
  87: require('../../assets/surahs/surah_87.mp3'),
  88: require('../../assets/surahs/surah_88.mp3'),
  89: require('../../assets/surahs/surah_89.mp3'),
  90: require('../../assets/surahs/surah_90.mp3'),
  91: require('../../assets/surahs/surah_91.mp3'),
  92: require('../../assets/surahs/surah_92.mp3'),
  93: require('../../assets/surahs/surah_93.mp3'),
  94: require('../../assets/surahs/surah_94.mp3'),
  95: require('../../assets/surahs/surah_95.mp3'),
  96: require('../../assets/surahs/surah_96.mp3'),
  97: require('../../assets/surahs/surah_97.mp3'),
  98: require('../../assets/surahs/surah_98.mp3'),
  99: require('../../assets/surahs/surah_99.mp3'),
  100: require('../../assets/surahs/surah_100.mp3'),
  101: require('../../assets/surahs/surah_101.mp3'),
  102: require('../../assets/surahs/surah_102.mp3'),
  103: require('../../assets/surahs/surah_103.mp3'),
  104: require('../../assets/surahs/surah_104.mp3'),
  105: require('../../assets/surahs/surah_105.mp3'),
  106: require('../../assets/surahs/surah_106.mp3'),
  107: require('../../assets/surahs/surah_107.mp3'),
  108: require('../../assets/surahs/surah_108.mp3'),
  109: require('../../assets/surahs/surah_109.mp3'),
  110: require('../../assets/surahs/surah_110.mp3'),
  111: require('../../assets/surahs/surah_111.mp3'),
  112: require('../../assets/surahs/surah_112.mp3'),
  113: require('../../assets/surahs/surah_113.mp3'),
  114: require('../../assets/surahs/surah_114.mp3'),
};

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

const VerseItem = memo(({ item: verse, verseNumber, surahId, active, activeSegmentIndex, onPressVerse, allSurahData }) => {
  const { colors, fontSizes, displayOptions, fontPixel, SIZES } = useStyle();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const styles = getStyles({ colors: colors.colors, fontPixel, SIZES, fontSizes });
  const isSajdah = sajdahVerses.has(`${surahId}:${verse.id}`);

  const segments = verse?.segment ?? [];
  const transliteration = verse?.transliterationEn ?? '';
  const urduTransliteration = verse?.urduTansilerationEn ?? '';

  useEffect(() => {
    const checkBookmark = async () => {
      try {
        const bookmarks = await AsyncStorage.getItem('bookmarks');
        const bookmarkList = bookmarks ? JSON.parse(bookmarks) : [];
        const isBookmarked = bookmarkList.some(
          bookmark => bookmark.surahId === surahId && bookmark.verseId === verse.id
        );
        setIsBookmarked(isBookmarked);
      } catch (error) {
        console.error('Error checking bookmark:', error);
      }
    };
    checkBookmark();
  }, [surahId, verse.id]);

  const toggleBookmark = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('bookmarks');
      let bookmarkList = bookmarks ? JSON.parse(bookmarks) : [];
      const surahInfo = allSurahData.find(s => s.id === surahId);
      const bookmark = {
        id: `${surahId}:${verse.id}`,
        surahId,
        verseId: verse.id,
        verseNumber,
        arabicName: surahInfo?.name || '',
        surahName: surahInfo?.transliteration || '',
        arabicText: segments.join(' '),
        translationUr: verse.translationUr || '',
        translationEn: verse.translationEn || '',
        transliterationEn: transliteration,
        timestamp: new Date().toISOString(),
      };

      if (isBookmarked) {
        bookmarkList = bookmarkList.filter(
          b => !(b.surahId === surahId && b.verseId === verse.id)
        );
      } else {
        bookmarkList.push(bookmark);
      }

      await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarkList));
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };


  return (
    <Pressable style={[styles.verseCard, active && styles.activeVerseCard]} onPress={() => onPressVerse && onPressVerse(verse)}>
      <View style={styles.verseHeader}>
        <Text style={styles.verseNumber}>{verseNumber}</Text>
        {isSajdah && <Text style={styles.sajdahText}>سجدہ</Text>}
        <TouchableOpacity onPress={toggleBookmark}>
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
          {segments.map((seg, idx) => (
            <Text
              key={idx}
              style={active && idx === activeSegmentIndex ? styles.activeSegment : null}
            >
              {seg}{' '}
            </Text>
          ))}
          <Text style={styles.arabicVerseEnd}>{` \u06DD${toUrduNumerals(verse.id)}`}</Text>
        </Text>
      )}
      {displayOptions.showTranslationUr && (
        <Text style={styles.verseUrdu}>{verse.translationUr}</Text>
      )}
      {displayOptions.showTransliterationEn && (
        <Text style={styles.verseTransliteration}>{transliteration}</Text>
      )}
      {displayOptions.showTranslationEn && (
        <Text style={styles.verseTranslation}>{verse.translationEn}</Text>
      )}
      {displayOptions.showTransliterationUr && urduTransliteration && (
        <Text style={styles.verseUrduTransliteration}>{urduTransliteration}</Text>
      )}
    </Pressable>
  );
});

const FooterControls = ({
  onPrevious,
  onNext,
  isBeginning,
  isEnd,
  isPlaying,
  onPlayPause,
  position,
  duration,
  onNavigateBookmarks,
  onNavigateTheme,
}) => {
  const { colors, fontPixel, SIZES, fontSizes } = useStyle();
  const styles = getStyles({ colors: colors.colors, fontPixel, SIZES, fontSizes });
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let progressPercentage = 0;
    if (duration > 0) {
      progressPercentage = (position / duration) * 100;
    }
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 50,
      useNativeDriver: false,
    }).start();
  }, [position, duration, progressAnim]);

  const handleSeekPress = async (e) => {
    const x = e.nativeEvent.locationX;
    const newPosition = (x / SCREEN_WIDTH) * duration;
    await TrackPlayer.seekTo(newPosition / 1000);
  };

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity onPress={handleSeekPress} activeOpacity={0.7}>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <Animated.View
              style={[styles.sliderProgress, {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                })
              }]}
            />
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.sliderRow}>
        <Text style={styles.timeText}>{formatTime(position / 1000)}</Text>
        <Text style={styles.timeText}>{formatTime(duration / 1000)}</Text>
      </View>
      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.controlButton} onPress={onNavigateTheme}>
          <Icon
            name="palette"
            type="materialcommunity"
            size={fontPixel(26)}
            color={colors.colors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={onPrevious} disabled={isBeginning}>
          <Icon
            name="skip-previous"
            type="materialcommunity"
            size={fontPixel(32)}
            color={isBeginning ? colors.colors.border : colors.colors.textPrimary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={onPlayPause}>
          <MaterialIcon
            name={isPlaying ? 'pause' : 'play-arrow'}
            size={fontPixel(38)}
            color={colors.colors.accent}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={onNext} disabled={isEnd}>
          <Icon
            name="skip-next"
            type="materialcommunity"
            size={fontPixel(32)}
            color={isEnd ? colors.colors.border : colors.colors.textPrimary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={onNavigateBookmarks}>
          <Icon
            name="bookmarks"
            type="MaterialIcons"
            size={fontPixel(24)}
            color={colors.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Bismillah = memo(({ styles }) => (
  <View style={styles.headerFrame}>
    <View style={styles.bismillahContainer}>
      <Text style={styles.bismillahText}>
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </Text>
    </View>
  </View>
));

const ShimmerLine = ({ style }) => {
  const { colors } = useStyle();
  const animatedValue = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [-1, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View
      style={[
        {
          overflow: 'hidden',
          backgroundColor: colors.colors.border || '#e0e0e0',
          borderRadius: 4,
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          ...StyleSheet.absoluteFill,
          backgroundColor: colors.colors.bgSecondary || '#f0f0f0',
          opacity: 0.5,
          transform: [{ translateX }],
        }}
      />
    </View>
  );
};

const PlayerShimmer = ({ surahId, allSurahData }) => {
  const { colors, fontPixel, SIZES, fontSizes } = useStyle();
  const styles = getStyles({
    colors: colors.colors,
    fontPixel,
    SIZES,
    fontSizes,
  });

  const surahInfo = allSurahData?.find(s => s.id === surahId);
  const bismillah_pre = surahInfo?.bismillah_pre ?? surahId !== 9;
  const verseCount = surahInfo?.total_verses ?? 10;

  return (
    <View style={{ flex: 1, backgroundColor: colors.colors.bgPrimary }}>
      <FlatList
        data={Array.from({ length: verseCount })}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={bismillah_pre ? <Bismillah styles={styles} /> : null}
        renderItem={() => (
          <View style={styles.verseCard}>
            <View style={styles.verseHeader}>
              <ShimmerLine
                style={{ width: fontPixel(30), height: fontPixel(20) }}
              />
              <ShimmerLine
                style={{
                  width: fontPixel(50),
                  height: fontPixel(20),
                  position: 'absolute',
                  left: '50%',
                }}
              />
              <ShimmerLine
                style={{ width: fontPixel(24), height: fontPixel(24) }}
              />
            </View>
            <ShimmerLine
              style={{
                height: fontPixel(fontSizes.arabic || 24),
                width: '100%',
                marginBottom: SIZES.height * 0.015,
              }}
            />
            <ShimmerLine
              style={{
                height: fontPixel(fontSizes.translationUr || 20),
                width: '90%',
                alignSelf: 'flex-end',
                marginBottom: SIZES.height * 0.02,
              }}
            />
            <ShimmerLine
              style={{
                height: fontPixel(fontSizes.transliterationEn || 18),
                width: '80%',
                marginBottom: SIZES.height * 0.02,
              }}
            />
            <ShimmerLine
              style={{
                height: fontPixel(fontSizes.translationEn || 18),
                width: '95%',
                marginBottom: SIZES.height * 0.01,
              }}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.verseListContainer}
      />
    </View>
  );
};


const Player = ({ route, navigation }) => {
  const { surahId = 1, verseId } = route.params || {};
  const allSurahData = useSurahData();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isTrackActive, setIsTrackActive] = useState(false);
  const [activeVerseId, setActiveVerseId] = useState(null);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(-1);
  const [wasPlaying, setWasPlaying] = useState(false);
  const [initialVerseId, setInitialVerseId] = useState(verseId || null);
  const [isLoading, setIsLoading] = useState(true);

  const verticalListRef = useRef(null);
  const lastActiveVerseRef = useRef(null);
  const scrollRetry = useRef(null);

  const playbackState = usePlaybackState();
  const { position, duration } = useProgress(50);
  const { colors, fontPixel, SIZES, fontSizes } = useStyle();
  const styles = getStyles({
    colors: colors.colors,
    fontPixel,
    SIZES,
    fontSizes,
  });

  const isPlaying =
    playbackState.state === State.Playing ||
    playbackState.state === State.Buffering;

  const createPlaylist = useCallback(() => {
    return allSurahData.map(surah => ({
      id: `surah-${surah.id}`,
      url: surahAudioMap[surah.id],
      title: surah.name,
      artist: 'Quran',
      duration:
        (surah.verse_timings[surah.verse_timings.length - 1]?.end || 0) / 1000,
    }));
  }, [allSurahData]);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      const setupPlayer = async () => {
        try {
          await TrackPlayer.reset();
          const playlist = createPlaylist();
          if (playlist.length === 0) {
            console.error('Playlist is empty, cannot setup player.');
            setIsLoading(false);
            return;
          }
          const initialIndex = allSurahData.findIndex(s => s.id === surahId);
          await TrackPlayer.add(playlist);
          await TrackPlayer.skip(initialIndex !== -1 ? initialIndex : 0);
          setCurrentIndex(initialIndex !== -1 ? initialIndex : 0);
          setIsTrackActive(true);
          setWasPlaying(false);
          setIsLoading(false);
        } catch (error) {
          console.error('Error setting up player:', error);
          setIsLoading(false);
        }
      };

      if (isDataReady && allSurahData.length > 0) {
        setupPlayer();
      }

      return () => {
        TrackPlayer.stop();
        TrackPlayer.reset();
        setIsTrackActive(false);
        setWasPlaying(false);
        if (scrollRetry.current) {
          clearTimeout(scrollRetry.current);
          scrollRetry.current = null;
        }
      };
    }, [isDataReady, allSurahData, surahId, createPlaylist])
  );

  useEffect(() => {
    const listener = TrackPlayer.addEventListener(
      Event.PlaybackQueueEnded,
      async () => {
        if (currentIndex < allSurahData.length - 1 && wasPlaying) {
          await TrackPlayer.skipToNext();
          await TrackPlayer.play();
          setCurrentIndex(currentIndex + 1);
        }
      }
    );
    return () => listener.remove();
  }, [currentIndex, allSurahData.length, wasPlaying]);

  useEffect(() => {
    const listener = TrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      async ({ index }) => {
        if (index !== undefined && index !== currentIndex) {
          setCurrentIndex(index);
          setActiveVerseId(null);
          setActiveSegmentIndex(-1);
        }
      }
    );
    return () => listener.remove();
  }, [currentIndex]);

  useEffect(() => {
    if (allSurahData.length > 0) {
      const initialIndex = allSurahData.findIndex(s => s.id === surahId);
      setCurrentIndex(initialIndex !== -1 ? initialIndex : 0);
      setIsDataReady(true);
    }
  }, [surahId, allSurahData]);

  useEffect(() => {
    if (isDataReady && currentIndex !== -1 && initialVerseId) {
      setActiveVerseId(initialVerseId);
    }
  }, [isDataReady, currentIndex, initialVerseId]);

  useEffect(() => {
    if (initialVerseId && verticalListRef.current && !isLoading) {
      const currentSurah = allSurahData[currentIndex];
      if (scrollRetry.current) clearTimeout(scrollRetry.current);

      if (initialVerseId === 1 && currentSurah?.bismillah_pre) {
        scrollRetry.current = setTimeout(() => {
          verticalListRef.current?.scrollToOffset({
            offset: 0,
            animated: true,
          });
          setInitialVerseId(null);
          scrollRetry.current = null;
        }, 300);
      } else {
        const index = initialVerseId - 1;
        if (index >= 0) {
          scrollRetry.current = setTimeout(() => {
            verticalListRef.current?.scrollToIndex({
              index,
              animated: true,
              viewPosition: 0,
            });
            setInitialVerseId(null);
            scrollRetry.current = null;
          }, 300);
        } else {
           setInitialVerseId(null);
        }
      }
    }
    return () => {
        if (scrollRetry.current) {
            clearTimeout(scrollRetry.current);
            scrollRetry.current = null;
        }
    };
  }, [initialVerseId, isLoading, currentIndex, allSurahData]);

  useEffect(() => {
    if (isPlaying && activeVerseId && verticalListRef.current && !initialVerseId) {
      const currentSurah = allSurahData[currentIndex];
       if (scrollRetry.current) clearTimeout(scrollRetry.current);

      if (activeVerseId === 1 && currentSurah?.bismillah_pre) {
        verticalListRef.current.scrollToOffset({
          offset: 0,
          animated: true,
        });
      } else {
        const index = activeVerseId - 1;
        if (index >= 0) {
          verticalListRef.current.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0,
          });
        }
      }
    }
  }, [activeVerseId, isPlaying, currentIndex, allSurahData, initialVerseId]);

  useEffect(() => {
    if (allSurahData[currentIndex] && position > 0 && isPlaying) {
      const surah = allSurahData[currentIndex];
      const hasPreamble = surah.bismillah_pre && surah.id !== 1;
      const adjustedPosition = hasPreamble
        ? Math.max(0, position * 1000 - 6000)
        : position * 1000;

      if (hasPreamble && position * 1000 < 6000) {
        if (activeVerseId !== null || activeSegmentIndex !== -1) {
          setActiveVerseId(null);
          setActiveSegmentIndex(-1);
        }
        return;
      }

      const verseTiming = surah.verse_timings.find(
        vt => adjustedPosition >= vt.start && adjustedPosition < vt.end
      );
      const newActiveVerseId = verseTiming ? verseTiming.id : null;

      if (newActiveVerseId !== lastActiveVerseRef.current) {
        setActiveVerseId(newActiveVerseId);
        lastActiveVerseRef.current = newActiveVerseId;
      }

      let newActiveSegmentIndex = -1;
      if (newActiveVerseId) {
        const verse = surah.verses.find(v => v.id === newActiveVerseId);
        if (verse && verse.segment_timings) {
          const segmentTiming = verse.segment_timings.find(
            st => adjustedPosition >= st.start && adjustedPosition < st.end
          );
          newActiveSegmentIndex = segmentTiming
            ? verse.segment_timings.findIndex(st => st.id === segmentTiming.id)
            : -1;
        }
      }

      if (newActiveSegmentIndex !== activeSegmentIndex) {
        setActiveSegmentIndex(newActiveSegmentIndex);
      }
    }
  }, [
    position,
    currentIndex,
    allSurahData,
    activeVerseId,
    activeSegmentIndex,
    isPlaying,
  ]);

  const handleVersePress = useCallback(
    async verse => {
      const surah = allSurahData[currentIndex];
      const hasPreamble = surah.bismillah_pre && surah.id !== 1;
      const verseTiming = surah.verse_timings.find(vt => vt.id === verse.id);

      if (verseTiming) {
        const seekPosition = hasPreamble
          ? (verseTiming.start + 6000) / 1000
          : verseTiming.start / 1000;
        try {
          await TrackPlayer.seekTo(seekPosition);
          if (!isPlaying) {
            await TrackPlayer.play();
            setWasPlaying(true);
          }
        } catch (error) {
          console.error('Verse Press Seek Error:', error);
        }
      }
    },
    [currentIndex, allSurahData, isPlaying]
  );

  const HeaderTitle = ({ surah }) => {
    if (!surah) return null;
    return (
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitleArabic}>{surah.name}</Text>
        <Text style={styles.headerTitleTransliteration}>•</Text>
        <Text style={styles.headerTitleTransliteration}>
          {surah.transliteration}
        </Text>
      </View>
    );
  };

  const HeaderRight = ({ surah }) => {
    if (!surah) return null;
    return (
      <View style={styles.headerRightContainer}>
        <Text style={styles.headerRightText}>
          {surah.id}:{surah.total_verses}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    if (
      isDataReady &&
      allSurahData.length > 0 &&
      currentIndex !== -1 &&
      allSurahData[currentIndex]
    ) {
      const currentSurah = allSurahData[currentIndex];
      navigation.setOptions({
        headerTitle: () => <HeaderTitle surah={currentSurah} />,
        headerRight: () => <HeaderRight surah={currentSurah} />,
      });
    } else {
      navigation.setOptions({
        headerTitle: 'Loading...',
        headerRight: () => null,
      });
    }
  }, [currentIndex, allSurahData, navigation, isDataReady]);

  const handleNext = useCallback(async () => {
    if (currentIndex < allSurahData.length - 1) {
      setIsLoading(true);
      await TrackPlayer.skipToNext();
      setWasPlaying(isPlaying);
      setIsLoading(false);
    }
  }, [currentIndex, allSurahData.length, isPlaying]);

  const handlePrevious = useCallback(async () => {
    if (currentIndex > 0) {
      setIsLoading(true);
      await TrackPlayer.skipToPrevious();
      setWasPlaying(isPlaying);
      setIsLoading(false);
    }
  }, [currentIndex, isPlaying]);

  const handlePlayPause = useCallback(async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
      setWasPlaying(false);
    } else {
      await TrackPlayer.play();
      setWasPlaying(true);
    }
  }, [isPlaying]);

  const handleNavigateBookmarks = useCallback(() => {
    navigation.navigate('Bookmarks');
  }, [navigation]);

  const handleNavigateTheme = useCallback(() => {
    navigation.navigate('Theme');
  }, [navigation]);

  const handleScrollToIndexFailed = useCallback((info) => {
    console.warn(`ScrollToIndex failed to reach index ${info.index}. Retrying...`);
    if (scrollRetry.current) {
      clearTimeout(scrollRetry.current);
    }
    scrollRetry.current = setTimeout(() => {
      if (verticalListRef.current) {
         if (info.index === 0 && allSurahData[currentIndex]?.bismillah_pre) {
             verticalListRef.current.scrollToOffset({ offset: 0, animated: true });
         } else {
             verticalListRef.current.scrollToIndex({
               index: info.index,
               animated: true,
               viewPosition: 0,
             });
         }
      }
      scrollRetry.current = null;
    }, 250); 
  }, [allSurahData, currentIndex]);

  useEffect(() => {
    return () => {
      if (scrollRetry.current) {
        clearTimeout(scrollRetry.current);
      }
    };
  }, []);

  const currentSurah = allSurahData[currentIndex];

  if (isLoading || !isDataReady || !currentSurah) {
    return <PlayerShimmer surahId={surahId} allSurahData={allSurahData} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.colors.bgPrimary }}>
      <FlatList
        ref={verticalListRef}
        data={currentSurah.verses}
        keyExtractor={v => v.id.toString()}
        ListHeaderComponent={currentSurah.bismillah_pre ? <Bismillah styles={styles} /> : null}
        renderItem={({ item, index }) => (
          <VerseItem
            item={item}
            surahId={currentSurah.id}
            verseNumber={`${currentSurah.id}:${index + 1}`}
            active={item.id === activeVerseId}
            activeSegmentIndex={activeSegmentIndex}
            onPressVerse={handleVersePress}
            allSurahData={allSurahData}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.verseListContainer}
        initialNumToRender={286}      
        maxToRenderPerBatch={50}     
        windowSize={50}              
        onScrollToIndexFailed={handleScrollToIndexFailed}
      />
      <FooterControls
        onPrevious={handlePrevious}
        onNext={handleNext}
        isBeginning={currentIndex === 0}
        isEnd={currentIndex === allSurahData.length - 1}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        position={position * 1000}
        duration={duration * 1000}
        onNavigateBookmarks={handleNavigateBookmarks}
        onNavigateTheme={handleNavigateTheme}
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
      backgroundColor: colors.bgPrimary || '#fff',
    },
    verseListContainer: { paddingBottom: SIZES.height * 0.07 },
    verseCard: { paddingVertical: SIZES.height * 0.02, paddingHorizontal: SIZES.width * 0.03, borderBottomWidth: 1, borderBottomColor: colors.border || '#e0e0e0' },
    activeVerseCard: { backgroundColor: colors.bgSecondary || '#f0f0f0' },
    verseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.height * 0.02 },
    verseNumber: { color: colors.textSecondary || '#666', fontSize: fontPixel(14), fontWeight: 'bold' },
    sajdahText: { color: colors.accent || '#007AFF', fontSize: fontPixel(16), fontWeight: 'bold', position: 'absolute', left: '50%', transform: [{ translateX: -fontPixel(16) }] },
    verseArabic: { fontSize: fontPixel(fontSizes.arabic || 24), color: colors.textPrimary || '#000', textAlign: 'right', lineHeight: fontPixel((fontSizes.arabic || 24) * 1.8), marginBottom: SIZES.height * 0.015 },
    activeSegment: { color: colors.accent || '#007AFF' },
    arabicVerseEnd: { fontSize: fontPixel(18), color: colors.accent || '#007AFF', textAlign: 'left' },
    verseUrdu: { fontSize: fontPixel(fontSizes.translationUr || 20), color: colors.textSecondary || '#666', lineHeight: fontPixel((fontSizes.translationUr || 20) * 1.7), textAlign: 'right', fontFamily: 'NotoNastaliqUrdu-Regular', marginBottom: SIZES.height * 0.02 },
    verseTranslation: { fontSize: fontPixel(fontSizes.translationEn || 18), color: colors.textPrimary || '#000', lineHeight: fontPixel((fontSizes.translationEn || 18) * 1.5), textAlign: 'left', marginBottom: SIZES.height * 0.01 },
    verseTransliteration: { fontSize: fontPixel(fontSizes.transliterationEn || 18), color: colors.textSecondary || '#666', lineHeight: fontPixel((fontSizes.transliterationEn || 18) * 1.5), fontStyle: 'italic', textAlign: 'left', marginBottom: SIZES.height * 0.02 },
    verseUrduTransliteration: {
      fontSize: fontPixel(fontSizes.transliterationUr || 14), 
      color: colors.textSecondary || '#666', 
      lineHeight: fontPixel((fontSizes.transliterationUr || 14) * 1.5),
      fontStyle: 'italic', 
      textAlign: 'left', 
      marginBottom: SIZES.height * 0.02,
    },
    headerFrame: { marginVertical: SIZES.height * 0.01, padding: 3, borderWidth: 1, borderColor: colors.border || '#e0e0e0' },
    bismillahContainer: { paddingVertical: SIZES.height * 0.01, paddingHorizontal: SIZES.width * 0.05, backgroundColor: colors.bgSecondary || '#f0f0f0', borderWidth: 1, borderColor: colors.border || '#e0e0e0' },
    bismillahText: { fontSize: fontPixel(22), color: colors.textPrimary || '#000', textAlign: 'center' },
    headerTitleContainer: {
        alignItems: 'center',
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        gap: fontPixel(8),
    },
    headerTitleArabic: { color: colors.textPrimary || '#000', fontSize: fontPixel(22), textAlign: 'center' },
    headerTitleTransliteration: { color: colors.textPrimary || '#000', fontSize: fontPixel(16), textAlign: 'center' },
    headerRightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRightText: { color: colors.textSecondary || '#666', fontSize: fontPixel(16), fontWeight: '600', paddingRight: SIZES.width * 0.03 },
    footerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.bgSecondary || '#f0f0f0', borderTopWidth: 1, borderColor: colors.border || '#e0e0e0', justifyContent: 'center', paddingBottom: SIZES.height * 0.005 },
    sliderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SIZES.width * 0.04, paddingTop: SIZES.height * 0.01 },
    sliderContainer: { width: '100%', alignItems: 'center' },
    sliderTrack: { width: '100%', height: 3, borderRadius: 2, backgroundColor: colors.border || '#e0e0e0' },
    sliderProgress: { height: 3, borderRadius: 2, backgroundColor: colors.accent || '#007AFF' },
    timeText: { color: colors.textSecondary || '#666', fontSize: fontPixel(12) },
    controlsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: -SIZES.width * 0.055, paddingHorizontal: SIZES.width * 0.2 },
    controlButton: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SIZES.width * 0.01 },
  });

export default Player;