import React, { useState } from 'react';
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
import SearchBar from '../Components/SearchBar';
import Icon from '../Components/Icon';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DUMMY_PRACTICES = [
  {
    id: 1,
    title: 'Upon Waking Up',
    urduTitle: 'بیدار ہونے پر',
    description: 'The first remembrance of Allah upon opening your eyes.',
    duas: [
      {
        title: 'Dua Upon Waking',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        transliteration:
          'Alhamdu lillahil-ladhi ahyana ba‘da ma amatana wa ilayhin-nushur.',
        urdu: 'تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں مارنے کے بعد زندہ کیا اور اسی کی طرف لوٹنا ہے۔',
        translation:
          'Praise is to Allah Who gives us life after He has caused us to die and to Him is the resurrection.',
      },
    ],
  },
  {
    id: 2,
    title: 'Entering the Bathroom',
    urduTitle: 'بیت الخلا میں داخل ہونے کی دعا',
    description: 'Seeking refuge in Allah from all evil.',
    duas: [
      {
        title: 'Dua for Entering',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
        transliteration:
          'Allahumma inni a‘udhu bika minal-khubuthi wal-khaba’ith.',
        urdu: 'اے اللہ! میں خبیث جنوں اور خبیث جنیوں سے تیری پناہ میں آتا ہوں۔',
        translation:
          'O Allah, I seek refuge in You from the male and female devils.',
      },
    ],
  },
  {
    id: 3,
    title: 'Leaving the Bathroom',
    urduTitle: 'بیت الخلا سے نکلنے کی دعا',
    description: 'Seeking forgiveness from Allah.',
    duas: [
      {
        title: 'Dua for Leaving',
        arabic: 'غُفْرَانَكَ',
        transliteration: 'Ghufranak.',
        urdu: 'میں آپ کی بخشش چاہتا ہوں۔',
        translation: 'I seek Your forgiveness.',
      },
    ],
  },
  {
    id: 4,
    title: 'Before Wudu (Ablution)',
    urduTitle: 'وضو سے پہلے',
    description: 'Beginning the purification in the name of Allah.',
    duas: [
      {
        title: 'Saying Bismillah',
        arabic: 'بِسْمِ اللَّهِ',
        transliteration: 'Bismillah.',
        urdu: 'اللہ کے نام سے۔',
        translation: 'In the name of Allah.',
      },
    ],
  },
  {
    id: 5,
    title: 'After Wudu (Ablution)',
    urduTitle: 'وضو کے بعد',
    description: 'The testimony of faith after completing the purification.',
    duas: [
      {
        title: 'Dua after Wudu',
        arabic:
          'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        transliteration:
          'Ash-hadu an la ilaha illallah, wahdahu la sharika lah, wa ash-hadu anna Muhammadan ‘abduhu wa rasuluh.',
        urdu: 'میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اور میں گواGہی دیتا ہوں کہ محمد (ﷺ) اس کے بندے اور رسول ہیں۔',
        translation:
          'I bear witness that there is no god but Allah, alone without partner, and I bear witness that Muhammad is His servant and His Messenger.',
      },
    ],
  },
  {
    id: 6,
    title: 'Morning Remembrance',
    urduTitle: 'صبح کے اذکار',
    description:
      'Recitations performed after the Fajr prayer until sunrise to seek Allah’s blessings and protection throughout the day.',
    duas: [
      {
        title: 'Ayat al-Kursi (Verse 2:255)',
        arabic:
          'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ ...',
        transliteration:
          'Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum. La ta’khudhuhu sinatun wa la nawm...',
        urdu: 'اللہ وہ ہے جس کے سوا کوئی معبود نہیں، وہ زندہ ہے، سب کا تھامنے والا ہے۔ اسے نہ اونگھ آتی ہے نہ نیند...',
        translation:
          'Allah! There is no god but He, the Living, the Everlasting. Neither slumber nor sleep overtakes Him...',
      },
    ],
  },
  {
    id: 7,
    title: 'Before Eating',
    urduTitle: 'کھانے سے پہلے',
    description: 'Remembering Allah before partaking in His blessings.',
    duas: [
      {
        title: 'Dua for Eating',
        arabic: 'بِسْمِ اللَّهِ',
        transliteration: 'Bismillah.',
        urdu: 'اللہ کے نام سے۔',
        translation: 'In the name of Allah.',
      },
    ],
  },
  {
    id: 8,
    title: 'After Eating',
    urduTitle: 'کھانے کے بعد',
    description: 'Thanking Allah for the provision.',
    duas: [
      {
        title: 'Dua after Eating',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
        transliteration:
          'Alhamdu lillahil-ladhi at‘amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah.',
        urdu: 'تمام تعریفیں اللہ کے لیے ہیں جس نے مجھے یہ کھلایا اور میری کسی طاقت اور قوت کے بغیر مجھے یہ رزق عطا کیا۔',
        translation:
          'Praise is to Allah Who has fed me this and provided it for me without any power or strength on my part.',
      },
    ],
  },
  {
    id: 9,
    title: 'Evening Remembrance',
    urduTitle: 'شام کے اذکار',
    description:
      'Recitations performed after the Asr prayer until sunset for protection through the night.',
    duas: [
      {
        title: 'Sayyidul-Istighfar (Chief of Prayers for Forgiveness)',
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ...',
        transliteration:
          'Allahumma Anta Rabbi, la ilaha illa Anta, khalaqtani wa ana ‘abduka...',
        urdu: 'اے اللہ! تو میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں...',
        translation:
          'O Allah, You are my Lord, there is no god but You. You created me and I am Your servant...',
      },
    ],
  },
  {
    id: 10,
    title: 'Before Sleeping',
    urduTitle: 'سونے سے پہلے',
    description:
      'Supplications and actions to be performed before going to sleep.',
    duas: [
      {
        title: 'Dua before Sleeping',
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        transliteration: 'Bismika Allahumma amutu wa ahya.',
        urdu: 'اے اللہ! میں تیرے ہی نام سے مرتا (سوتا) ہوں اور زندہ (جاگتا) ہوں۔',
        translation: 'In Your name, O Allah, I die (sleep) and I live (wake up).',
      },
    ],
  },
];

const DuaItem = ({ dua, colors, fontPixel, SIZES }) => {
  const styles = getStyles({ colors, fontPixel, SIZES });
  return (
    <View style={styles.duaContainer}>
      <Text style={styles.duaTitle}>{dua.title}</Text>
      <Text style={styles.arabicText}>{dua.arabic}</Text>
      <Text style={styles.transliterationText}>{dua.transliteration}</Text>
      <Text style={styles.urduDuaText}>{dua.urdu}</Text>
      <Text style={styles.translationText}>{dua.translation}</Text>
    </View>
  );
};

const PracticeItem = ({ item, colors, fontPixel, SIZES, onPress, isExpanded }) => {
  const styles = getStyles({ colors, fontPixel, SIZES });

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.urduTitleText}>{item.urduTitle}</Text>
        </View>
        <Icon
          type="materialcommunity"
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={fontPixel(24)}
          color={colors.textSecondary}
        />
      </View>
      {isExpanded && (
        <View style={styles.detailsContainer}>
          <Text style={styles.descriptionText}>{item.description}</Text>
          {item.duas.map((dua, index) => (
            <DuaItem
              key={index}
              dua={dua}
              colors={colors}
              fontPixel={fontPixel}
              SIZES={SIZES}
            />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const Practices = ({ navigation }) => {
  const { colors, fontPixel, SIZES } = useStyle();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const handlePress = id => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const styles = getStyles({ colors: colors.colors, fontPixel, SIZES });

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search for a practice or dua..."
      />
      <FlatList
        overScrollMode="never"
        bounces={false}
        data={DUMMY_PRACTICES}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <PracticeItem
            item={item}
            colors={colors.colors}
            fontPixel={fontPixel}
            SIZES={SIZES}
            onPress={() => handlePress(item.id)}
            isExpanded={expandedId === item.id}
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
      paddingHorizontal: SIZES.width * 0.04,
      paddingVertical: SIZES.height * 0.02,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTextContainer: {
      flex: 1,
      marginRight: SIZES.width * 0.04,
    },
    titleText: {
      color: colors.textPrimary,
      fontSize: fontPixel(16),
      fontWeight: '600',
    },
    urduTitleText: {
      color: colors.textSecondary,
      fontSize: fontPixel(14),
      fontFamily: 'NotoNastaliqUrdu-Regular',
      textAlign: 'left',
      marginTop: 2,
    },
    detailsContainer: {
      marginTop: SIZES.height * 0.015,
      borderTopWidth: 1,
      borderColor: colors.border,
      paddingTop: SIZES.height * 0.015,
    },
    descriptionText: {
      color: colors.textSecondary,
      fontSize: fontPixel(14),
      lineHeight: fontPixel(14 * 1.5),
      marginBottom: SIZES.height * 0.02,
    },
    duaContainer: {
      marginTop: SIZES.height * 0.01,
      borderTopWidth: 1,
      borderColor: colors.border,
      paddingTop: SIZES.height * 0.015,
    },
    duaTitle: {
      color: colors.textPrimary,
      fontSize: fontPixel(15),
      fontWeight: '600',
      marginBottom: SIZES.height * 0.015,
    },
    arabicText: {
      color: colors.accent,
      fontSize: fontPixel(20),
      lineHeight: fontPixel(20 * 1.6),
      textAlign: 'right',
      marginBottom: SIZES.height * 0.01,
    },
    transliterationText: {
      color: colors.textSecondary,
      fontSize: fontPixel(13),
      fontStyle: 'italic',
      lineHeight: fontPixel(13 * 1.4),
      marginBottom: SIZES.height * 0.01,
    },
    urduDuaText: {
      color: colors.textPrimary,
      fontSize: fontPixel(16),
      fontFamily: 'NotoNastaliqUrdu-Regular',
      textAlign: 'right',
      lineHeight: fontPixel(16 * 1.7),
      marginBottom: SIZES.height * 0.01,
    },
    translationText: {
      color: colors.textPrimary,
      fontSize: fontPixel(14),
      lineHeight: fontPixel(14 * 1.4),
    },
    separator: {
      height: SIZES.height * 0.015,
    },
  });

export default Practices;