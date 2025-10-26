import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useStyle } from '../Context/StyleContext';
import { useSurahData } from '../Hooks/useSurahData';
import Icon from '../Components/Icon';

const SURAH_KEYS = [
  'id',
  'name',
  'transliteration',
  'translation',
  'total_verses',
];

const SurahListItem = ({ item, colors, fontPixel, SIZES, onPress }) => {
  const styles = getStyles({ colors, fontPixel, SIZES });

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={styles.itemLeft}>
        <View style={styles.idCircle}>
          <Text style={styles.idText}>{item.id}</Text>
        </View>
        <View>
          <Text style={styles.transliterationText}>{item.transliteration}</Text>
          <Text style={styles.translationText}>
            {item.translation} - {item.total_verses} Verses
          </Text>
        </View>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.arabicNameText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const HomeHeader = ({ colors, fontPixel, SIZES, navigation }) => {
  const styles = getStyles({ colors, fontPixel, SIZES });

  return (
    <View style={styles.headerContainer}>
      {/* <TouchableOpacity
        style={styles.continueCard}
        onPress={() => navigation.navigate('Player')}
      >
        <Icon
          type="feather"
          name="play-circle"
          size={fontPixel(30)}
          color={colors.accent}
        />
        <View style={styles.continueTextContainer}>
          <Text style={styles.continueTitle}>Continue Listening</Text>
          <Text style={styles.continueSubtitle}>
            Surah Al-Baqarah, Verse 255
          </Text>
        </View>
        <Icon
          type="materialcommunity"
          name="chevron-right"
          size={fontPixel(24)}
          color={colors.textSecondary}
        />
      </TouchableOpacity> */}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.halfButton}
          onPress={() => navigation.navigate('Names')}
        >
          <Icon
            type="materialcommunity"
            name="book-open-variant"
            size={fontPixel(22)}
            color={colors.accent}
          />
          <Text style={styles.buttonText}>Asma ul Husna</Text>
        </TouchableOpacity>

        <View style={styles.buttonSpacer} />

        <TouchableOpacity
          style={styles.halfButton}
          onPress={() => navigation.navigate('Bookmarks')}
        >
          <Icon
            type="MaterialIcons"
            name="bookmarks"
            size={fontPixel(20)}
            color={colors.accent}
          />
          <Text style={styles.buttonText}>Bookmarks</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.halfButton}
          onPress={() => navigation.navigate('Practices')}
        >
          <Icon
            type="feather"
            name="check-square"
            size={fontPixel(20)}
            color={colors.accent}
          />
          <Text style={styles.buttonText}>Practices</Text>
        </TouchableOpacity>

        <View style={styles.buttonSpacer} />

        <TouchableOpacity
          style={styles.halfButton}
          onPress={() => navigation.navigate('Hadees')}
        >
          <Icon
            type="materialcommunity"
            name="book-open-page-variant-outline"
            size={fontPixel(20)}
            color={colors.accent}
          />
          <Text style={styles.buttonText}>Hadees</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Home = ({ navigation }) => {
  const { colors, fontPixel, SIZES } = useStyle();
  const surahList = useSurahData(SURAH_KEYS);

  const styles = getStyles({ colors: colors.colors, fontPixel, SIZES });

  return (
    <View style={styles.container}>
      <FlatList
        data={surahList}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <SurahListItem
            item={item}
            colors={colors.colors}
            fontPixel={fontPixel}
            SIZES={SIZES}
            onPress={() => navigation.navigate('Player', { surahId: item.id })}
          />
        )}
        ListHeaderComponent={
          <HomeHeader
            colors={colors.colors}
            fontPixel={fontPixel}
            SIZES={SIZES}
            navigation={navigation}
          />
        }
        contentContainerStyle={styles.listContentContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        overScrollMode='never'
        bounces={false}
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
      paddingBottom: SIZES.height * 0.005,
    },
    headerContainer: {
      paddingHorizontal: SIZES.width * 0.04,
      paddingTop: SIZES.height * 0.003,
      paddingBottom: SIZES.height * 0.02,
    },
    continueCard: {
      backgroundColor: colors.bgSecondary,
      borderRadius: 16,
      paddingHorizontal: SIZES.width * 0.04,
      paddingVertical: SIZES.height * 0.02,
      flexDirection: 'row',
      alignItems: 'center',
    },
    continueTextContainer: {
      flex: 1,
      marginLeft: SIZES.width * 0.04,
    },
    continueTitle: {
      color: colors.textPrimary,
      fontSize: fontPixel(16),
      fontWeight: '600',
    },
    continueSubtitle: {
      color: colors.textSecondary,
      fontSize: fontPixel(13),
      marginTop: 2,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: SIZES.height * 0.015,
    },
    halfButton: {
      backgroundColor: colors.bgSecondary,
      borderRadius: 16,
      paddingVertical: SIZES.height * 0.02,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonSpacer: {
      width: SIZES.width * 0.03,
    },
    buttonText: {
      color: colors.textPrimary,
      fontSize: fontPixel(14),
      fontWeight: '600',
      marginLeft: SIZES.width * 0.03,
    },
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SIZES.width * 0.04,
      paddingVertical: SIZES.height * 0.02,
      backgroundColor: colors.bgPrimary,
    },
    itemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    idCircle: {
      width: SIZES.width * 0.1,
      height: SIZES.width * 0.1,
      borderRadius: SIZES.width * 0.05,
      backgroundColor: colors.bgSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SIZES.width * 0.04,
    },
    idText: {
      color: colors.textSecondary,
      fontSize: fontPixel(14),
      fontWeight: '600',
    },
    transliterationText: {
      color: colors.textPrimary,
      fontSize: fontPixel(16),
      letterSpacing: fontPixel(0.5),
    },
    translationText: {
      color: colors.textSecondary,
      fontSize: fontPixel(12),
      marginTop: 2,
    },
    itemRight: {
      marginLeft: SIZES.width * 0.02,
    },
    arabicNameText: {
      color: colors.accent,
      fontSize: fontPixel(22),
      textAlign: 'right',
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: SIZES.width * 0.04,
    },
  });

export default Home;