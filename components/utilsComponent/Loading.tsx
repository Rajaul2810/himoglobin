import { StyleSheet, View, Animated, Dimensions } from 'react-native'
import React, { useEffect, useRef } from 'react'

const LoadingComponent = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-windowWidth, windowWidth],
  });

  return (
    <View style={styles.container}>
      <View style={styles.skeletonContainer}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarSkeleton}>
            <View style={styles.shimmer}>
              <Animated.View style={[styles.shimmerEffect, { transform: [{ translateX }] }]} />
            </View>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameSkeleton}>
              <View style={styles.shimmer}>
                <Animated.View style={[styles.shimmerEffect, { transform: [{ translateX }] }]} />
              </View>
            </View>
            <View style={styles.bioSkeleton}>
              <View style={styles.shimmer}>
                <Animated.View style={[styles.shimmerEffect, { transform: [{ translateX }] }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Content Cards */}
        {[1].map((item) => (
          <View key={item} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.smallCircle}>
                <View style={styles.shimmer}>
                  <Animated.View style={[styles.shimmerEffect, { transform: [{ translateX }] }]} />
                </View>
              </View>
              <View style={styles.headerText}>
                <View style={styles.shimmer}>
                  <Animated.View style={[styles.shimmerEffect, { transform: [{ translateX }] }]} />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

export default LoadingComponent

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  skeletonContainer: {
    gap: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarSkeleton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E1E9EE',
    overflow: 'hidden',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
    gap: 8,
  },
  nameSkeleton: {
    height: 24,
    width: '60%',
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bioSkeleton: {
    height: 16,
    width: '80%',
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  smallCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E1E9EE',
    overflow: 'hidden',
  },
  headerText: {
    height: 20,
    width: '50%',
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    overflow: 'hidden',
  },
  cardBody: {
    height: 80,
    backgroundColor: '#E1E9EE',
    borderRadius: 8,
    overflow: 'hidden',
  },
  shimmer: {
    flex: 1,
    overflow: 'hidden',
  },
  shimmerEffect: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{ skewX: '-20deg' }],
  },
})