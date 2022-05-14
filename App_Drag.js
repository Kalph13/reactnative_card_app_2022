import React, { useRef } from 'react';
import { Animated, PanResponder } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const Box = styled.View`
    background-color: green;
    width: 200px;
    height: 200px;
`;

const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function App() {

    /* useRef: https://reactjs.org/docs/hooks-reference.html#useref */
    /* Persist Current Value (Not Initialize) When Re-render */
    const POSITION = useRef(
        new Animated.ValueXY({ x: 0, y: 0 })
    ).current;

    /* PanResponder: https://reactnative.dev/docs/panresponder */
    /* Reconcile Several Gestures into a Single Gesture (e.g. Drag) */
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                POSITION.setOffset({
                    x: POSITION.x._value,
                    y: POSITION.y._value
                });
            },
            onPanResponderMove: (_, {dx, dy}) => {
                POSITION.setValue({
                    x: dx,
                    y: dy
                });
            },
            onPanResponderRelease: (_, {dx, dy}) => {
                /* Return to the Initial Position wo/ Transition */
                /* POSITION.setValue({
                    x: 0,
                    y: 0
                }); */

                /* Return to the Initial Position w/ Transition */
                /* Animated.spring(POSITION, {
                    toValue: {
                        x: 0,
                        y: 0
                    },
                    useNativeDriver: false
                }).start(); */

                /* Keep the Current Position */
                POSITION.flattenOffset();
            }
        })
    ).current;

    const opacityValue = POSITION.y.interpolate({
        inputRange: [-200, 0, 200],
        outputRange: [1, 0.1, 1]
    });

    const borderRadius = POSITION.y.interpolate({
        inputRange: [-200, 200],
        outputRange: [100, 0]
    });

    const backgroundColor = POSITION.y.interpolate({
        inputRange: [-200, 200],
        outputRange: ["rgb(0, 255, 0)", "rgb(0, 0, 255)"]
    });

    return (
        <Container>
        <AnimatedBox
            {...panResponder.panHandlers}
            style={{
                borderRadius: borderRadius,
                opacity: opacityValue,
                backgroundColor: backgroundColor,
                transform: POSITION.getTranslateTransform() /* transform: [{ translateX: POSITION.x }, { translateY: POSITION.y }] */
            }}
        />
        </Container>
    );
}