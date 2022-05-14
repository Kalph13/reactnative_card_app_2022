import React, { useRef, useState } from 'react';
import { Animated, PanResponder, Dimensions, Easing, View } from 'react-native';
import styled from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import icons from './icons';

const BLACK = "#000000";
const WHITE = "#ffffff"
const GREY = "#485460";
const GREEN = "#2ecc71";
const MINT = "#aaf0d1";
const RED = "#e74c3c";

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("screen");

const Container = styled.View`
    flex: 1;
    background-color: ${MINT}
`;

const Edge = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const AnimatedWordContainer = styled(Animated.createAnimatedComponent(View))`
    background-color: ${BLACK}
    height: ${WINDOW_HEIGHT / 9}px;
    width: ${WINDOW_HEIGHT / 9}px;
    border-radius: ${WINDOW_HEIGHT / 4}px;
    justify-content: center;
    align-items: center;
`;

const Word = styled.Text`
    font-size: ${WINDOW_HEIGHT / 35}px;
    text-align: center;
    color: ${props => props.color};
`;

const Center = styled.View`
    flex: 2;
    justify-content: center;
    align-items: center;
    z-index: 10;
`;

const AnimatedIconCard = styled(Animated.createAnimatedComponent(View))`
    background-color: ${WHITE};
    width: ${WINDOW_HEIGHT / 5}px;
    height: ${WINDOW_HEIGHT / 5}px;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
    box-shadow: 1px 1px 5px rgb(0, 0, 0, 0.5);
    elevation: 5;
    position: absolute;
`;

// const AnimatedWordContainer = Animated.createAnimatedComponent(WordContainer);
// const AnimatedIconCard = Animated.createAnimatedComponent(IconCard);

export default function App() {
    const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const scaleIconCard = useRef(new Animated.Value(1)).current;
    const opacityIconCard = useRef(new Animated.Value(1)).current;
    const [ cardNum, setCardNum ] = useState(0);
    
    const scaleWordContainerUp = position.y.interpolate({
        inputRange: [ -WINDOW_HEIGHT / 2, 0],
        outputRange: [ 5, 1 ],
        extrapolate: "clamp" /* No Extra Rotation Out of the Ranges */
    });

    const scaleWordContainerDown = position.y.interpolate({
        inputRange: [ 0, WINDOW_HEIGHT / 2 ],
        outputRange: [ 1, 5 ],
        extrapolate: "clamp" /* No Extra Rotation Out of the Ranges */
    });

    const riseUp = position.y.interpolate({
        inputRange: [ -WINDOW_HEIGHT / 2.5, 0, WINDOW_HEIGHT / 2.5 ],
        outputRange: [ 1, 0.5, 1 ],
        extrapolate: "clamp"
    })

    const onPressIn = Animated.spring(scaleIconCard, {
        toValue: 0.8,
        useNativeDriver: true
    });

    const onPressOut = Animated.spring(scaleIconCard, {
        toValue: 1,
        useNativeDriver: true
    });

    const goCenter = Animated.timing(position, {
        toValue: { x: 0, y: 0 },
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true
    });

    const onDropScale = Animated.timing(scaleIconCard, {
        toValue: 0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
    });

    const onDropOpacity = Animated.timing(opacityIconCard, {
        toValue: 0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true
    });

    const changeCard = () => {
        // position.setValue({ x: 0, y: 0 });
        // scaleIconCard.setValue(1);
        // opacityIconCard.setValue(1);
        setCardNum(prev => prev + 1);
        Animated.parallel([
            Animated.spring(scaleIconCard, { toValue: 1, useNativeDriver: true }),
            Animated.spring(opacityIconCard, { toValue: 1, useNativeDriver: true }),
        ]).start();
    };

    const panResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, { dx, dy }) => {
            position.setValue({ x: dx, y: dy });
        },
        onPanResponderGrant: () => {
            onPressIn.start();
            /* Keep the Current Position */
            // position.setOffset({ x: position.x._value, y: position.y._value });
        },
        onPanResponderRelease: (_, {dy}) => {
            Math.abs(dy) > (WINDOW_HEIGHT * 0.25) ? 
                Animated.sequence([
                    Animated.parallel([onDropScale, onDropOpacity]),
                    goCenter
                ]).start(changeCard) :
                Animated.parallel([onPressOut, goCenter]).start();
            /* Keep the Current Position*/
            // position.flattenOffset();
            // goCenter.start();
        }
    })).current;

    return (
        <Container>
            <Edge>
                <AnimatedWordContainer
                    style={{
                        transform: [
                            {scale: scaleWordContainerUp }
                        ]
                    }}
                >
                    <Word color={GREEN}>I Know</Word>
                </AnimatedWordContainer>
            </Edge>
            <Center>
                <AnimatedIconCard
                    { ...panResponder.panHandlers }
                    style={{
                        opacity: opacityIconCard,
                        transform: [
                            ...position.getTranslateTransform(), 
                            {scale: scaleIconCard}
                            // {translateX: position.x},
                            // {translateY: position.y}
                        ]
                    }}
                >
                    <Ionicons name={icons[cardNum]} color={BLACK} size={WINDOW_HEIGHT / 8} />
                </AnimatedIconCard>
            </Center>
            <Edge>
                <AnimatedWordContainer
                    style={{
                        transform: [
                            {scale: scaleWordContainerDown }
                        ]
                    }}
                >
                    <Word color={RED}>I Don't Know</Word>
                </AnimatedWordContainer>
            </Edge>
        </Container>
    );
}