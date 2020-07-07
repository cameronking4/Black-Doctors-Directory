import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  View
} from 'react-native';
import { AppIcon, AppStyles } from '../AppStyles';

export default class HeaderButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={this.props.customStyle}
        onPress={this.props.onPress}
        disabled={this.props.disabled}
      >
        {this.props.loading ? (
          <ActivityIndicator
            style={{ padding: 6 }}
            size={10}
            color={AppStyles.color.main}
          />
        ) : (
            <Image
              style={[AppIcon.style, this.props.iconStyle]}
              source={this.props.icon}
            />
          )}
      </TouchableOpacity>
    );
  }
}
