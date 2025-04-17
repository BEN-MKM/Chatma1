import React from 'react';
import { View, Image, ActivityIndicator } from 'react-native';

const OptimizedImage = ({ source, style, resizeMode = 'cover' }) => {
  const [loading, setLoading] = React.useState(true);

  return (
    <View>
      <Image
        style={style}
        source={typeof source === 'string' ? { uri: source } : source}
        resizeMode={resizeMode}
        onLoadEnd={() => setLoading(false)}
      />
      {loading && (
        <ActivityIndicator
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: [{ translateX: -10 }, { translateY: -10 }],
          }}
        />
      )}
    </View>
  );
};

export default OptimizedImage;
