import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text, View } from 'react-native';
import { AppStyles, AppIcon } from '../AppStyles';
import DynamicAppStyles from '../DynamicAppStyles';

export default class SavedButton extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { item, style } = this.props;
    return (
      <TouchableOpacity style={style} onPress={this.props.onPress}>
        <Image
          style={{
            ...AppIcon.style,
            tintColor: item.saved ? DynamicAppStyles.colorSet.mainThemeForegroundColor : AppStyles.color.white
          }}
          source={AppIcon.images.heartFilled}
        />
      </TouchableOpacity>
    );
  }
}
