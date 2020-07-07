import React from 'react';
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import ChatIcon from './ChatIcon';
import { timeFormat } from '../utils/timeFormat';
import { AppStyles } from '../AppStyles';

function ChatItem(props) {
  const { onChatItemPress, formatMessage, item } = props;

  let title = item.name;
  if (!title) {
    if (item.participants.length > 0) {
      title = item.participants[0].firstName
        ? item.participants[0].firstName
        : item.participants[0].fullname;
    }
  }
  return (
    <TouchableOpacity
      onPress={() => onChatItemPress(item)}
      style={styles.chatItemContainer}
    >
      <ChatIcon participants={item.participants} />
      <View style={styles.chatItemContent}>
        <Text style={styles.chatFriendName}>{title}</Text>
        <View style={styles.content}>
          <Text
            numberOfLines={1}
            ellipsizeMode={'middle'}
            style={styles.message}
          >
            {formatMessage(item)} {' · '}
            {timeFormat(item.lastMessageDate)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

ChatItem.propTypes = {
  formatMessage: PropTypes.func,
  item: PropTypes.object,
  onChatItemPress: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  userImageContainer: {
    borderWidth: 0
  },
  chatsChannelContainer: {
    // flex: 1,
    padding: 10
  },
  chatItemContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },
  chatItemContent: {
    flex: 1,
    alignSelf: 'center',
    marginLeft: 10
  },
  chatFriendName: {
    color: AppStyles.color.text,
    fontSize: 17
  },
  content: {
    flexDirection: 'row'
  },
  message: {
    flex: 2,
    color: AppStyles.color.subtitle
  }
});

export default ChatItem;
