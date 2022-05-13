import React, { useRef, useState } from 'react';
import { Animated, PanResponder, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import icons from './icons';

const vocaList = icons;

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #00a8ff;
`;

const CardContainer = styled.View`
    flex: 3;
    margin: 0px ${WINDOW_WIDTH / 40}px;
    justify-content: center;
    align-items: center;
`;

const Card = styled.View`
    background-color: #ffffff;
    width: ${WINDOW_HEIGHT * 0.35}px;
    height: ${WINDOW_HEIGHT * 0.35}px;
    border-radius: 12px;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
    elevation: 1;
    justify-content: center;
    align-items: center;
    position: absolute;
`;

const ButtonContainer = styled.View`
    flex-direction: row;
    flex: 1;
`;

const Button = styled.TouchableOpacity`
    margin: 0px ${WINDOW_WIDTH / 40}px;
`;

const AnimatedCard = Animated.createAnimatedComponent(Card);

export default function App() {
    const scale = useRef(new Animated.Value(1)).current;
    const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const [ cardNum, setCardNum ] = useState(0);
    
    const rotation = position.x.interpolate({
        inputRange: [ -WINDOW_WIDTH / 2, WINDOW_WIDTH / 2 ],
        outputRange: [ "-30deg", "30deg"],
        extrapolate: "clamp" /* No Extra Rotation Out of the Ranges */
    });

    const riseUp = position.x.interpolate({
        inputRange: [ -WINDOW_WIDTH / 2, 0, WINDOW_WIDTH / 2 ],
        outputRange: [ 1, 0.5, 1 ],
        extrapolate: "clamp"
    })

    const onPressIn = Animated.spring(scale, {
        toValue: 0.9,
        useNativeDriver: true
    });

    const onPressOut = Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true
    });

    const goCenter = Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true
    });

    const goLeft = () => Animated.spring(position, {
        toValue: {
            x: -WINDOW_WIDTH * 1.5,
            y: position.y._value
        },
        useNativeDriver: true,
        restDisplacementThreshold: 100,
        restSpeedThreshold: 100
    }).start(changeCard);

    const goRight = () => Animated.spring(position, {
        toValue: {
            x: WINDOW_WIDTH * 1.5,
            y: position.y._value
        },
        useNativeDriver: true,
        restDisplacementThreshold: 100,
        restSpeedThreshold: 100
    }).start(changeCard);

    const changeCard = () => {
        scale.setValue(1);
        position.setValue({ x: 0, y: 0 });
        setCardNum(prev => prev + 1);
    };

    const panResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            onPressIn.start();
            /* Keep the Current Position */
            // position.setOffset({ x: position.x._value, y: position.y._value });
        },
        onPanResponderRelease: (_, { dx }) => {
            Math.abs(dx) > Math.abs(WINDOW_WIDTH * 0.5) ? 
                (dx > 0 ? goRight() : goLeft()) : 
                Animated.parallel([onPressOut, goCenter]).start();
            /* Keep the Current Position*/
            // position.flattenOffset();
            goCenter.start();
        },
        onPanResponderMove: (_, { dx, dy }) => {
            position.setValue({ x: dx, y: dy });
        }
    })).current;

    return (
        <Container>
            <CardContainer>
                <AnimatedCard
                    style={{
                        opacity: riseUp,
                        transform: [
                            { scale: riseUp },
                        ]
                    }}
                >
                    <Ionicons name={vocaList[cardNum + 1]} color="#192a56" size={WINDOW_HEIGHT / 8} />
                </AnimatedCard>
                <AnimatedCard
                    { ...panResponder.panHandlers }
                    style={{
                        transform: [
                            { scale },
                            { translateX: position.x },
                            { translateY: position.y },
                            { rotateZ: rotation }
                        ],
                    }}
                >
                    <Ionicons name={vocaList[cardNum]} color="#192a56" size={WINDOW_HEIGHT / 8} />
                </AnimatedCard>
            </CardContainer>
            <ButtonContainer>
                <Button onPress={goLeft}>
                    <Ionicons name="close-circle" color="#ffffff" size={WINDOW_HEIGHT / 14} />
                </Button>
                <Button onPress={goRight}>
                    <Ionicons name="checkmark-circle" color="#ffffff" size={WINDOW_HEIGHT / 14} />
                </Button>
            </ButtonContainer>
        </Container>
    );
}