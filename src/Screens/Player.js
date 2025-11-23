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
  AppState,
  Platform,
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
import RNBlobUtil from 'react-native-blob-util';

const BASE_URL = 'https://pub-1c63bf236e654cc784338a89abee13d8.r2.dev';
const { fs } = RNBlobUtil;
const AUDIO_DIR = fs.dirs.DocumentDir + '/surah_audio';

const getLocalFilePath = (surahId) => `${AUDIO_DIR}/surah_${surahId}.mp3`;

const getRemoteUrl = (surahId) => `${BASE_URL}/surah_${surahId}.mp3`;

const ensureDirExists = async () => {
  try {
    const exists = await fs.exists(AUDIO_DIR);
    if (!exists) {
      await fs.mkdir(AUDIO_DIR);
    }
  } catch (error) {
    console.error('Failed to create audio directory:', error);
  }
};

const checkFileExists = async (surahId) => {
  const localPath = getLocalFilePath(surahId);
  return await fs.exists(localPath);
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

const VerseItem = memo(({ item: verse, verseNumber, surahId, active, onPressVerse, allSurahData }) => {
  const { colors, fontSizes, displayOptions, fontPixel, SIZES } = useStyle();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const styles = getStyles({ colors: colors.colors, fontPixel, SIZES, fontSizes });
  const isSajdah = sajdahVerses.has(`${surahId}:${verse.id}`);

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
      const verseTiming = surahInfo?.verse_timings.find(vt => vt.id === verse.id);
      const startTime = verseTiming ? verseTiming.start : 0;
      const bookmark = {
        id: `${surahId}:${verse.id}`,
        surahId,
        verseId: verse.id,
        verseNumber,
        arabicName: surahInfo?.name || '',
        surahName: surahInfo?.transliteration || '',
        arabicText: verse.text,
        translationUr: verse.translationUr || '',
        translationEn: verse.translationEn || '',
        transliterationEn: transliteration,
        timestamp: new Date().toISOString(),
        startTime: startTime,
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
        <Text style={[styles.verseArabic, active && styles.activeSegment]}>
          {verse.text}
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
  isCurrentDownloaded,
  isDownloading,
  onDownload,
  downloadProgress,
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
            size={fontPixel(24)}
            color={colors.colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={onPrevious} disabled={isBeginning}>
          <Icon
            name="skip-previous"
            type="materialcommunity"
            size={fontPixel(30)}
            color={isBeginning ? colors.colors.border : colors.colors.textPrimary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={onPlayPause}>
          <MaterialIcon
            name={isPlaying ? 'pause' : 'play-arrow'}
            size={fontPixel(36)}
            color={colors.colors.accent}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={onNext} disabled={isEnd}>
          <Icon
            name="skip-next"
            type="materialcommunity"
            size={fontPixel(30)}
            color={isEnd ? colors.colors.border : colors.colors.textPrimary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={onNavigateBookmarks}>
          <Icon
            name="bookmarks"
            type="MaterialIcons"
            size={fontPixel(22)}
            color={colors.colors.textSecondary}
          />
        </TouchableOpacity>
        {isDownloading ? (
          <View style={styles.controlButton}>
            <Text style={styles.progressText}>
              {`${Math.floor(downloadProgress)}%`}
            </Text>
          </View>
        ) : !isCurrentDownloaded ? (
          <TouchableOpacity onPress={onDownload} style={styles.controlButton}>
            <Icon
              name="download"
              type="materialcommunity"
              size={fontPixel(25)}
              color={colors.colors.textSecondary}
            />
          </TouchableOpacity>
        ) : (
          null
        )}
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
  const { surahId = 1, verseId, bookmarkTime = null, autoPlay = false } = route.params || {};
  const allSurahData = useSurahData();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isTrackActive, setIsTrackActive] = useState(false);
  const [activeVerseId, setActiveVerseId] = useState(null);
  const [wasPlaying, setWasPlaying] = useState(false);
  const [initialVerseId, setInitialVerseId] = useState(verseId || null);
  const [isLoading, setIsLoading] = useState(true);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isCurrentDownloaded, setIsCurrentDownloaded] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);


  const verticalListRef = useRef(null);
  const lastActiveVerseRef = useRef(null);
  const scrollRetry = useRef(null);

  const activeVerseIdRef = useRef(activeVerseId);
  useEffect(() => {
    activeVerseIdRef.current = activeVerseId;
  }, [activeVerseId]);

  const currentIndexRef = useRef(currentIndex);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const wasPlayingRef = useRef(wasPlaying);
  useEffect(() => {
    wasPlayingRef.current = wasPlaying;
  }, [wasPlaying]);

  const currentPositionRef = useRef(0);

  const playbackState = usePlaybackState();
  const { position, duration } = useProgress(50);
  const { colors, fontPixel, SIZES, fontSizes } = useStyle();
  const styles = getStyles({
    colors: colors.colors,
    fontPixel,
    SIZES,
    fontSizes,
  });

  useEffect(() => {
    currentPositionRef.current = position;
  }, [position]);

  const saveLastPlayedPosition = useCallback(async () => {
    const positionToSave = currentPositionRef.current;
    const indexToSave = currentIndexRef.current;
    const verseToSave = activeVerseIdRef.current || 1; 

    if (wasPlayingRef.current && allSurahData && allSurahData[indexToSave] && positionToSave > 2) {
      const surahInfo = allSurahData[indexToSave];
      const dataToSave = {
        surahId: surahInfo.id,
        position: positionToSave,
        surahName: surahInfo.transliteration,
        verseNumber: verseToSave,
      };
      
      try {
        await AsyncStorage.setItem('lastPlayedSurahTrack', JSON.stringify(dataToSave));
      } catch (e) {
        console.error('Failed to save last played surah', e);
      }
    }
  }, [allSurahData]); 

  const isPlaying =
    playbackState.state === State.Playing ||
    playbackState.state === State.Buffering;

  const createPlaylist = useCallback(async () => {
    const tracks = [];
    for (const surah of allSurahData) {
      const localPath = getLocalFilePath(surah.id);
      const isDownloaded = await fs.exists(localPath);

      tracks.push({
        id: `surah-${surah.id}`,
        url: isDownloaded
          ? (Platform.OS === 'ios' ? '' : 'file://') + localPath
          : getRemoteUrl(surah.id),
        title: surah.name,
        artist: surah.transliteration,
        duration:
          (surah.verse_timings[surah.verse_timings.length - 1]?.end || 0) / 1000,
      });
    }
    return tracks;
  }, [allSurahData]);

  useFocusEffect(
    useCallback(() => {
      const setupPlayer = async () => {
        try {
          await ensureDirExists();
          const currentTrack = await TrackPlayer.getActiveTrack();
          const newSurahId = `surah-${surahId}`;
          let positionToResume = 0; 

          if (currentTrack) {
            if (currentTrack.id === newSurahId) {
              setIsLoading(false);
              setIsTrackActive(true);
              if (autoPlay) {
                await TrackPlayer.play();
                setWasPlaying(true);
                navigation.setParams({ autoPlay: false });
              }
              return;
            }
            await TrackPlayer.reset();
          } else {
            if (bookmarkTime) {
              positionToResume = bookmarkTime / 1000; 
            } else {
              const lastPlayedData = await AsyncStorage.getItem('lastPlayedSurahTrack');
              if (lastPlayedData) {
                const lastPlayed = JSON.parse(lastPlayedData);
                if (lastPlayed.surahId === surahId) {
                  positionToResume = lastPlayed.position;
                }
              }
            }
          }

          setIsLoading(true);
          const playlist = await createPlaylist();
          if (playlist.length === 0) {
            console.error('Playlist is empty, cannot setup player.');
            setIsLoading(false);
            return;
          }

          const initialIndex = allSurahData.findIndex(s => s.id === surahId);
          await TrackPlayer.add(playlist);
          await TrackPlayer.skip(initialIndex !== -1 ? initialIndex : 0);

          if (positionToResume > 0) {
            await TrackPlayer.seekTo(positionToResume);
            if (autoPlay) {
              await TrackPlayer.play();
              setWasPlaying(true);
              navigation.setParams({ autoPlay: false });
            } else {
              setWasPlaying(false);
            }
          } else {
            setWasPlaying(false);
          }

          setCurrentIndex(initialIndex !== -1 ? initialIndex : 0);
          setIsTrackActive(true);
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
        TrackPlayer.pause();
        setIsTrackActive(false);
        setWasPlaying(false);
        if (scrollRetry.current) {
          clearTimeout(scrollRetry.current);
          scrollRetry.current = null;
        }
      };
    }, [isDataReady, allSurahData, surahId, createPlaylist, navigation, bookmarkTime, autoPlay])
  );
  
  useEffect(() => {
    const checkCurrentTrack = async () => {
      if (currentIndex === -1 || !allSurahData[currentIndex]) {
        return;
      }
      const surahId = allSurahData[currentIndex].id;
      const exists = await checkFileExists(surahId);
      setIsCurrentDownloaded(exists);
    };
    checkCurrentTrack();
  }, [currentIndex, allSurahData]);

  useEffect(() => {
    const listener = TrackPlayer.addEventListener(
      Event.PlaybackQueueEnded,
      async () => {
        saveLastPlayedPosition();
        if (currentIndex < allSurahData.length - 1 && wasPlaying) {
          await TrackPlayer.skipToNext();
          await TrackPlayer.play();
          setCurrentIndex(currentIndex + 1);
        }
      }
    );
    return () => listener.remove();
  }, [currentIndex, allSurahData.length, wasPlaying, saveLastPlayedPosition]);

  useEffect(() => {
    const listener = TrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      async ({ index }) => {
        if (index !== undefined && index !== currentIndex) {
          saveLastPlayedPosition();
          setCurrentIndex(index);
          setActiveVerseId(null);
          if (allSurahData[index]) {
            navigation.setParams({ 
              surahId: allSurahData[index].id,
              verseId: 1, 
            });
          }
        }
      }
    );
    return () => listener.remove();
  }, [currentIndex, navigation, allSurahData, saveLastPlayedPosition]);

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
    if (activeVerseId && verticalListRef.current) {
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
  }, [activeVerseId, currentIndex, allSurahData]);

  useEffect(() => {
    if (allSurahData[currentIndex] && position > 0 && isPlaying) {
      const surah = allSurahData[currentIndex];
      const hasPreamble = surah.bismillah_pre && surah.id !== 1;
      const adjustedPosition = hasPreamble
        ? Math.max(0, position * 1000 - 6000)
        : position * 1000;

      if (hasPreamble && position * 1000 < 6000) {
        if (activeVerseId !== null) {
          setActiveVerseId(null);
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
    }
  }, [
    position,
    currentIndex,
    allSurahData,
    activeVerseId,
    isPlaying,
  ]);

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        saveLastPlayedPosition();
      }
    });

    if (playbackState.state === State.Paused || playbackState.state === State.Stopped) {
      saveLastPlayedPosition();
    }

    return () => {
      appStateSubscription.remove();
    };
  }, [playbackState, saveLastPlayedPosition]);

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

  const handleDownload = useCallback(async () => {
    if (currentIndex === -1 || !allSurahData[currentIndex] || isDownloading) {
      return;
    }

    setDownloadProgress(0);
    setIsDownloading(true);
    const surah = allSurahData[currentIndex];
    const remoteUrl = getRemoteUrl(surah.id);
    const localPath = getLocalFilePath(surah.id);
    const tempPath = localPath + '.tmp';

    try {
      const res = RNBlobUtil.config({
        path: tempPath,
      })
      .fetch('GET', remoteUrl)
      .progress((received, total) => {
        setDownloadProgress((received / total) * 100);
      });

      await res;

      await fs.mv(tempPath, localPath);

      const position = currentPositionRef.current;
      const state = await TrackPlayer.getPlaybackState();
      const wasPlaying = state.state === State.Playing;

      await TrackPlayer.reset();
      const newPlaylist = await createPlaylist();
      await TrackPlayer.add(newPlaylist);
      await TrackPlayer.skip(currentIndex);
      await TrackPlayer.seekTo(position);
      
      if (wasPlaying) {
        await TrackPlayer.play();
      }
      
      setIsDownloading(false);
      setIsCurrentDownloaded(true);
      setDownloadProgress(0);

    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
      setDownloadProgress(0);
      await fs.unlink(tempPath).catch(() => {});
    }
  }, [currentIndex, allSurahData, isDownloading, createPlaylist]);

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
            onPressVerse={handleVersePress}
            allSurahData={allSurahData}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.verseListContainer}
        initialNumToRender={currentSurah.verses.length}
        maxToRenderPerBatch={currentSurah.verses.length}
        windowSize={21}
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
        isCurrentDownloaded={isCurrentDownloaded} 
        isDownloading={isDownloading}
        onDownload={handleDownload}
        downloadProgress={downloadProgress}
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
    progressText: { 
    fontSize: fontPixel(14),
    color: colors.accent,
    fontWeight: 'bold',
  },
    controlsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginTop: -SIZES.width * 0.055,
      paddingHorizontal: SIZES.width * 0.15, 
    },
    controlButton: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: SIZES.width * 0.01,
      height: 50,
    },
  });

export default Player;