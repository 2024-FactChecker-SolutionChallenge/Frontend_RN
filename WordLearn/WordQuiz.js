import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'
// import Ionicons from 'react-native-vector-icons/Ionicons';

// Dummy data for words
const dummy_words = [
    {
        id: 1,
        quiz_word: "단어1",
        mean: "뜻1",
        knowStatus: false
    },
    {
        id: 2,
        quiz_word: "단어2",
        mean: "뜻2",
        knowStatus: false
    },
    {
        id: 3,
        quiz_word: "단어3",
        mean: "뜻3",
        knowStatus: false
    },
    {
        id: 4,
        quiz_word: "단어4",
        mean: "뜻4",
        knowStatus: false
    },
];

// Home Screen component
export function QuizHomeScreen({ navigation, accessToken, refreshToken }) {

    const [quizTaken, setQuizTaken] = useState(false);
    const [loading, setLoading] = useState('START');

    const fetchWords = async () => {

        setLoading('Loading Words...');

        try {
            const response = await fetch('http://35.216.92.188:8080/api/study/daily-quiz/word', {
                method: 'GET',
                headers: {
                    "ACCESS_TOKEN": `Bearer ${accessToken}`,
                    "REFRESH_TOKEN": refreshToken
                }
            });

            const json = await response.json();
            
            if (response.ok) {
                console.log("Homescreen")
                console.log(json);
                navigation.navigate('Quiz', { fetchedWords: json });; // 여기에서 Quiz 스크린으로 네비게이션

            } else {
                // 에러 처리
                console.error('Error fetching words');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading('START');
        }
    };
    


    return (
        <View style={[styles.container, { backgroundColor: 'white' }]}>
            <Text style = {styles.dailyQuiz}>Daily Quiz</Text>
            <View style = {styles.explainBox}>
                <Text style = {styles.explain}>Here's a daily quiz for you,</Text>
                <Text style = {styles.explain}>consisting of today's</Text>
                <Text style = {styles.explain}>quite a bit challenging vocabularies.</Text>
                <Text style = {styles.explain}>Take a Quiz Challenge and Level Up!💪🔥</Text>
                <Text style = {styles.explain}>The more you get it right, the more you earn💰</Text>
                <Text style = {styles.explain}>Plus! donate to those in need💸</Text>
            </View>
            {quizTaken? 
            <>
                <TouchableOpacity
                    disabled={quizTaken}
                    style={styles.bannedQuiz}
                    >
                    <Text style={styles.banned}>1 chance</Text>
                    <Text style={styles.banned}>/ 100₩</Text>
                </TouchableOpacity>
                <Text style={styles.bannedText}>No more chances left!</Text>
                <TouchableOpacity>
                    <View style={styles.payButton}>
                        <Text style={styles.payButtonText}>Get more chances!</Text>
                    </View>
                </TouchableOpacity>
            </>
            :  
            <TouchableOpacity
                onPress={fetchWords}
                disabled={quizTaken}
                style={styles.startQuiz}
                >
                <ImageBackground
                    source={require('../assets/img/startQuiz.png')} // 여기에 이미지 주소를 넣어
                    style={styles.buttonImage}
                    imageStyle={{ borderRadius: 150 }}
                >
                    <Text style={styles.startQuizbuttonText}>{loading}</Text>
                    <Text style={styles.chanceLeftText}>Chances left : 1</Text>
                </ImageBackground>
            </TouchableOpacity>
            }
            <View style = {styles.marginBox}>
            </View>
        </View>
    );
}

// Quiz Screen component
// Quiz Screen component
export function QuizScreen({ route, navigation, setShowSwiperButtons }) {

    const { fetchedWords } = route.params;

    // console.log("QuizScreen");
    // console.log(fetchedWords);

    const [ quizWords, setQuizWords ] = useState([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [remainingTime, setRemainingTime] = useState(5); // 5 seconds countdown
    const [userAnswers, setUserAnswers] = useState([]);
    // const [words, setWords] = useState(dummy_words); 
    const [options, setOptions] = useState([])


    useEffect(()=>{
        setQuizWords(fetchedWords);
    },[])

    useFocusEffect(
        React.useCallback(() => {
            // QuizScreen이 포커스 될 때
            setShowSwiperButtons(false);
            return () => {
                // QuizScreen이 포커스를 잃을 때
                setShowSwiperButtons(true);
            };
        }, [])
    );

    // 현재 질문의 단어 가져오기
    const currentWord = currentQuestionIndex < quizWords.length 
        ? quizWords[currentQuestionIndex] 
        : null;

    // 랜덤으로 뜻 선택하는 함수
    const getRandomMeans = () => {
        if (!currentWord || quizWords.length === 0) {
            return [];
        }
    
        let means = quizWords.map(word => word.mean);
        means = means.filter(mean => mean !== currentWord.mean);
        means.sort(() => 0.5 - Math.random());
        const selectedMeans = means.slice(0, 3);
        selectedMeans.push(currentWord.mean); // 현재 단어의 뜻 추가
        selectedMeans.sort(() => 0.5 - Math.random()); // 전체 선택지 랜덤하게 섞기

        return selectedMeans;
    };

    // 답변 처리
    const handleAnswer = (answer) => {
        const isCorrect = answer === currentWord.mean;
        const updatedWords = quizWords.map(word =>
            word.id === currentWord.id ? { ...word, knowStatus: isCorrect } : word
        );
        setQuizWords(updatedWords);
        setUserAnswers([...userAnswers, { id: currentWord.id, isCorrect }]);

        // 다음 질문으로
        if (currentQuestionIndex < quizWords.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setRemainingTime(5);
        } else {
            setRemainingTime(0);
        }
    };

    // 남은 문제 수 계산하는 함수
    const remainingQuestions = quizWords.length - currentQuestionIndex;

    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime(remainingTime => remainingTime - 1);
        }, 1000);

        // 시간이 다 되면 다음 질문으로 이동 또는 결과 화면으로
        if (remainingTime === 0) {
            if (currentQuestionIndex < quizWords.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setRemainingTime(5); // 타이머 재설정
            } else {
                navigation.navigate('Results', { quizWords: quizWords });
            }
        }
        return () => clearInterval(timer);
    }, [remainingTime, currentQuestionIndex, navigation]);

    useEffect(() => {
        setQuizWords(fetchedWords);
    }, [fetchedWords]);
    
    useEffect(() => {
        // 현재 질문 인덱스가 변경될 때마다 선택지 업데이트
        setOptions(getRandomMeans());
    }, [currentQuestionIndex, quizWords]); // quizWords 의존성 추가


    if (!currentWord || quizWords.length === 0) {
        return <View style={styles.container}><Text>Loading...</Text></View>;
    }

    return (
        <View style={[styles.container, { backgroundColor: 'white' }]}>
            <Text style = {styles.remainingTime}>Time left: {remainingTime}</Text>
            <Text style = {styles.remainingTime}>Questions left: {remainingQuestions}</Text>
            <View style={styles.wordContainer}>
                <Text style={styles.wordText}>{currentWord.quiz_word}</Text>
            </View>
            {options.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.button}
                    onPress={() => handleAnswer(option)}
                >
                    <Text style={styles.buttonText}>{option}</Text>
                </TouchableOpacity>
            ))}
            <View style = {styles.marginQuizBox}></View>
        </View>
    );
}


// Results Screen component
export function ResultsScreen({ route, navigation, accessToken, refreshToken}) {
    const [words, setWords] = useState(null);
    const [totalScore, setTotalScore] = useState(null);

    const getDayOfWeek = () => {
        // JavaScript의 Date 객체를 사용하여 현재 날짜를 가져옵니다.
        const today = new Date();
        
        // 요일을 나타내는 숫자를 가져옵니다. (0: 일요일, 1: 월요일, ..., 6: 토요일)
        const dayOfWeek = today.getDay();
    
        // 한국 기준의 요일 이름을 반환합니다.
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        return dayNames[dayOfWeek];
    };

    useEffect(() => {

        const day = getDayOfWeek();

        const fetchData = async () => {
            try {
                const response = await fetch('http://35.216.92.188:8080/api/study/daily-quiz/score', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "ACCESS_TOKEN": `Bearer ${accessToken}`,
                        "REFRESH_TOKEN": refreshToken
                    },
                    body: JSON.stringify({
                        "day" : day,
                        "score" : totalScore
                    })
                });
                
                const json = await response.json();
    
                if (response.ok) {
                    console.log(json);
                } else {
                    console.error('Error fetching words');
                }
            } catch (error) {
                console.error(error);
            }
        };
    
        if (totalScore != null) {
            console.log(totalScore)
            fetchData();
        }
    }, [totalScore, accessToken, refreshToken]);

    useEffect(() => {
        if (route.params?.quizWords) {
            const quizWords = route.params.quizWords;
            setWords(quizWords);
            const calculatedScore = calculateTotalScore(quizWords);
            setTotalScore(calculatedScore);
        }
    }, [route.params]);


    // useEffect(() => {
    //     if (words) {
    //         const calculatedScore = calculateTotalScore(words);
    //         setTotalScore(calculatedScore);
    //     }
    // }, [words]);

    const toggleMeanVisibility = (id) => {
        const updatedWords = words.map(word => {
            if (word.id === id) {
                return { ...word, showMean: !word.showMean };
            }
            return word;
        });
        setWords(updatedWords);
    };

    const calculateTotalScore = (words) => {
        return words.reduce((total, word) => total + (word.knowStatus ? 1 : 0), 0);
    };

    const renderItem = ({ item }) => (
        <View style={{ flex : 1, backgroundColor: 'white' }}>
            <View style={styles.resultWordContainer}>
                    <View style={styles.resultRowContainer}>
                        <TouchableOpacity onPress={() => toggleMeanVisibility(item.id)}>
                            <Text style={styles.resultWord}>{item.quiz_word}</Text>
                        </TouchableOpacity>
                        <Text style={item.knowStatus ? styles.checkMark : styles.crossMark}>
                            {item.knowStatus ? '✔' : '❌'}
                        </Text>
                    </View>
                    {item.showMean && (
                        <View style={styles.meanContainer}>
                            <Text style={styles.mean}>{item.mean}</Text>
                        </View>
                    )}
            </View>
        </View>
        
    );

    return (
        <View style = {[styles.resultContainer, {backgroundColor : 'white'}]}>
            <Text style = {styles.scoreText}>Total Score: {totalScore} / 20</Text>
            <Text style = {styles.resultExplain}>You can check the meaning </Text>
            <Text style = {styles.resultExplain}>by clicking on the word</Text>
            <FlatList
                data={words}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
            <View style={styles.restartContainer}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('QuizHome')}
            >
                <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dailyQuiz : {
        fontSize : 35,
        color : '#55433B',
        fontWeight : 'bold'
    },
    explainBox : {
        marginVertical : 10,
        marginBottom : 10
    },
    explain : {
        fontSize : 16,
        textAlign : 'center'
    },
    startQuiz: {
        backgroundColor: '#ff7e54',
        padding: 10,
        borderRadius: 150, // 수정된 부분: 원형 버튼을 위해
        alignItems: 'center',
        justifyContent: 'center', // 추가된 부분: 세로 중앙 정렬을 위해
        margin: 10,
        width: 200,
        height: 200,
    },
    startQuizbuttonText : {
        fontSize : 30,
        color : '#55433B',
        fontWeight : '500',
        textAlign : 'center',
        top : "110%"
    },
    chanceLeftText : {
        fontSize : 20,
        color : '#55433B',
        fontWeight : '500',
        textAlign : 'center',
        top : "113%"
    },
    bannedQuiz :{
        backgroundColor: '#ff7e54',
        padding: 10,
        borderRadius: 150, // 수정된 부분: 원형 버튼을 위해
        alignItems: 'center',
        justifyContent: 'center', // 추가된 부분: 세로 중앙 정렬을 위해
        margin: 10,
        width: 200,
        height: 200,
        opacity : 0.5
    },
    banned : {
        fontSize : 25,
        color : '#55433B',
        fontWeight : '500',
        textAlign : 'center',
    },
    bannedText : {
        fontSize : 25,
        color : '#55433B',
        fontWeight : '500',
        textAlign : 'center',
    },
    buttonImage: {
        // 이미지가 차지할 영역에 대한 스타일
        width: '100%', // 버튼의 너비와 같게
        height: '100%', // 버튼의 높이와 같게
        resizeMode: 'cover', // 이미지가 영역을 꽉 채우도록
    },
    disabledButton: {
        backgroundColor: '#ffc2ad', // 비활성화 상태일 때의 배경 색상
        padding: 10,
        borderRadius: 5,
        borderRadius: 150, // 수정된 부분: 원형 버튼을 위해
        alignItems: 'center',
        justifyContent: 'center', // 추가된 부분: 세로 중앙 정렬을 위해
        margin: 10,
        width: 200,
        height: 200,
    },
    marginBox : {
        minHeight : "17%"
    },
    payButton : {
        minWidth : "70%",
        backgroundColor : '#ff7e54',
        marginTop : 20,
        paddingVertical : 10,
        borderRadius : 15
    },
    payButtonText : {
        textAlign : 'center',
        color : 'white',
        borderRadius : 20,
        fontWeight : "500",
        fontSize : 18,
    },


    /// Quiz
    remainingTime : {
        fontSize : 20,
        color : '#55433B',
        fontWeight : '500',
        marginBottom : 10,
    },
    button: {
        backgroundColor: '#ff7e54',
        padding: 10, // 버튼 안의 여백(padding)을 조정해줘
        margin: 8, // 버튼 간의 간격(margin)을 조정해줘
        borderRadius: 5, // 버튼의 테두리를 둥글게 만들어줘
        minWidth : "80%",
        maxWidth: "80%",
        marginTop: 20,
    },
    buttonText: {
        color: 'white', // 버튼 텍스트의 색상을 흰색으로 설정해줘
        fontSize: 18, // 버튼 텍스트의 크기를 조정해줘
        textAlign: 'center', // 버튼 텍스트를 가운데 정렬해줘
    },
    marginQuizBox : {
        height : "7%"
    },
    wordContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        margin: 10,
        width: "80%",
        height: "30%",
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5, // 이런 식으로 elevation을 추가해서 그림자 효과를 줄 수 있어
    },
    wordText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },



    ///// result
    resultWordContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    resultRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    resultWord: {
        fontSize: 18,
        minWidth : "90%"
    },
    resultMeanContainer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    resultMean: {
        fontSize: 16,
        fontStyle: 'italic',
        color: 'gray',
    },
    checkMark: {
        color: 'green',
        fontSize: 20
    },
    crossMark: {
        color: 'red',
        fontSize: 20
    },
    wordBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center'
    },
    resultContainer: {
        flex: 1,
    },
    restartContainer: {
        marginBottom: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkMark: {
        color: 'green',
        fontSize: 20,
    },
    crossMark: {
        color: 'red',
        fontSize: 20
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
        color: 'gray',
    },
    scoreText : {
        fontSize : 25,
        textAlign : 'center',
        marginVertical : 15
    }, 
    resultExplain : {
        textAlign : 'center',
        fontSize : 15,
        marginBottom: 3
    }
});