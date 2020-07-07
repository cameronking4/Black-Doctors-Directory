import React from 'react';
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import { useDynamicStyleSheet } from 'react-native-dark-mode';
import { TNStoryItem } from '../../truly-native';
import PropTypes from 'prop-types';
import { timeFormat } from '../..';
import dynamicStyles from './styles';

function IMNotificationItem(props) {
  const { item, onNotificationPress, appStyles } = props;
  const styles = useDynamicStyleSheet(dynamicStyles(appStyles));

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onNotificationPress(item)}
      style={[
        styles.notificationItemBackground,
        item.seen
          ? styles.seenNotificationBackground
          : styles.unseenNotificationBackground,
      ]}>
      <View style={styles.notificationItemContainer}>
        {item.metadata && item.metadata.fromUser && (
          <TNStoryItem
            containerStyle={styles.userImageMainContainer}
            imageContainerStyle={styles.userImageContainer}
            imageStyle={styles.userImage}
            item={item.metadata.fromUser}
            activeOpacity={1}
            appStyles={appStyles}
          />
        )}
        <View style={styles.notificationLabelContainer}>
          <Text style={styles.description}>
            {/* <Text style={[styles.description, styles.name]}>
              {`${item.metadata.fromUser.firstName} `}
            </Text> */}
            {item.body}
          </Text>
          <Text style={[styles.description, styles.moment]}>
            {timeFormat(item.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

IMNotificationItem.propTypes = {
  item: PropTypes.object,
};

export default IMNotificationItem;
