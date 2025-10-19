import { View, StatusBar, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useStyle } from './Context/StyleContext';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from './Components/Icon';

import Home from './Screens/Home';
import Theme from './Screens/Theme';
import Player from './Screens/Player';

const Stack = createNativeStackNavigator();

const AppContent = () => {
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
    <View style={{ flex: 1, backgroundColor: colors.colors.bgPrimary }}>
      <StatusBar
        backgroundColor={colors.colors.bgPrimary}
        barStyle={colors.colors.barStyle}
      />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.colors.bgPrimary,
            },
            headerTintColor: colors.colors.textPrimary,
            headerTitleStyle: {
              fontSize: fontPixel(18),
              fontWeight: '600',
            },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.colors.bgPrimary },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={Home}
            options={({ navigation }) => ({
              title: 'Quran',
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Theme')}>
                  <Icon 
                    type="feather" 
                    name="bar-chart" 
                    size={fontPixel(24)} 
                    color={colors.colors.textPrimary} 
                    style={{ transform: [{ rotate: '-90deg' }] }}
                  />
                </TouchableOpacity>
              )
            })}
          />
          <Stack.Screen 
            name="Theme" 
            component={Theme}
            options={{
              title: 'Theme Settings'
            }}
          />
          <Stack.Screen 
            name="Player" 
            component={Player}
            options={{
              title: 'Player'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default AppContent;