import { View, StatusBar, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useStyle } from './Context/StyleContext';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from './Components/Icon';
import TrackPlayer, { Capability } from 'react-native-track-player';

import Home from './Screens/Home';
import Theme from './Screens/Theme';
import Player from './Screens/Player';
import Names from './Screens/Names';
import Bookmarks from './Screens/Bookmarks';
import Practices from './Screens/Practices';
import Hadees from './Screens/Hadees';

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

  useEffect(() => {
    const setupPlayer = async () => {
      await TrackPlayer.setupPlayer({});
      await TrackPlayer.updateOptions({
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
      });
    };
    setupPlayer();
  }, []);

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
              ),
            })}
          />
          <Stack.Screen
            name="Theme"
            component={Theme}
            options={{
              title: 'Theme Settings',
            }}
          />
          <Stack.Screen
            name="Names"
            component={Names}
            options={{
              title: 'Asma ul Husna',
            }}
          />
          <Stack.Screen
            name="Bookmarks"
            component={Bookmarks}
            options={{
              title: 'Bookmarks',
            }}
          />

          <Stack.Screen
            name="Player"
            component={Player}
            options={{
              title: 'Player',
            }}
          />
          <Stack.Screen
            name="Practices"
            component={Practices}
            options={{
              title: 'Practices',
            }}
          />
          <Stack.Screen
            name="Hadees"
            component={Hadees}
            options={{
              title: 'Hadees',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default AppContent;