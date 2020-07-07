import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet
} from 'react-native';
import { AppStyles, AppIcon } from '../AppStyles';

function BottomInput(props) {
  const { item, value, onChangeText, onSend, onAddImagePress } = props;
  const isDisable = !value;

  return (
    <View style={styles.inputBar}>
      <TouchableOpacity
        style={styles.inputIconContainer}
        onPress={onAddImagePress}
      >
        <Image style={styles.inputIcon} source={AppIcon.images.cameraFilled} />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        value={value}
        multiline
        placeholder="Start typing..."
        underlineColorAndroid="transparent"
        onChangeText={text => onChangeText(text)}
      />
      <TouchableOpacity
        disabled={isDisable}
        onPress={onSend}
        style={[
          styles.inputIconContainer,
          isDisable ? { opacity: 0.2 } : { opacity: 1 }
        ]}
      >
        <Image style={styles.inputIcon} source={AppIcon.images.send} />
      </TouchableOpacity>
    </View>
  );
}

BottomInput.propTypes = {};

const styles = StyleSheet.create({
  inputBar: {
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row'
  },
  inputIconContainer: {
    margin: 10
  },
  inputIcon: {
    tintColor: AppStyles.color.main,
    width: 25,
    height: 25
  },
  input: {
    margin: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    backgroundColor: '#f5f5f5',
    fontSize: 16,
    borderRadius: 20,
    color: AppStyles.color.text
  }
});

export default BottomInput;
