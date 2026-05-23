import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface Props {
  visible: boolean;
  ink?: string;
}

function Cookie() {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }),
      Animated.delay(600),
      Animated.timing(opacity, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.Text style={[styles.cookie, { transform: [{ scale }], opacity }]}>
      🍪
    </Animated.Text>
  );
}

export function FoodBowl({ visible }: Props) {
  const [gen, setGen] = useState(0);
  const prevVisible = useRef(false);

  useEffect(() => {
    if (visible && !prevVisible.current) setGen(g => g + 1);
    prevVisible.current = visible;
  }, [visible]);

  if (!visible) return null;
  return (
    <View style={styles.overlay} pointerEvents="none">
      <Cookie key={gen} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', zIndex: 5 },
  cookie: { fontSize: 36 },
});
