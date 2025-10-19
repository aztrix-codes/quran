import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import { useStyle } from '../Context/StyleContext';
import SystemNavigationBar from 'react-native-system-navigation-bar';

const Player = () => {
  const { colors, fontSizes, displayOptions, fontPixel, SIZES } = useStyle();

  useEffect(() => {
    const navBarStyle =
      colors.colors.barStyle === 'light-content' ? 'light' : 'dark';
    SystemNavigationBar.setNavigationColor(
      colors.colors.bgPrimary,
      navBarStyle,
    );
  }, [colors]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.colors.bgPrimary,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{ color: colors.colors.textPrimary, fontSize: fontPixel(20) }}
      >
        Player
      </Text>
    </View>
  );
};

export default Player;
