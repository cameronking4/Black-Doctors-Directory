import React from 'react';
import { FlatList, View } from 'react-native';
import { useDynamicStyleSheet } from 'react-native-dark-mode';
import IMNotificationItem from './IMNotificationItem';
import dynamicStyles from './styles';

function IMNotification({ notifications, onNotificationPress, appStyles }) {
  const styles = useDynamicStyleSheet(dynamicStyles(appStyles));

  const renderItem = ({ item }) => (
    <IMNotificationItem
      onNotificationPress={onNotificationPress}
      appStyles={appStyles}
      item={item} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

IMNotification.propTypes = {};

export default IMNotification;
