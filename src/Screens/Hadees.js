import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useStyle } from '../Context/StyleContext';
import SearchBar from '../Components/SearchBar';

const DUMMY_HADEES = [
  {
    id: 1,
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى.',
    transliteration:
      "Innamal-a'malu bin-niyyati, wa innama likullim-ri'im ma nawa.",
    urdu: 'اعمال کا دارومدار نیتوں پر ہے، اور ہر شخص کو وہی ملے گا جس کی اس نے نیت کی۔',
    english:
      'Actions are according to intentions, and everyone will get what was intended.',
    reference: 'Sahih al-Bukhari, 1',
  },
  {
    id: 2,
    arabic:
      'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ.',
    transliteration:
      "Man kana yu'minu billahi wal-yawmil-akhiri falyaqul khayran aw liyasmut.",
    urdu: 'جو شخص اللہ اور آخرت کے دن پر ایمان رکھتا ہے اسے چاہیے کہ اچھی بات کہے یا خاموش رہے۔',
    english:
      'Whoever believes in Allah and the Last Day should speak a good word or remain silent.',
    reference: 'Sahih al-Bukhari, 6018',
  },
  {
    id: 3,
    arabic:
      'لا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ.',
    transliteration:
      "La yu'minu ahadukum hatta yuhibba li-akhihi ma yuhibbu linafsih.",
    urdu: 'تم میں سے کوئی شخص اس وقت تک مومن نہیں ہو سکتا جب تک کہ وہ اپنے بھائی کے لیے وہی پسند نہ کرے جو وہ اپنے لیے پسند کرتا ہے۔',
    english:
      'None of you will believe until you love for your brother what you love for yourself.',
    reference: 'Sahih al-Bukhari, 13',
  },
];

const HadeesItem = ({ item, colors, fontPixel, SIZES }) => {
  const styles = getStyles({ colors, fontPixel, SIZES });

  return (
    <View style={styles.itemContainer}>
      <Text style={styles.referenceText}>{item.reference}</Text>
      <Text style={styles.arabicText}>{item.arabic}</Text>
      <Text style={styles.urduText}>{item.urdu}</Text>
      <Text style={styles.transliterationText}>{item.transliteration}</Text>
      <Text style={styles.englishText}>{item.english}</Text>
    </View>
  );
};

const Hadees = ({ navigation }) => {
  const { colors, fontPixel, SIZES } = useStyle();
  const [searchQuery, setSearchQuery] = useState('');

  const styles = getStyles({ colors: colors.colors, fontPixel, SIZES });

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by narrator or topic..."
      />
      <FlatList
        overScrollMode="never"
        bounces={false}
        data={DUMMY_HADEES}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <HadeesItem
            item={item}
            colors={colors.colors}
            fontPixel={fontPixel}
            SIZES={SIZES}
          />
        )}
        contentContainerStyle={styles.listContentContainer}
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
      paddingHorizontal: SIZES.width * 0.04,
      paddingBottom: SIZES.height * 0.02,
    },
    itemContainer: {
      backgroundColor: colors.bgSecondary,
      borderRadius: 16,
      padding: SIZES.width * 0.05,
    },
    referenceText: {
      color: colors.textSecondary,
      fontSize: fontPixel(13),
      fontWeight: '500',
      marginBottom: SIZES.height * 0.015,
      textAlign: 'left',
    },
    arabicText: {
      color: colors.accent,
      fontSize: fontPixel(22),
      lineHeight: fontPixel(22 * 1.7),
      textAlign: 'right',
      marginBottom: SIZES.height * 0.015,
    },
    urduText: {
      color: colors.textPrimary,
      fontSize: fontPixel(18),
      lineHeight: fontPixel(18 * 1.8),
      fontFamily: 'NotoNastaliqUrdu-Regular',
      textAlign: 'right',
      marginBottom: SIZES.height * 0.02,
    },
    transliterationText: {
      color: colors.textSecondary,
      fontSize: fontPixel(14),
      fontStyle: 'italic',
      lineHeight: fontPixel(14 * 1.4),
      textAlign: 'left',
      marginBottom: SIZES.height * 0.01,
    },
    englishText: {
      color: colors.textPrimary,
      fontSize: fontPixel(15),
      lineHeight: fontPixel(15 * 1.5),
      textAlign: 'left',
    },
    separator: {
      height: SIZES.height * 0.015,
    },
  });

export default Hadees;

