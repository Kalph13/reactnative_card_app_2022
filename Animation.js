import React, { useState, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';
import Easing from 'react-native/Libraries/Animated/Easing';
import styled from 'styled-components/native';

/* Animated: https://reactnative.dev/docs/animated */

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Touchable1 = styled.TouchableOpacity``;

const Box = styled.View`
  background-color: tomato;
  width: 100px;
  height: 100px;
`;

const Touchable2 = styled.TouchableOpacity`
  background-color: green;
  width: 100px;
  height: 100px;
`;

const Touchable3 = styled.TouchableOpacity`
  background-color: blue;
  width: 100px;
  height: 100px;
`;

const AnimatedBox = Animated.createAnimatedComponent(Box); /* Prerequisite for Using Animation */
const AnimatedTouchable1 = Animated.createAnimatedComponent(Touchable1);
const AnimatedTouchable2 = Animated.createAnimatedComponent(Touchable2);
const AnimatedTouchable3 = Animated.createAnimatedComponent(Touchable3);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function App() {
  const [up1, setUp1] = useState(false);
  const [up2x, setUp2x] = useState(-1);
  const [up2y, setUp2y] = useState(-1);
  const [up3, setUp3] = useState(false);

  /* useRef: https://reactjs.org/docs/hooks-reference.html#useref */
  /* Persist Current Value (Not Initialize) When Re-render */
  const Y1 = useRef(new Animated.Value(0)).current; /* Do Not Use useState for Animation */
  const Y2 = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const Y3 = useRef(new Animated.Value(0)).current;

  const toggleUp1 = () => setUp1(prev => !prev);
  const toggleUp2 = () => {
    up2x === up2y ? setUp2y(up2y * -1) : setUp2x(up2x * -1);
  };
  const toggleUp3 = () => setUp3(prev => !prev);

  const opacityValue2 = Y2.y.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [1, 0.1, 1]
  });

  const borderRadius2 = Y2.y.interpolate({
    inputRange: [-200, 200],
    outputRange: [100, 0]
  });

  const rotation2 = Y2.y.interpolate({
    inputRange: [-200, 200],
    outputRange: ["-360deg", "360deg"]
  });

  const backgroundColor2 = Y2.y.interpolate({
    inputRange: [-200, 200],
    outputRange: ["rgb(0, 255, 0)", "rgb(0, 0, 255)"]
  });

  const moveUp1 = () => {
    Animated.loop(
      Animated.sequence([moveUp1_A, moveUp1_B])
    ).start();
  };

  const moveUp1_A = Animated.timing(Y1, {
    toValue: 200, 
    useNativeDriver: true,
    easing: Easing.poly(10)
  });

  const moveUp1_B = Animated.timing(Y1, {
    toValue: -200, 
    useNativeDriver: true,
    easing: Easing.poly(10)
  });

  const moveUp2 = () => {
    Animated.timing(Y2, {
      toValue: {
        x: (SCREEN_WIDTH * -up2x) / 2 + (50 * up2x),
        y: (SCREEN_HEIGHT * -up2y) / 2 + (50 * up2y),
      },
      useNativeDriver: false
    }).start(toggleUp2);
  };

  const moveUp3 = () => {
    Animated.spring(Y3, {
      toValue: up3 ? 200 : -200,
      bounciness: 50,
      useNativeDriver: true
    }).start(toggleUp3);
  };

  return (
    <Container>
      <AnimatedTouchable1
        onPress={moveUp1}
        style={{
          transform: [{ translateY: Y1 }]
        }}
      >
        <AnimatedBox />
      </AnimatedTouchable1>
      <AnimatedTouchable2 onPress={moveUp2} /* TouchableOpacity Animates Well → Doesn't Need to Wrap Around a View */
          style={{
            borderRadius: borderRadius2,
            opacity: opacityValue2,
            backgroundColor: backgroundColor2,
            transform: [{ rotateY: rotation2 }, { translateX: Y2.x }, { translateY: Y2.y }]
          }}
      />
      <AnimatedTouchable3 onPress={moveUp3}
          style={{
            transform: [{ translateY: Y3 }]
          }}
      />
    </Container>
  );
}