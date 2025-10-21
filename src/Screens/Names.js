import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { useStyle } from '../Context/StyleContext';
import namesData from '../Data/names';
import { useFocusEffect } from '@react-navigation/native';
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
  Capability,
} from 'react-native-track-player';
import Icon from '../Components/Icon';

const timestamps = [
  10.5, 12.5, 13.5, 15.5, 16.5, 18.5, 19.5, 21.5, 22.5, 24.5, 26.5, 28.5,
  30.5, 31.5, 33.5, 35.5, 36.5, 38.5, 40.5, 41.5, 43.5, 45.5, 47.5, 48.5, 49.5,
  51.5, 52.5, 54.5, 55.5, 56.5, 57.5, 58.5, 60.5, 61.5, 63.5, 64.5, 65.5, 67.5,
  68.5, 69.5, 71.5, 72.5, 74.5, 75.5, 76.5, 78.5, 79.5, 81.5, 82.5, 84.5, 86.5,
  87.5, 88.5, 89.5, 91.5, 92.5, 94.5, 95.5, 96.5, 97.5, 98.5, 100.5, 101.5, 
  102.5, 104.5, 106.5, 107.5, 108.5, 109.5, 110.5, 112.5, 113.5, 115.5, 116.5, 
  118.5, 119.5, 121.5, 122.5, 124.5, 124.5, 126.5, 127.5, 128.5, 130.5, 132.5, 
  136.5, 137.5, 138.5, 140.5, 141.5, 143.5, 147.5, 149.5, 150.5, 151.5, 152.5, 
  154.5, 156.5, 158.5, 160
];

const NameListItem = ({ item, colors, fontPixel, SIZES, onPress, isHighlighted, isLast, onLayout }) => {
  const styles = getStyles({ colors, fontPixel, SIZES, isLast });

  return (
    <Pressable 
      style={[
        styles.itemContainer, 
        isHighlighted && { backgroundColor: colors.bgSecondary }
      ]} 
      onPress={onPress}
      onLayout={onLayout}
    >
      <View style={styles.leftColumn}>
        <Text style={styles.idText}>{item.id}</Text>
        <View>
          <Text style={styles.transliterationText}>{item.transliteration}</Text>
          <Text style={styles.translationText}>{item.translation}</Text>
        </View>
      </View>
      <View style={styles.rightColumn}>
        <Text style={styles.arabicNameText}>{item.arabic}</Text>
      </View>
    </Pressable>
  );
};

const namesTrack = {
  id: 'names-1',
  url: require('../../assets/names.mp3'),
  title: 'Asma ul Husna',
  artist: 'Quran',
};

const Names = ({ navigation }) => {
  const { colors, fontPixel, SIZES } = useStyle();
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [isThisTrackActive, setIsThisTrackActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemHeight, setItemHeight] = useState(0);
  const flatListRef = useRef(null);

  const isPlaying =
    isThisTrackActive &&
    (playbackState?.state === State.Playing ||
      playbackState?.state === State.Buffering);

  useFocusEffect(
    useCallback(() => {
      const setupScreen = async () => {
        try {
          await TrackPlayer.updateOptions({
            capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
            compactCapabilities: [Capability.Play, Capability.Pause],
            notificationCapabilities: [Capability.Play, Capability.Pause],
          });

          const currentTrack = await TrackPlayer.getActiveTrack();
          if (currentTrack?.id !== namesTrack.id) {
            await TrackPlayer.stop();
            await TrackPlayer.reset();
            setIsThisTrackActive(false);
            setCurrentIndex(0);
          } else {
            setIsThisTrackActive(true);
          }
        } catch (error) {
          console.error('Error in setupScreen:', error);
        }
      };
      setupScreen();

      return () => {
        if (isThisTrackActive) {
          TrackPlayer.stop();
          TrackPlayer.reset();
          setIsThisTrackActive(false);
          setCurrentIndex(0);
        }

        TrackPlayer.updateOptions({
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
          notificationCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
        });
      };
    }, [isThisTrackActive]),
  );

  useEffect(() => {
    if (!isThisTrackActive || progress.position === undefined) {
      return;
    }

    const pos = progress.position;
    let idx = 0;
    for (let i = 0; i < timestamps.length; i++) {
      if (pos >= timestamps[i]) {
        idx = i + 1;
      } else {
        break;
      }
    }
    setCurrentIndex(idx > 99 ? -1 : idx);
  }, [progress.position, isThisTrackActive]);

  const onLayout = useCallback((event) => {
    if (itemHeight === 0) {
      setItemHeight(event.nativeEvent.layout.height);
    }
  }, [itemHeight]);

  useEffect(() => {
    if (flatListRef.current && itemHeight > 0 && currentIndex > 0 && currentIndex !== -1) {
      const targetOffset = (currentIndex - 1) * itemHeight;
      flatListRef.current.scrollToOffset({
        offset: targetOffset,
        animated: true,
      });
    }
  }, [currentIndex, itemHeight]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={togglePlayback}>
          <Icon
            type="material"
            name={isPlaying ? 'pause' : 'play-arrow'}
            size={fontPixel(28)}
            color={colors.colors.accent}
          />
        </Pressable>
      ),
    });
  }, [navigation, isPlaying, colors, fontPixel, SIZES]);

  const togglePlayback = async () => {
    try {
      const currentTrack = await TrackPlayer.getActiveTrack();

      if (currentTrack?.id !== namesTrack.id) {
        await TrackPlayer.reset();
        await TrackPlayer.add(namesTrack);
        await TrackPlayer.play();
        setIsThisTrackActive(true);
        setCurrentIndex(0);
      } else {
        if (isPlaying) {
          await TrackPlayer.pause();
        } else {
          await TrackPlayer.play();
        }
      }
    } catch (error) {
      console.error('Error during playback toggle:', error);
    }
  };

  const handleNamePress = item => {
    console.log('Pressed:', item.transliteration);
  };

  const styles = getStyles({ colors: colors.colors, fontPixel, SIZES });

  const getItemLayout = useCallback(
    itemHeight > 0
      ? (data, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })
      : undefined,
    [itemHeight]
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={namesData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item, index }) => (
          <NameListItem
            item={item}
            colors={colors.colors}
            fontPixel={fontPixel}
            SIZES={SIZES}
            onPress={() => handleNamePress(item)}
            isHighlighted={index === currentIndex}
            isLast={index === namesData.length - 1}
            onLayout={index === 0 ? onLayout : undefined}
          />
        )}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={21}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const getStyles = ({ colors, fontPixel, SIZES, isLast = false }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgPrimary,
    },
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SIZES.width * 0.04,
      paddingVertical: SIZES.height * 0.015,
      backgroundColor: colors.bgPrimary,
      borderBottomWidth: isLast ? 0 : fontPixel(0.5),
      borderBottomColor: colors.bgSecondary,
    },
    leftColumn: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    idText: {
      color: colors.textSecondary,
      fontSize: fontPixel(16),
      fontWeight: '500',
      marginRight: SIZES.width * 0.02,
      minWidth: SIZES.width * 0.06,
    },
    transliterationText: {
      color: colors.textPrimary,
      fontSize: fontPixel(16),
    },
    translationText: {
      color: colors.textSecondary,
      fontSize: fontPixel(11),
      marginTop: SIZES.height * 0.002,
    },
    rightColumn: {
      marginLeft: SIZES.width * 0.04,
    },
    arabicNameText: {
      color: colors.accent,
      fontSize: fontPixel(24),
      textAlign: 'right',
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
    },
  });

export default Names;