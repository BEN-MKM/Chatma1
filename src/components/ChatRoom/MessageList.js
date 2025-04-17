import React, { useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  RefreshControl,
  View,
  ActivityIndicator,
} from 'react-native';
import MessageItem from './MessageItem';

const MessageList = ({
  messages,
  currentUserId,
  onLoadMore,
  isLoadingMore,
  refreshing,
  onRefresh,
}) => {
  const renderItem = useCallback(({ item }) => (
    <MessageItem
      message={item}
      isOwn={item.sender_id === currentUserId}
    />
  ), [currentUserId]);

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }, [isLoadingMore]);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={messages}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      inverted
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#007AFF']}
          tintColor="#007AFF"
        />
      }
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 100,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  contentContainer: {
    paddingVertical: 10,
  },
  loadingMore: {
    paddingVertical: 10,
    alignItems: 'center',
  },
});

export default React.memo(MessageList);
