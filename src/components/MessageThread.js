import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, StyleSheet } from 'react-native';
import ThreadItem from './ThreadItem';

function MessageThread(props) {
  const { threads, user, onChatItemImagePress } = props;

  const renderChatItem = ({ item }) => (
    <ThreadItem
      onChatItemImagePress={onChatItemImagePress}
      item={item}
      user={{ ...user, userID: user.id }}
    />
  );

  return (
    <FlatList
      inverted={true}
      vertical={true}
      showsVerticalScrollIndicator={false}
      data={threads}
      renderItem={renderChatItem}
      keyExtractor={item => `${item.id}`}
      contentContainerStyle={styles.messageThreadContainer}
    />
  );
}

MessageThread.propTypes = {
  threads: PropTypes.array,
  user: PropTypes.object
};

const styles = StyleSheet.create({
  messageThreadContainer: {
    margin: 6
  }
});

export default MessageThread;
