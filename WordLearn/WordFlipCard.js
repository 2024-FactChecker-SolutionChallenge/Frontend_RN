import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const vocabulary = [
    { word: 'Word 1', meaning: 'Meaning 1' },
    { word: 'Word 2', meaning: 'Meaning 2' },
    // ... more words
];

const FlipCard = ({ front, back, isFlipped, onPress }) => {
    const animatedValue = useRef(new Animated.Value(isFlipped ? 180 : 0)).current;
    const value = useRef(0);

    animatedValue.addListener(({ value }) => {
        value.current = value;
    });

    useEffect(() => {
        Animated.spring(animatedValue, {
            toValue: isFlipped ? 180 : 0,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
    }, [isFlipped]);

    const flipCard = () => {
        onPress(); // 클릭 이벤트 전달
    };

    const frontAnimatedStyle = {
        transform: [
            {
                rotateY: animatedValue.interpolate({
                    inputRange: [0, 180],
                    outputRange: ['0deg', '180deg'],
                }),
            },
        ],
    };

    const backAnimatedStyle = {
        transform: [
            {
                rotateY: animatedValue.interpolate({
                    inputRange: [0, 180],
                    outputRange: ['180deg', '360deg'],
                }),
            },
        ],
        opacity: animatedValue.interpolate({
            inputRange: [89, 90],
            outputRange: [0, 1],
        }),
    };

    return (
        <View>
            <Text style = {styles.resultExplain}>Flip-Flop and Memorize</Text>
            <Text style = {styles.resultExplain}>The words you don't know!</Text>
            <TouchableOpacity onPress={flipCard} style={styles.cardContainer}>
                <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
                    <Text style={styles.flipText}>{front}</Text>
                </Animated.View>
                <Animated.View style={[styles.flipCard, styles.flipCardBack, backAnimatedStyle]}>
                    <Text style={styles.flipText}>{back}</Text>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

const VocabularyLearningScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const goToNextWord = () => {
        setCurrentIndex(currentIndex === vocabulary.length - 1 ? 0 : currentIndex + 1);
        setIsFlipped(false);
    };

    const goToPreviousWord = () => {
        setCurrentIndex(currentIndex === 0 ? vocabulary.length - 1 : currentIndex - 1);
        setIsFlipped(false);
    };

    const word = vocabulary[currentIndex].word;
    const meaning = vocabulary[currentIndex].meaning;

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={goToPreviousWord} style={styles.arrowButtonContainer}>
                <Text style={styles.arrowButton}>&lt;</Text>
            </TouchableOpacity>
            <FlipCard 
                front={word} 
                back={meaning} 
                isFlipped={isFlipped} 
                onPress={() => setIsFlipped(!isFlipped)} 
            />
            <TouchableOpacity onPress={goToNextWord} style={styles.arrowButtonContainer}>
                <Text style={styles.arrowButton}>&gt;</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 20,
    },
    cardContainer: {
        width: width * 0.8,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop : -150
    },
    flipCard: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        backfaceVisibility: 'hidden',
        position: 'absolute',
        borderRadius : 15,
        borderColor : '#a8a7a7',
        borderWidth : 0.8,
        elevation: 0,
    },
    flipCardBack: {
        backfaceVisibility: 'hidden',
    },
    flipText: {
        fontSize: 20,
        color: 'black',
        position: 'absolute',
        color : '#594e48',
    },
    arrowButtonContainer: {
        width: 75,
        height: 75,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        marginTop : 250,
        marginHorizontal : 100,
        backgroundColor : '#ff7e54'
    },
    arrowButton: {
        fontSize: 50,
        color: 'grey',
        position : "relative",
        marginTop : -10,
        marginHorizontal : 3,
        color : 'white',
    },
    resultExplain : {
        textAlign : 'center',
        fontSize : 18,
        marginBottom: 3,
        top: "-30%"
    }
});

export default VocabularyLearningScreen;
