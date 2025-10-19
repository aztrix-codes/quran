import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Brands from 'react-native-vector-icons/FontAwesome5Pro';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome6Brands from 'react-native-vector-icons/FontAwesome6Pro';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Lucide from 'react-native-vector-icons/Lucide';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';

const Icon = ({ type, name, size, color, style, ...props }) => {
  const getIconComponent = () => {
    switch (type.toLowerCase()) {
      case 'antdesign':
        return AntDesign;
      case 'entypo':
        return Entypo;
      case 'evilicons':
        return EvilIcons;
      case 'feather':
        return Feather;
      case 'fontawesome':
        return FontAwesome;
      case 'fontawesome5':
        return FontAwesome5;
      case 'fontawesome5brands':
        return FontAwesome5Brands;
      case 'fontawesome6':
        return FontAwesome6;
      case 'fontawesome6brands':
        return FontAwesome6Brands;
      case 'fontisto':
        return Fontisto;
      case 'foundation':
        return Foundation;
      case 'ionicons':
        return Ionicons;
      case 'lucide':
        return Lucide;
      case 'materialcommunity':
        return MaterialCommunityIcons;
      case 'materialicons':
      case 'material':
        return MaterialIcons;
      case 'octicons':
        return Octicons;
      case 'simplelineicons':
      case 'simpleline':
        return SimpleLineIcons;
      case 'zocial':
        return Zocial;
      default:
        return MaterialIcons;
    }
  };

  const IconComponent = getIconComponent();

  const iconName =
    IconComponent === MaterialIcons &&
    !['materialicons', 'material'].includes(type.toLowerCase())
      ? 'error-outline'
      : name;

  return (
    <View style={[styles.container, style]}>
      <IconComponent name={iconName} size={size} color={color} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Icon.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Icon.defaultProps = {
  size: 24,
  color: '#000',
  style: {},
};

export default Icon;
