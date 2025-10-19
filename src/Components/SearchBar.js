import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useStyle } from '../Context/StyleContext';
import Icon from './Icon';

const SearchBar = ({ value, onChangeText, placeholder }) => {
  const { colors, fontPixel, SIZES } = useStyle();
  const styles = getStyles({ colors: colors.colors, fontPixel, SIZES });

  return (
    <View style={styles.container}>
      <Icon
        type="feather"
        name="search"
        size={fontPixel(20)}
        color={colors.colors.textSecondary}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder || 'Search...'}
        placeholderTextColor={colors.colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const getStyles = ({ colors, fontPixel, SIZES }) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.bgSecondary,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SIZES.width * 0.04,
      marginHorizontal: SIZES.width * 0.04,
      marginTop: SIZES.height * 0.01,
      marginBottom: SIZES.height * 0.02,
      borderWidth: 1,
      borderColor: colors.border,
    },
    icon: {
      marginRight: SIZES.width * 0.03,
    },
    input: {
      flex: 1,
      color: colors.textPrimary,
      fontSize: fontPixel(16),
      paddingVertical: SIZES.height * 0.015,
    },
  });

export default SearchBar;