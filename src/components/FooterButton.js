import React from 'react';
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode';
import { TouchableOpacity, Image, Text } from 'react-native';
import DynamicAppStyles from '../DynamicAppStyles';

export default function FooterButton(props) {
  const {
    title,
    onPress,
    disabled,
    footerTitleStyle,
    footerContainerStyle,
    iconSource,
    iconStyle
  } = props;
  const styles = useDynamicStyleSheet(footerButtonStyles);

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.footerContainer, footerContainerStyle]}
    >
      {iconSource && <Image style={iconStyle} source={iconSource} />}
      < Text style={[styles.footerTitle, footerTitleStyle]} > {title}</Text >
    </TouchableOpacity >
  )
}

const footerButtonStyles = new DynamicStyleSheet({
  footerContainer: {
    height: 50,
    width: '92%',
    margin: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 4,
    borderColor: 'transparent',
    marginBottom: 50,
    flexDirection: 'row',
    backgroundColor: DynamicAppStyles.colorSet.mainThemeForegroundColor

  },
  footerTitle: {
    fontSize: 17,
    // padding: 10,
    color: DynamicAppStyles.colorSet.mainTextColor
  }
});
