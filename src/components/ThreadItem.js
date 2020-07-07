import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { size } from '../helpers/devices';
import { AppStyles, AppIcon } from '../AppStyles';

const defaultAvatar =
  'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';

function ThreadItem(props) {
  const {
    item,
    user,
    onChatItemImagePress,
    onSenderProfilePicturePress
  } = props;

  const [imgErr, setImgErr] = useState(false);

  const onImageError = () => {
    setImgErr(true);
  };

  return (
    <View>
      {/* user thread item */}
      {item.senderID === user.userID && (
        <View style={styles.sendItemContainer}>
          {item.url !== '' && (
            <TouchableOpacity
              onPress={() => onChatItemImagePress(item)}
              style={[
                styles.itemContent,
                styles.sendItemContent,
                { padding: 0, marginRight: -1 }
              ]}
            >
              <FastImage
                style={styles.sendPhotoMessage}
                source={{ uri: item.url }}
              />
              <Image
                source={AppIcon.images.boederImgSend}
                style={styles.boederImgSend}
              />
            </TouchableOpacity>
          )}
          {!item.url && (
            <View
              style={[
                styles.itemContent,
                styles.sendItemContent,
                { maxWidth: '65%' }
              ]}
            >
              <Text style={styles.sendTextMessage}>{item.content}</Text>
              <Image
                source={AppIcon.images.textBoederImgSend}
                style={styles.textBoederImgSend}
              />
            </View>
          )}
          <TouchableOpacity onPress={() => onSenderProfilePicturePress(item)}>
            <FastImage
              style={styles.userIcon}
              source={
                imgErr || !item.senderProfilePictureURL
                  ? { uri: defaultAvatar }
                  : { uri: item.senderProfilePictureURL }
              }
              onError={onImageError}
            />
          </TouchableOpacity>
        </View>
      )}
      {/* receiver thread item */}
      {item.senderID !== user.userID && (
        <View style={styles.receiveItemContainer}>
          <TouchableOpacity onPress={() => onSenderProfilePicturePress(item)}>
            <FastImage
              style={styles.userIcon}
              source={
                imgErr
                  ? { uri: defaultAvatar }
                  : { uri: item.senderProfilePictureURL }
              }
              onError={onImageError}
            />
          </TouchableOpacity>
          {item.url != '' && (
            <View
              style={[
                styles.itemContent,
                styles.receiveItemContent,
                { padding: 0, marginLeft: -1 }
              ]}
            >
              <FastImage
                style={styles.receivePhotoMessage}
                source={{ uri: item.url }}
              />
              <Image
                source={AppIcon.images.boederImgReceive}
                style={styles.boederImgReceive}
              />
            </View>
          )}
          {!item.url && (
            <View
              style={[
                styles.itemContent,
                styles.receiveItemContent,
                { maxWidth: '65%' }
              ]}
            >
              <Text style={styles.receiveTextMessage}>{item.content}</Text>
              <Image
                source={AppIcon.images.textBoederImgReceive}
                style={styles.textBoederImgReceive}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

ThreadItem.propTypes = {};

const chatBackgroundColor = '#ffffff';

const styles = StyleSheet.create({
  sendItemContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginBottom: 10
  },
  itemContent: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    maxWidth: '80%'
  },
  sendItemContent: {
    marginRight: 9,
    backgroundColor: AppStyles.color.main
  },
  sendPhotoMessage: {
    width: size(300),
    height: size(250),
    borderRadius: 10
  },
  boederImgSend: {
    position: 'absolute',
    width: size(300),
    height: size(250),
    resizeMode: 'stretch',
    tintColor: chatBackgroundColor
  },
  textBoederImgSend: {
    position: 'absolute',
    right: -5,
    bottom: 0,
    width: 20,
    height: 8,
    resizeMode: 'stretch',
    tintColor: AppStyles.color.main
  },
  sendTextMessage: {
    fontSize: 16,
    color: '#ffffff'
  },
  userIcon: {
    width: 34,
    height: 34,
    borderRadius: 17
  },
  receiveItemContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginBottom: 10
  },
  receiveItemContent: {
    marginLeft: 9
  },
  receivePhotoMessage: {
    width: size(300),
    height: size(250),
    borderRadius: 10
  },
  boederImgReceive: {
    position: 'absolute',
    width: size(300),
    height: size(250),
    resizeMode: 'stretch',
    tintColor: chatBackgroundColor
  },
  receiveTextMessage: {
    color: AppStyles.color.text,
    fontSize: 16
  },
  textBoederImgReceive: {
    position: 'absolute',
    left: -5,
    bottom: 0,
    width: 20,
    height: 8,
    resizeMode: 'stretch',
    tintColor: '#e0e0e0'
  }
});

export default ThreadItem;
