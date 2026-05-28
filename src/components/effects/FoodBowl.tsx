import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

// 9×9 pixel cookie — '#' = ink, '.' = transparent
// Three 2×2 chocolate chips placed asymmetrically:
//   chip 1 upper-left (rows 2–3, cols 2–3)
//   chip 2 middle-right (rows 4–5, cols 6–7)
//   chip 3 lower-centre (rows 6–7, cols 4–5)
const COOKIE_ROWS = [
  '..#####..',
  '.#######.',
  '##..#####',
  '##..#####',
  '######..#',
  '######..#',
  '####..###',
  '.###..##.',
  '..#####..',
];

const CELL = 3;
const INK = '#1F2410';

function PixelCookie() {
  return (
    <View>
      {COOKIE_ROWS.map((row, y) => (
        <View key={y} style={styles.row}>
          {row.split('').map((ch, x) => (
            <View
              key={x}
              style={{
                width: CELL,
                height: CELL,
                backgroundColor: ch === '#' ? INK : 'transparent',
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function AnimatedCookie() {
  const [scale] = useState(() => new Animated.Value(0));
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }),
      Animated.delay(700),
      Animated.timing(opacity, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [scale, opacity]);

  return (
    <Animated.View style={{ transform: [{ scale }], opacity }}>
      <PixelCookie />
    </Animated.View>
  );
}

interface Props {
  visible: boolean;
  ink?: string;
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
      <AnimatedCookie key={gen} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 10,
    zIndex: 5,
  },
  row: { flexDirection: 'row' },
});
