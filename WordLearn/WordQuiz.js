import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// Dummy data for words
const dummy_words = [
    {
        wordId: 1,
        word: "단어1",
        mean: "뜻1",
        knowStatus: false
    },
    {
        wordId: 2,
        word: "단어2",
        mean: "뜻2",
        knowStatus: false
    },
    {
        wordId: 3,
        word: "단어3",
        mean: "뜻3",
        knowStatus: false
    },
    {
        wordId: 4,
        word: "단어4",
        mean: "뜻4",
        knowStatus: false
    },
    {
        wordId: 5,
        word: "단어5",
        mean: "뜻5",
        knowStatus: false
    },
    {
        wordId: 6,
        word: "단어6",
        mean: "뜻6",
        knowStatus: false
    },
];

// Home Screen component
export function QuizHomeScreen({ navigation }) {

    const [quizTaken, setQuizTaken] = useState(false);

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
                    onPress={() => navigation.navigate('Quiz')}
                    disabled={quizTaken}
                    style={styles.bannedQuiz}
                    >
                    <Text style={styles.banned}>Banned</Text>
                </TouchableOpacity>
                <Text style={styles.bannedText}>No more chances left!</Text>
            </>
            :  
            <TouchableOpacity
                onPress={() => navigation.navigate('Quiz')}
                disabled={quizTaken}
                style={styles.startQuiz}
                >
                <ImageBackground
                    source={require('../assets/img/startQuiz.png')} // 여기에 이미지 주소를 넣어
                    style={styles.buttonImage}
                    imageStyle={{ borderRadius: 150 }}
                >
                    <Text style={styles.startQuizbuttonText}>START</Text>
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
export function QuizScreen({ navigation }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [remainingTime, setRemainingTime] = useState(5); // 5 seconds countdown
    const [userAnswers, setUserAnswers] = useState([]);
    const [words, setWords] = useState(dummy_words); 
    const [options, setOptions] = useState([])

    // 현재 질문의 단어 가져오기
    const currentWord = currentQuestionIndex < dummy_words.length 
        ? dummy_words[currentQuestionIndex] 
        : null;

    // 랜덤으로 뜻 선택하는 함수
    const getRandomMeans = () => {
        if (!currentWord) {
            return [];
        }
    
        let means = dummy_words.map(word => word.mean);
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
        const updatedWords = words.map(word =>
            word.wordId === currentWord.wordId ? { ...word, knowStatus: isCorrect } : word
        );
        setWords(updatedWords);
        setUserAnswers([...userAnswers, { wordId: currentWord.wordId, isCorrect }]);

        // 다음 질문으로
        if (currentQuestionIndex < dummy_words.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setRemainingTime(5);
        } else {
            setRemainingTime(0);
        }
    };

    // 남은 문제 수 계산하는 함수
    const remainingQuestions = dummy_words.length - currentQuestionIndex;

    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime(remainingTime => remainingTime - 1);
        }, 1000);

        // 시간이 다 되면 다음 질문으로 이동 또는 결과 화면으로
        if (remainingTime === 0) {
            if (currentQuestionIndex < dummy_words.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setRemainingTime(5); // 타이머 재설정
            } else {
                navigation.navigate('Results', { words: words });
            }
        }
        return () => clearInterval(timer);
    }, [remainingTime, currentQuestionIndex, navigation]);

    useEffect(() => {
        // 현재 질문 인덱스가 변경될 때마다 선택지 업데이트
        setOptions(getRandomMeans());
    }, [currentQuestionIndex]);


    if (!currentWord) {
        return <View style={styles.container}><Text>Loading...</Text></View>;
    }

    return (
        <View style={[styles.container, { backgroundColor: 'white' }]}>
            <Text style = {styles.remainingTime}>Time left: {remainingTime}</Text>
            <Text style = {styles.remainingTime}>Questions left: {remainingQuestions}</Text>
            <View style={styles.wordContainer}>
                <Text style={styles.wordText}>{currentWord.word}</Text>
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
export function ResultsScreen({ route, navigation }) {
    const [words, setWords] = useState(null);
    const [totalScore, setTotalScore] = useState(0);

    useEffect(() =>{
        route && setWords(route.params.words);
    }, [route]);

    useEffect(() => {
        if (words) {
            const calculatedScore = calculateTotalScore(words);
            setTotalScore(calculatedScore);
        }
    }, [words]);

    const toggleMeanVisibility = (wordId) => {
        const updatedWords = words.map(word => {
            if (word.wordId === wordId) {
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
                        <TouchableOpacity onPress={() => toggleMeanVisibility(item.wordId)}>
                            <Text style={styles.resultWord}>{item.word}</Text>
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
                keyExtractor={item => item.wordId.toString()}
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