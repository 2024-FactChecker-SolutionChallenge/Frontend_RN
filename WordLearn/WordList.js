import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QuizHomeScreen, QuizScreen, ResultsScreen } from './WordQuiz';
import VocabularyLearningScreen from './WordFlipCard';
import { useNavigation } from '@react-navigation/native';


const QuizStack = createNativeStackNavigator();


const QuizNavigator = ({ setShowSwiperButtons }) => {
    return (
    <QuizStack.Navigator initialRouteName="QuizHome">
        <QuizStack.Screen name="QuizHome" component={QuizHomeScreen} options={{ headerShown: false }} />
        <QuizStack.Screen 
        name="Quiz" 
        options={{ headerShown: false }}>
        {props => <QuizScreen {...props} setShowSwiperButtons={setShowSwiperButtons} />}
        </QuizStack.Screen>
        <QuizStack.Screen 
        name="Results" 
        options={{ headerShown: false }}>
        {props => <ResultsScreen {...props} setShowSwiperButtons={setShowSwiperButtons} />}
        </QuizStack.Screen>
    </QuizStack.Navigator>
    );
};


// Assuming you have a function to fetch words from your backend
const fetchWords = async () => {
    // Your fetch logic here
};

// Function to send PATCH request to update the word status
const updateWordStatus = async (wordId, newStatus) => {
    // Your patch logic here
};

const word_dummy = [{
    wordId: 1,
    word: "단어",
    mean: "뜻",
    knowStatus: true
},
{
    wordId: 2,
    word: "단어2",
    mean: "뜻2",
    knowStatus: true
},
{
    wordId: 3,
    word: "단어3",
    mean: "뜻3",
    knowStatus: true
},]

const WordList = () => {
    const [words, setWords] = useState();

    const navigation = useNavigation();

    useEffect(() => {
        // Fetch words when the component mounts
        const getWords = async () => {
            // const wordsFromServer = await fetchWords();
            // Simulate fetching words from server
            const wordsFromServer = [...word_dummy]; // Use spread operator to simulate a fetched array
            setWords(wordsFromServer);
        };
        getWords();
    }, []);

    const handleToggleWordStatus = (wordId, currentStatus) => {
        const newStatus = !currentStatus;
        // Update the status in the server
        updateWordStatus(wordId, newStatus).then(() => {
            // Update the status in the local state
            setWords(words.map(word => {
                if (word.wordId === wordId) {
                    return { ...word, knowStatus: newStatus };
                }
                return word;
            }));
        }).catch(error => {
            console.error('Error updating word status:', error);
        });
    };

    const toggleMeanVisibility = (wordId) => {
        setWords(words.map(word => {
            if (word.wordId === wordId) {
                return { ...word, showMean: !word.showMean };
            }
            return word;
        }));
    };

    const renderItem = ({ item }) => (
        <View style={styles.wordContainer}>
            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={() => toggleMeanVisibility(item.wordId)}>
                    <Text style={styles.word}>{item.word}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleToggleWordStatus(item.wordId, item.knowStatus)}>
                    <Text style={item.knowStatus ? styles.checkMark : styles.crossMark}>
                        {item.knowStatus ? '✔' : '❌'}
                    </Text>
                </TouchableOpacity>
            </View>
            {item.showMean && (
                <View style={styles.meanContainer}>
                    <Text style={styles.mean}>{item.mean}</Text>
                </View>
            )}
        </View>
    );

    const [showSwiperButtons, setShowSwiperButtons] = useState(true);

    // navigation 이벤트 리스너를 통해 현재 스크린 이름을 체크하고 버튼 표시 상태를 결정
    // useEffect(() => {
    
    // const unsubscribe = navigation.addListener('state', (e) => {
    //     // 현재 활성화된 스크린 이름 가져오기
    //     const routeName = e.data.state?.routes[e.data.state.index]?.name;
    //     console.log(routeName)

    //     // QuizScreen 또는 ResultsScreen일 때 버튼 숨기기
    //     if (routeName === 'Quiz' || routeName === 'Results') {
    //     setShowSwiperButtons(false);
    //     } else {
    //     setShowSwiperButtons(true);
    //     }
    // });
    // // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    // return unsubscribe;
    // }, [navigation]);

    return (
        <>
        <View style = {[styles.container, {backgroundColor : 'white'}]}>
            <View style = {styles.logoContainer}>
                <Image
                    style={styles.image}
                    source={require('../assets/img/truetree_logo.png')} // 이미지 파일 경로 지정
                />
                <Text style = {styles.logoText}>TRUETREE</Text>
            </View>
            <View style={styles.seperatorOne} />
            <Swiper
                // showsButtons={false} 
                loop={false} 
                showsPagination={showSwiperButtons} // Control pagination visibility
                scrollEnabled = {showSwiperButtons}
                activeDotColor = '#FF4C00'
                index={1}>
                <View style={styles.slide}>
                    <Text style = {styles.resultExplain}>You can check the meaning </Text>
                    <Text style = {styles.resultExplain}>by clicking on the word</Text>
                    <Text style = {styles.resultExplain}>You can also change the know/unknow status </Text>
                    <Text style = {styles.resultExplain}>by clicking on the toggle icon</Text>
                    <FlatList
                        data={words}
                        renderItem={renderItem}
                        keyExtractor={item => item.wordId.toString()}
                    />
                </View>
                <QuizNavigator setShowSwiperButtons={setShowSwiperButtons}/>
                <VocabularyLearningScreen/>
            </Swiper>
        </View>
            
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row', // Aligns children in a row
        alignItems: 'center', // Centers children vertically in the container
        marginHorizontal : '3%',
        maxHeight : "10%",
        paddingTop : "1%"
    },
    image: {
        width: 40,
        height: 40,
        marginLeft : "3%", // Add some margin to the right of the image, if needed
    },
    logoText: {
        fontSize: 20,
        color: '#5B882C',
        fontWeight: '400', // Makes the font weight thinner
        flex: 1, // Takes up all available space in the row
        textAlign: 'center', // Centers the text horizontally,
        right: "260%"
    },
    seperatorOne : {
        marginTop : 5,
        marginBottom : 8,
        height: 3, // 선의 두께를 조절합니다.
        width: '100%', // 구분선의 너비를 조절합니다. 로고와 텍스트의 절반만큼의 길이로 설정합니다.
        backgroundColor: '#5B882C', // 초록색으로 설정합니다.
        borderWidth: 1, // 선의 두께를 조절합니다.
        borderColor: '#5B882C', // 초록색으로 경계선을 설정합니다.
    },
    seperatorTwo : {
        height: 1, // 선의 두께를 조절합니다.
        width: '100%', // 구분선의 너비를 조절합니다. 로고와 텍스트의 절반만큼의 길이로 설정합니다.
        backgroundColor: '#5B882C', // 초록색으로 설정합니다.
        borderWidth: 1, // 선의 두께를 조절합니다.
        borderColor: '#5B882C', // 초록색으로 경계선을 설정합니다.
        marginTop : 5,
        marginBottom : 8,
    },
    wordContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    word: {
        fontSize: 18,
        minWidth : "90%",
        color : "#55433B"
    },
    meanContainer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    mean: {
        fontSize: 16,
        fontStyle: 'italic',
        color : "#594e48"
    },
    checkMark: {
        color: 'green',
        fontSize: 20
    },
    crossMark: {
        color: 'red',
        fontSize: 20
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wordBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center'
    },
    resultExplain : {
        textAlign : 'center',
        fontSize : 15,
        marginBottom: 3,
        color : "#55433B"
    }
});

export default WordList;
