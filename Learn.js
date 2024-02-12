import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { API_KEY } from '@env';

const LearnScreen = () => {
    const route = useRoute();
    const { itemId } = route.params;

    const title = "UN 출신 김정훈, 교통사고 낸 뒤 음주측정 거부…검찰 송치";
    const article = `
        그룹 UN 출신 가수 겸 배우 김정훈씨가 운전 중 사고를 내고는 음주측정을 거부한 혐의로 검찰에 불구속 송치됐다.

        서울 수서경찰서는 차를 몰다 사고를 낸 뒤 음주측정을 거부한 혐의로 김씨를 검찰에 불구속 송치했다고 8일 밝혔다.
        
        경찰에 따르면 김씨는 지난해 12월 29일 오전 3시 30분쯤 서울 강남구 일원동 남부순환로에서 진로를 변경해 앞서가던 차량과 부딪히는 사고를 내고 현장에 출동한 경찰의 음주측정을 거부한 혐의(도로교통법상 음주측정거부)를 받는다.
        
        이 사고로 상대 차량 운전자가 경상을 입어 교통사고처리특례법상 치상 혐의도 적용됐다.
        
        김씨가 음주, 교통과 관련한 사건·사고로 물의를 일으킨 것은 이번이 처음이 아니다. 김씨는 2011년 7월 음주운전 혐의로 입건돼 면허가 취소된 바 있다.
    `;

    const [isSummaryMode, setIsSummaryMode] = useState(false);
    const [highlightMode, setHighlightMode] = useState(false);
    const [selectedWords, setSelectedWords] = useState([]);
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showBox, setShowBox] = useState(false);
    const [dictionaryList, setDictionaryList] = useState([]);
    const [word, setWord] = useState('');
    const [mean, setMean] = useState('');
    

    const addDictionary = (word, mean, selectedWordsGroup ) => {
        // "word" 키가 이미 존재하는지 확인
        if (dictionaryList.some(item => item.word === word)) {
            console.log('이미 추가된 단어입니다.');
            return;
        }

        const saveMeaning = mean

        // 새로운 딕셔너리 생성 및 추가
        const newDictionary = { word, saveMeaning };
        setDictionaryList([...dictionaryList, newDictionary]);

        // 입력 필드 초기화
        setWord('');
        setMean('');
    };

    const deleteDictionary = (wordToDelete) => {
        // 해당 word를 가진 딕셔너리를 찾아 인덱스를 가져옴
        const indexToDelete = dictionaryList.findIndex(item => item.word === wordToDelete);
        
        // 인덱스를 찾은 경우에만 삭제 수행
        if (indexToDelete !== -1) {
            // 인덱스에 해당하는 딕셔너리를 제외한 새 리스트 생성
            const newList = dictionaryList.filter((_, index) => index !== indexToDelete);
            setDictionaryList(newList);
        } else {
            console.log('삭제할 단어를 찾을 수 없습니다.');
        }
    };


    const words = article.split(/\s+/).filter(word => word !== '');
    const { GoogleGenerativeAI } = require("@google/generative-ai");

    // Access your API key as an environment variable (see "Set up your API key" above)
    // const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    async function fetchResponse(word, selectedWordsGroup) {
        setIsLoading(true)
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        const prompt = `${selectedWordsGroup}의 맥락에서 ${word}의 뜻을 1~2줄 이내로 아주 이해하기 쉽게 알려줘. 답변의 총 길이는 1~2줄 이내여야 해. 그리고 답변의 스타일은 사전에 쓰인 뜻을 그대로 알려주는 느낌으로 답변해줘.`
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        setIsLoading(false)
        addDictionary(word, text, selectedWordsGroup)
        return text;
    }
    
    const selectWord = async (word, selectedWordsGroup) => {
        if (highlightMode) {
            if (selectedWords.includes(word)) {
                setSelectedWords(selectedWords.filter(w => w !== word));
                setShowBox(false); // 박스 숨기기
                deleteDictionary(word)
            } else {
                setSelectedWords([...selectedWords, word]);

                try {
                    const text = await fetchResponse(word, selectedWordsGroup); // 결과를 기다림
                    setResponse(`${word} means... \n ${text}`);
                    setShowBox(true); // fetchResponse가 완료된 후에 박스 표시
                } catch{
                    setResponse("응답 오류");
                    setShowBox(true); // fetchResponse가 완료된 후에 박스 표시
                    setIsLoading(false)
                }
            }
        }
    };
    
    

    useEffect(() => {

        if (showBox & !isLoading) {
            setTimeout(() => {
                setShowBox(false);
            }, 4000);
        }
    }, [showBox, isLoading]);

    const toggleHighlightMode = () => {
        if (highlightMode) {
            // Send selectedWords to the backend
            sendWordsToBackend(selectedWords);
            setSelectedWords([]); // Reset selected words
        }
        setHighlightMode(!highlightMode);
    };

    // Dummy function to simulate sending words to backend
    const sendWordsToBackend = (words) => {
        // Implement backend API call here
        setDictionaryList([])
        console.log('Sending words to backend:', dictionaryList);
    };

    const dummy_feedback = '피드백이다.......ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ'

    const [inputText, setInputText] = useState();
    const [feedback, setFeedback] = useState("get a feedback here!");
    const [isFeedbackLoading, setIsFeedbackLoading ] = useState(false)

    async function fetchFeedback(summary) {

        setIsFeedbackLoading(true)

        try {
            // For text-only input, use the gemini-pro model
            const model = genAI.getGenerativeModel({ model: "gemini-pro"});
            const prompt = `${article} + "이 본문을 가지고 요약을 1~3줄로 다음과 같이 해봤어 : " + ${summary} + '이 기사 내용을 잘 요약한건지 3~4줄로 피드백을 해주고 더 나은 요약을 제공해줘. 답변 길이는 3~4줄 이내여야 해.`
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            return text;
        } catch {
            return "서버 응답 오류"
        }
    }

    onPress = async () => {
        const feedback = await fetchFeedback(inputText)
        setFeedback(feedback)
        setIsFeedbackLoading(false)
    }


    return (
        <View style = {[styles.container, {backgroundColor : 'white'}]}>
        <View style={styles.toggleContainer}>
            <Switch
                onValueChange={() => setIsSummaryMode(!isSummaryMode)}
                value={isSummaryMode}
                style={styles.toggle}
                trackColor={{ false: "#c9c9c9", true: '#c9c9c9' }} // 꺼짐/켜짐 상태의 트랙 색상
                thumbColor={isSummaryMode ? "#EB5929" : "#EB5929"} // 손잡이 색상
            />
            <Text style={styles.modeText}>{isSummaryMode ? 'Summarize Mode' : 'Check Words Mode'}</Text>
            {isSummaryMode ? 
                <Text style = {styles.nonHighlightModeButton}></Text> : 
                <TouchableOpacity
                    style={styles.highlightModeButton}
                    onPress={toggleHighlightMode}
                > 
                    <Text style = {{textAlign : 'center'}}>{highlightMode ? `Save\nwords` : <Icon name="highlighter" size={30} color="#ff0" />}</Text>
                </TouchableOpacity>
            }
        </View>
        {isSummaryMode ? 
        <View style = {styles.explainTexts}>
            <Text style={styles.explainText}>Summarize and get a brief feedback!</Text>
        </View>
        : <View style = {styles.explainTexts}>
            <Text style={styles.explainText}>check the words you don't know!</Text>
            <Text style={styles.explainText}>you can save the word & meaning in your vocab list</Text>
        </View>}
        <ScrollView showsVerticalScrollIndicator={false} style={isSummaryMode ? styles.summaryArticle : styles.article}>
            {isSummaryMode ? (
                <>
                    <TextInput
                        style={styles.textInput}
                        multiline={true} // 여러 줄 입력 가능하게 설정
                        onChangeText={text => setInputText(text)}
                        value={inputText}
                        placeholder = "Summarize here!"
                    ></TextInput>
                    <TouchableOpacity style={styles.button} onPress={onPress}>
                        <Text style={styles.buttonText}>Get a Feedback!</Text>
                    </TouchableOpacity>
                    <View style = {styles.feedbackBox}>
                        {isFeedbackLoading ?
                        <>
                            <ActivityIndicator size="large" color ='#EB5929'/>
                            <Text style = {{textAlign : 'center', marginTop : 10}}>Recieving Feedback...</Text>
                        </>
                        : 
                        <Text style = {styles.feedbackText}>{feedback}</Text>}
                    </View>
                    </>
                
            ) : (
                <View style={styles.articleText}>
                    {highlightMode ? words.map((word, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                // 현재 단어와 그 앞뒤 단어들 선택
                                const selectedWordsGroup = [
                                    ...(index > 1 ? [words.slice(index - 2, index)] : []), // 앞 단어 (있으면)
                                    word, // 현재 단어
                                    ...(index < words.length - 2 ? [words.slice(index, index+2)] : []), // 뒤 단어 (있으면)
                                ].join(" ");;
                                console.log(selectedWordsGroup)
                                selectWord(word, selectedWordsGroup);
                            }}
                            style={highlightMode && selectedWords.includes(word) ? styles.highlightedWord : styles.word}
                        >
                            <Text style={styles.wordSize}>
                                {word} 
                                {index < words.length - 1 ? ' ' : ''}
                            </Text>
                        </TouchableOpacity>
                    )) : 
                    words.map((word, index) => (
                        <View 
                            key={index}
                            style={highlightMode && selectedWords.includes(word) ? styles.highlightedWord : styles.word}
                        >
                            <Text style={styles.wordSize}>
                                {word} 
                                {index < words.length - 1 ? ' ' : ''}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
        {isLoading && 
            <View style={styles.overlay}>
                <ActivityIndicator size="large" color ='#EB5929'/> 
            </View>
        }
        {showBox && 
            <View style={styles.overlay}>
                <Text style={styles.responseText}>{response}</Text>
            </View>
        } 
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        alignSelf: 'flex-start', // 부모 컨테이너의 시작 부분에 정렬
        padding: 20, // 텍스트 주위에 약간의 여백을 추가
        fontSize: 20,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // 요소들을 컨테이너 양쪽 끝으로 정렬
        alignItems: 'center',
        margin: 20,
        backgroundColor: '#f0f0f0',
        borderRadius : 50
    },
    toggle : {
        position: "relative",
        left: "-63%",
        transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }], // 크기 조절
        trackColor: { false: '#767577', true: 'orange' }, // 토글바 배경색
        thumbColor: '#f4f3f4', // 토글 버튼 색상
        ios_backgroundColor: '#3e3e3e', // iOS에서의 배경색
        paddingTop: 10, // 상하 여백
        paddingHorizontal: 20, // 좌우 여백
    },
    modeText : {
        textAlign : 'center',
        left : "-26%",
        fontWeight : "bold",
        color : '#55433B'
    },
    explainTexts : {
        textAlign : 'center',
        marginBottom : 10,
        top : -10
    },
    explainText : {
        textAlign : 'center',
        color : '#55433B'
    },
    summaryArticle: {
        fontSize: 16,
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    container: {
        flex: 1,
        margin: 10,
    },
    highlightModeButton: {
        padding: 10,
        backgroundColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-between', // 요소들을 컨테이너 양쪽 끝으로 정렬
        alignItems: 'center',
        borderRadius : 100
        // alignSelf: 'flex-start',
        // marginBottom: 10,
    },
    nonHighlightModeButton : {
        width : 55,
        height:55,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between', // 요소들을 컨테이너 양쪽 끝으로 정렬
        alignItems: 'center',
        borderRadius : 100
    },
    highlightedWord: {
        backgroundColor: '#FFFC70',
        marginVertical: 5, // margin 대신 padding 사용
    },
    articleText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 20,
    },
    word : {
        marginVertical : 5,
    },
    wordSize : {
        fontSize : 18
    },
    textInput: {
        borderWidth : 1.2,
        borderColor : '#c9c9c9',
        backgroundColor: '#fafafa',
        borderRadius : 10,
        padding: 10,
        height: 150, // 필요한 크기에 따라 조정
        textAlign : 'center'
    },
    button: {
        backgroundColor: '#EB5929', // 버튼의 배경색
        padding: 10, // 버튼 안쪽의 여백
        borderRadius: 5, // 버튼의 모서리 둥글기
        alignItems: 'center', // 텍스트를 중앙에 정렬
        justifyContent : 'center',
        minWidth : "50%",
        marginTop : 10,
    },
    buttonText: {
        color: 'white', // 텍스트 색상
        fontSize: 16, // 텍스트 크기
    },
    feedbackBox : {
        marginTop : 20
    },
    feedbackText : {
        color : '#55433B',
        fontSize : 15,
        textAlign : 'center'
    },
    overlay: {
        position: 'absolute',
        maxWidth : "100%",
        minHeight : 70,
        left: "5%",
        right: "5%",
        bottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign : 'center',
        backgroundColor: '#ffc4b0', // 반투명 배경
        borderRadius : 15,
        paddingVertical : 2,
        paddingHorizontal : 3,
    },
    responseText: {
        color : '#55433B',
        fontSize : 15,
        textAlign : 'center'
    },
});

export default LearnScreen;
