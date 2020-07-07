import React, { useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import { AppStyles, AppIcon } from '../AppStyles';

const defaultAvatar =
  'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';

function ChatIconView(props) {
  const { participants, imageStyle, style } = props;

  const [imgErr, setImgErr] = useState(false);
  const [secondImgErr, setSecondImgErr] = useState(false);

  const onImageError = () => {
    setImgErr(true);
  };

  const onSecondImageError = () => {
    setSecondImgErr(true);
  };

  let firstAvatarUri = '';
  let secondAvatarUri = '';

  if (participants.length === 1) {
    firstAvatarUri =
      participants[0].profilePictureURL ||
      participants[0].senderProfilePictureURL;
  }

  if (participants.length > 1) {
    secondAvatarUri = participants[1].profilePictureURL;
  }

  return (
    <View style={styles.container}>
      {participants.length == 0 && (
        <View style={styles.singleParticipation}>
          <Image
            style={styles.singleChatItemIcon}
            source={AppIcon.images.default_user}
          />
        </View>
      )}
      {participants.length === 1 && (
        <View style={style ? style : styles.singleParticipation}>
          <FastImage
            style={[styles.singleChatItemIcon, imageStyle]}
            onError={onImageError}
            source={imgErr ? { uri: defaultAvatar } : { uri: firstAvatarUri }}
          />
          {participants[0].online && <View style={styles.onlineMark} />}
        </View>
      )}
      {participants.length > 1 && (
        <View style={styles.multiParticipation}>
          <FastImage
            style={[styles.multiPaticipationIcon, styles.bottomIcon]}
            onError={onImageError}
            source={imgErr ? { uri: defaultAvatar } : { uri: firstAvatarUri }}
          />
          <View style={styles.middleIcon} />
          <FastImage
            style={[styles.multiPaticipationIcon, styles.topIcon]}
            onError={onSecondImageError}
            source={
              secondImgErr ? { uri: defaultAvatar } : { uri: secondAvatarUri }
            }
          />
        </View>
      )}
    </View>
  );
}

ChatIconView.propTypes = {
  participants: PropTypes.array,
  style: PropTypes.object
};

const VIEW_WIDTH = 60;
const MULTI_ICON_WIDTH = 40;
const RADIUS_BORDER_WIDTH = 2;
const TOP_ICON_WIDTH = MULTI_ICON_WIDTH + RADIUS_BORDER_WIDTH * 2;
const ONLINE_MARK_WIDTH = 9 + RADIUS_BORDER_WIDTH * 2;

const styles = StyleSheet.create({
  container: {},
  singleParticipation: {
    height: VIEW_WIDTH,
    width: VIEW_WIDTH
  },
  singleChatItemIcon: {
    position: 'absolute',
    height: VIEW_WIDTH,
    borderRadius: VIEW_WIDTH / 2,
    width: VIEW_WIDTH,
    left: 0,
    top: 0
  },
  onlineMark: {
    position: 'absolute',
    backgroundColor: AppStyles.color.main,
    height: ONLINE_MARK_WIDTH,
    width: ONLINE_MARK_WIDTH,
    borderRadius: ONLINE_MARK_WIDTH / 2,
    borderWidth: RADIUS_BORDER_WIDTH,
    borderColor: '#ffffff',
    right: 1.5,
    bottom: 1
  },
  multiParticipation: {
    height: VIEW_WIDTH,
    width: VIEW_WIDTH
  },
  bottomIcon: {
    top: 0,
    right: 0
  },
  topIcon: {
    left: 0,
    bottom: 0,
    height: TOP_ICON_WIDTH,
    width: TOP_ICON_WIDTH,
    borderRadius: TOP_ICON_WIDTH / 2,
    borderWidth: RADIUS_BORDER_WIDTH,
    borderColor: '#ffffff'
  },
  multiPaticipationIcon: {
    position: 'absolute',
    height: MULTI_ICON_WIDTH,
    borderRadius: MULTI_ICON_WIDTH / 2,
    width: MULTI_ICON_WIDTH
  },
  multiPaticipationIcon: {
    position: 'absolute',
    height: MULTI_ICON_WIDTH,
    borderRadius: MULTI_ICON_WIDTH / 2,
    width: MULTI_ICON_WIDTH
  }
});

export default ChatIconView;
