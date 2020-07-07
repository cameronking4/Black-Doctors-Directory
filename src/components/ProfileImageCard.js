import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode';
import { View, Text, TouchableOpacity } from 'react-native';
import DynamicAppStyles from '../DynamicAppStyles';

const defaultAvatar =
  'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';

function ProfileImageCard(props) {
  const { user, onImagePress, disabled } = props;
  const [imgErr, setImgErr] = useState(false);
  const lastName = user.lastName ? user.lastName : '';
  const firstName = user.firstName ? user.firstName : user.fullname;
  const fullName = `${firstName} ${lastName}`;
  const styles = useDynamicStyleSheet(cardStyles);

  const onImageError = () => {
    setImgErr(true);
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        disabled={disabled}
        onPress={onImagePress}
        style={styles.cardImageContainer}
      >
        <FastImage
          onError={onImageError}
          source={
            imgErr ? { uri: defaultAvatar } : { uri: user.profilePictureURL }
          }
          style={[
            styles.cardImage,
            !user.profilePictureURL && { tintColor: 'grey' }
          ]}
        />
      </TouchableOpacity>
      <View style={styles.cardNameContainer}>
        <Text style={styles.cardName}>{fullName}</Text>
      </View>
    </View>
  );
}

ProfileImageCard.propTypes = {
  title: PropTypes.string,
  navigation: PropTypes.object,
  onImagePress: PropTypes.func,
  extraData: PropTypes.object,
  user: PropTypes.object,
  disabled: PropTypes.bool
};

const cardStyles = new DynamicStyleSheet({
  cardContainer: {
    flex: 1
  },
  cardImageContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardImage: {
    height: 130,
    width: 130,
    borderRadius: 65
  },
  cardNameContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 15
  },
  cardName: {
    color: DynamicAppStyles.colorSet.mainTextColor,
    fontSize: 16,
    fontWeight: '500'
  },
  container: {
    flex: 1
  },
  profileCardContainer: {
    flex: 3
  }
});

export default ProfileImageCard;
