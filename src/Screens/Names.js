import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useStyle } from '../Context/StyleContext';
import namesData from '../Data/names';

const NameListItem = ({ item, colors, fontPixel, SIZES, onPress }) => {
  const styles = getStyles({ colors, fontPixel, SIZES });

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
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
    </TouchableOpacity>
  );
};

const Names = ({ navigation }) => {
  const { colors, fontPixel, SIZES } = useStyle();

  const handleNamePress = item => {
    console.log('Pressed:', item.transliteration);
  };

  const styles = getStyles({ colors: colors.colors, fontPixel, SIZES });

  return (
    <View style={styles.container}>
      <FlatList
        data={namesData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <NameListItem
            item={item}
            colors={colors.colors}
            fontPixel={fontPixel}
            SIZES={SIZES}
            onPress={() => handleNamePress(item)}
          />
        )}
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
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SIZES.width * 0.04,
      paddingVertical: SIZES.height * 0.02,
      backgroundColor: colors.bgPrimary,
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

