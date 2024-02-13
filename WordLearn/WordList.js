import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QuizHomeScreen, QuizScreen, ResultsScreen } from './WordQuiz';
import VocabularyLearningScreen from './WordFlipCard';
import { useNavigation } from '@react-navigation/native';


const QuizStack = createNativeStackNavigator();


const QuizNavigator = ({ setShowSwiperButtons, accessToken, refreshToken, currentSwipeIndex }) => {
    return (
        <QuizStack.Navigator initialRouteName="QuizHome">
            <QuizStack.Screen 
                name="QuizHome" 
                options={{ headerShown: false }}>
                {props => <QuizHomeScreen {...props} setShowSwiperButtons={setShowSwiperButtons} accessToken={accessToken} refreshToken={refreshToken} currentSwipeIndex = {currentSwipeIndex}/>}
            </QuizStack.Screen>
            <QuizStack.Screen 
                name="Quiz" 
                options={{ headerShown: false }}>
                {props => <QuizScreen {...props} setShowSwiperButtons={setShowSwiperButtons} accessToken={accessToken} refreshToken={refreshToken} currentSwipeIndex = {currentSwipeIndex}/>}
            </QuizStack.Screen>
            <QuizStack.Screen 
                name="Results" 
                options={{ headerShown: false }}>
                {props => <ResultsScreen {...props} setShowSwiperButtons={setShowSwiperButtons} accessToken={accessToken} refreshToken={refreshToken} currentSwipeIndex = {currentSwipeIndex}/>}
            </QuizStack.Screen>
        </QuizStack.Navigator>
    );
};

const word_dummy = [{
    id : 1,
    word: "단어",
    mean: "뜻",
    createdDate: "2024-02-10T20:26:04.000+00:00",
    modifiedDate: "2024-02-10T20:26:04.000+00:00",
    knowStatus: true
},
{
    id: 2,
    word: "단어2",
    mean: "뜻2",
    createdDate: "2024-02-10T20:26:04.000+00:00",
    modifiedDate: "2024-02-10T20:26:04.000+00:00",
    knowStatus: true
},
{
    id: 3,
    word: "단어3",
    mean: "뜻3",
    createdDate: "2024-02-10T20:26:04.000+00:00",
    modifiedDate: "2024-02-10T20:26:04.000+00:00",
    knowStatus: true
},]

const WordList = ({route}) => {

    const { accessToken, refreshToken } = route.params;

    const [words, setWords] = useState();

    const navigation = useNavigation();

    const headers_config = {
        "ACCESS_TOKEN": `Bearer ${accessToken}`,
        "REFRESH_TOKEN": refreshToken
    };
    
    useEffect(() => {
        const fetchWords = async () => {
            fetch('http://35.216.92.188:8080/api/words', {
                method: 'GET',
                headers: headers_config  // 헤더 추가
            })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                setWords(json);
            })
            .catch((error) => {
                console.error(error);
            });
        };
        fetchWords();
    }, [currentSwipeIndex]);

    // Function to send PATCH request to update the word status
    const updateWordStatus = async (wordId, newStatus) => {
        // Your patch logic here
    };

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
                <TouchableOpacity onPress={() => toggleMeanVisibility(item.id)}>
                    <Text style={styles.word}>{item.word}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleToggleWordStatus(item.id, item.knowStatus)}>
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
    
    const [currentSwipeIndex, setCurrentSwipeIndex] = useState(1); // Swiper의 현재 인덱스를 추적하는 상태
    const [showSwiperButtons, setShowSwiperButtons] = useState(true);

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
                loop={false}
                showsPagination={showSwiperButtons} // 버튼 표시 여부
                scrollEnabled={showSwiperButtons}
                activeDotColor='#FF4C00'
                index={1}
                onIndexChanged={(index) => setCurrentSwipeIndex(index)}>
                <View style={styles.slide}>
                    <Text style = {styles.resultExplain}>You can check the meaning </Text>
                    <Text style = {styles.resultExplain}>by clicking on the word</Text>
                    <Text style = {styles.resultExplain}>You can also change the know/unknow status </Text>
                    <Text style = {styles.resultExplain}>by clicking on the toggle icon</Text>
                    {words.length > 0 ?<FlatList
                        data={words}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                    /> :
                    <Text style ={{
                        color : '#FF4C00',
                        textAlign : 'center',
                        marginTop : "50%",
                        fontSize : 15,
                    }}>Check & Save Words from the article!</Text>}   
                </View>
                <QuizNavigator 
                    setShowSwiperButtons={setShowSwiperButtons} 
                    accessToken = {accessToken} 
                    refreshToken = {refreshToken}
                    currentSwipeIndex = {currentSwipeIndex}
                    />
                <VocabularyLearningScreen 
                accessToken = {accessToken} 
                refreshToken = {refreshToken}
                currentSwipeIndex = {currentSwipeIndex}/>
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
