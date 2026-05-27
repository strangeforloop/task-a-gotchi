import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const HEARTS = [
  { x: 18, delay: 0 },
  { x: 52, delay: 110 },
  { x: 86, delay: 60 },
  { x: 120, delay: 180 },
  { x: 155, delay: 30 },
];

function FloatingHeart({ x, delay }: { x: number; delay: number }) {
  const [translateY] = useState(() => new Animated.Value(0));
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateY, { toValue: -72, duration: 900, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(300),
          Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, [delay, translateY, opacity]);

  return (
    <Animated.Text style={[styles.heart, { left: x, transform: [{ translateY }], opacity }]}>
      ♥
    </Animated.Text>
  );
}

interface Props {
  visible: boolean;
  ink?: string;
}

export function HeartsBurst({ visible }: Props) {
  const [gen, setGen] = useState(0);
  const prevVisible = useRef(false);

  useEffect(() => {
    if (visible && !prevVisible.current) setGen(g => g + 1);
    prevVisible.current = visible;
  }, [visible]);

  if (!visible) return null;
  return (
    <View style={styles.overlay} pointerEvents="none">
      {HEARTS.map((h, i) => (
        <FloatingHeart key={`${gen}-${i}`} x={h.x} delay={h.delay} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 },
  heart: { position: 'absolute', bottom: 30, fontSize: 16, color: '#1F2410' },
});
