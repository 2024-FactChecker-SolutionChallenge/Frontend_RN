import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, FlatList, Image, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import {LinearGradient} from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import LoadingIndicator from './LoadingIndicator';

export default function FactCheck() {

    const [videos, setVideos] = useState({"data": 
        [
            {   
                "youtubeNews_id" : 1,
                "userId": 1,
                "upload_date" : "유튜브 영상 업로드 날짜",
                "keyword" : "지드래곤 마약",
                "title" : "유튜브 제목",
                "show" : false,
                "loadingStatus" : true,
                // 최근 유튜브 기사
                    "curr_youtube_news": [{
                        // id는 DB에 저장될(클릭될) 뉴스 기사들에 대해서만 부여될거 같아 생략함
                        "id" : 1,
                        "title": "위기 고조1", // string
                        "article": "뉴스 기사 본문1", // string
                        "date" : "뉴스 기사 쓰인 날짜1", // string
                        "credibility" : 0.09 // float
                    },
                    {   
                        "id" : 2,
                        "title": "위기 고조2", // string
                        "article": "뉴스 기사 본문2", // string
                        "date" : "뉴스 기사 쓰인 날짜2", // string
                        "credibility" : 0.09 // float
                    }
                ],
                // 유튜브 업로드 날짜 근방 유튜브 기사
                "rel_youtube_news": [{
                    "id" : 3,
                    "title": "위기 고조3", // string
                    "article": "뉴스 기사 본문3", // string
                    "date" : "뉴스 기사 쓰인 날짜3", // string
                    "credibility" : 0.09 // float
                },
                    {
                    "id" : 4,
                    "title": "위기 고조4", // string
                    "article": "뉴스 기사 본문4", // string
                    "date" : "뉴스 기사 쓰인 날짜4", // string
                    "credibility" : 0.09 // float
                }]	
            },
            {
                "youtubeNews_id" : 2,
                "userId": 1,
                "upload_date" : "유튜브 영상 업로드 날짜2",
                "keyword" : "한소희 안중근 발언",
                "title" : "유튜브 제목2",
                "show" : false,
                "loadingStatus" : false,
                    // 최근 유튜브 기사
                        "curr_youtube_news": [{
                            // id는 DB에 저장될(클릭될) 뉴스 기사들에 대해서만 부여될거 같아 생략함
                            "id" : 1,
                            "title": "위기 고조1", // string
                            "article": "뉴스 기사 본문1", // string
                            "date" : "뉴스 기사 쓰인 날짜1", // string
                            "credibility1" : 0.09 // float
                        },
                        {   
                            "id" : 2,
                            "title": "위기 고조2", // string
                            "article": "뉴스 기사 본문2", // string
                            "date" : "뉴스 기사 쓰인 날짜2", // string
                            "credibility" : 0.09 // float
                        }
                    ],
                    // 유튜브 업로드 날짜 근방 유튜브 기사
                    "rel_youtube_news": [{
                        "id" : 3,
                        "title": "위기 고조3", // string
                        "article": "뉴스 기사 본문3", // string
                        "date" : "뉴스 기사 쓰인 날짜3", // string
                        "credibility" : 0.09 // float
                    },
                        {
                        "id" : 4,
                        "title": "위기 고조4", // string
                        "article": "뉴스 기사 본문4", // string
                        "date" : "뉴스 기사 쓰인 날짜4", // string
                        "credibility" : 0.09 // float
                    }]	
            },
            {
                "youtubeNews_id" : 3,
                "userId": 1,
                "upload_date" : "유튜브 영상 업로드 날짜2",
                "keyword" : "한소희 안중근 발언",
                "title" : "유튜브 제목3",
                "show" : false,
                "loadingStatus" : false,
                    // 최근 유튜브 기사
                        "curr_youtube_news": [{
                            // id는 DB에 저장될(클릭될) 뉴스 기사들에 대해서만 부여될거 같아 생략함
                            "id" : 1,
                            "title": "위기 고조1", // string
                            "article": "뉴스 기사 본문1", // string
                            "date" : "뉴스 기사 쓰인 날짜1", // string
                            "credibility1" : 0.09 // float
                        },
                        {   
                            "id" : 2,
                            "title": "위기 고조2", // string
                            "article": "뉴스 기사 본문2", // string
                            "date" : "뉴스 기사 쓰인 날짜2", // string
                            "credibility" : 0.09 // float
                        }
                    ],
                    // 유튜브 업로드 날짜 근방 유튜브 기사
                    "rel_youtube_news": [{
                        "id" : 3,
                        "title": "위기 고조3", // string
                        "article": "뉴스 기사 본문3", // string
                        "date" : "뉴스 기사 쓰인 날짜3", // string
                        "credibility" : 0.09 // float
                    },
                        {
                        "id" : 4,
                        "title": "위기 고조4", // string
                        "article": "뉴스 기사 본문4", // string
                        "date" : "뉴스 기사 쓰인 날짜4", // string
                        "credibility" : 0.09 // float
                    }]	
            },
            {
                "youtubeNews_id" : 4,
                "userId": 1,
                "upload_date" : "유튜브 영상 업로드 날짜2",
                "keyword" : "한소희 안중근 발언",
                "title" : "유튜브 제목4",
                "show" : false,
                "loadingStatus" : false,
                    // 최근 유튜브 기사
                        "curr_youtube_news": [{
                            // id는 DB에 저장될(클릭될) 뉴스 기사들에 대해서만 부여될거 같아 생략함
                            "id" : 1,
                            "title": "위기 고조1", // string
                            "article": "뉴스 기사 본문1", // string
                            "date" : "뉴스 기사 쓰인 날짜1", // string
                            "credibility1" : 0.09 // float
                        },
                        {   
                            "id" : 2,
                            "title": "위기 고조2", // string
                            "article": "뉴스 기사 본문2", // string
                            "date" : "뉴스 기사 쓰인 날짜2", // string
                            "credibility" : 0.09 // float
                        }
                    ],
                    // 유튜브 업로드 날짜 근방 유튜브 기사
                    "rel_youtube_news": [{
                        "id" : 3,
                        "title": "위기 고조3", // string
                        "article": "뉴스 기사 본문3", // string
                        "date" : "뉴스 기사 쓰인 날짜3", // string
                        "credibility" : 0.09 // float
                    },
                        {
                        "id" : 4,
                        "title": "위기 고조4", // string
                        "article": "뉴스 기사 본문4", // string
                        "date" : "뉴스 기사 쓰인 날짜4", // string
                        "credibility" : 0.09 // float
                    }]	
            }

        ]
    });

    const [ url, setUrl] = useState(null)

    const navigation = useNavigation();
    // 기사 항목을 클릭했을 때 실행될 함수
    const handleItemClick = (articleId) => {
        console.log('Clicked article ID:', articleId);
        navigation.navigate('Check words & Summarize', { articleId });
        // 실제 앱에서는 여기서 상세 페이지로 이동하는 등의 작업을 수행합니다.
    };

    // 뉴스 기사를 렌더링하는 함수입니다.
    const renderArticleItem = ({ item }) => (
        <LinearGradient
        colors={['#FFFFFF', '#FFFFFF']} // Use the two main colors of your gradient
        style = {styles.newsBox}
        >
            <TouchableOpacity activeOpacity={1} onPress={() => handleItemClick(item.id)} style={styles.articleItem}>
                <View style={styles.articleLeft}>
                    <Text style={styles.articleTitle}>{item.title}</Text>
                    <Text style={styles.dateText}>{item.date}</Text>
                </View>
            <Text style = {styles.credibilityText}>{item.credibility*1000}% True</Text>
            </TouchableOpacity>
        </LinearGradient>
    );

    const toggleNewsVisibility = (youtubeNewsId) => {
        setVideos(prevVideos => ({
            ...prevVideos,
            data: prevVideos.data.map(news => {
                if (news.youtubeNews_id === youtubeNewsId) {
                    // 'show' 속성 토글
                    return { ...news, show: !news.show };
                }
                return news;
            })
        }));
    };

    
    const sendUrl = (url) => {
        setUrl(null)
    }


    // 유튜브 영상 항목을 렌더링하는 함수
    const renderVideoItem = ({ item }) => (
        <View>
            {item.loadingStatus ?
                <>  
                    <TouchableOpacity activeOpacity={1}>
                        <LinearGradient
                            colors={['#FFDAAD', '#FFDAAD']} // Use the two main colors of your gradient
                            style={styles.containerYT}
                        >
                        <ActivityIndicator size="large" color ='#EB5929'/>
                        <View style={styles.YTContent}>
                            <Text style={styles.YTTitle}>{item.title}</Text>
                            <Text style={styles.YTdate}>{item.upload_date}</Text>
                        </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </>
            :
            <>
                <TouchableOpacity activeOpacity={1} onPress={() => toggleNewsVisibility(item.youtubeNews_id)}>
                    <LinearGradient
                        colors={['#FFDAAD', '#FFDAAD']} // Use the two main colors of your gradient
                        style={styles.containerYT}
                    >
                    <Image
                    style={styles.imageYT}
                    source={require('./assets/img/video.png')} // 이미지 파일 경로 지정
                    />
                    <View style={styles.YTContent}>
                        <Text style={styles.YTTitle}>{item.title}</Text>
                        <Text style={styles.YTdate}>{item.upload_date}</Text>
                    </View>
                    </LinearGradient>
                </TouchableOpacity>
            </>
            }
            {item.loadingStatus ? 
                <Text style = {styles.keywordText}>Searching & Verifying articles...</Text>
            :
            <Text style = {styles.keywordText}>Searched Keyword : {item.keyword}</Text>}    
            {item.show && (
                <View style = {styles.newsContainer}>
                    <Text style = {styles.newsText}>🐿️ Most Recent</Text>
                    <FlatList
                        data={item.curr_youtube_news}
                        renderItem={renderArticleItem}
                        keyExtractor={(article) => 'curr_' + article.id}
                    />
                    <Text style = {styles.newsText}>🐿️ Most Related</Text>
                    <FlatList
                        data={item.rel_youtube_news}
                        renderItem={renderArticleItem}
                        keyExtractor={(article) => 'rel_' + article.id}
                    />
                </View>
            )}
        </View>
    );
    
    return (
        <>  
            <View style = {styles.container}>
                <View style = {styles.logoContainer}>
                    <Image
                        style={styles.image}
                        source={require('./assets/img/truetree_logo.png')} // 이미지 파일 경로 지정
                    />
                    <Text style = {styles.logoText}>TRUETREE</Text>
                </View>
                <View style={styles.seperatorOne} />
                <FlatList
                    data={videos.data}
                    renderItem={renderVideoItem}
                    keyExtractor={(video) => video.youtubeNews_id.toString()}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <>
                            <Text style={styles.textOne}>Is this youtube news true?</Text>
                            <Text style={styles.textTwo}>Check the facts through related articles</Text>
                            <View style={styles.centeredImageContainer}>
                                <Image
                                    style={styles.imageIsTrue}
                                    source={require('./assets/img/isItTrue.png')}
                                />
                            </View>
                            <View>
                                <TextInput
                                    placeholder="Enter youtube url"
                                    value={url}
                                    onChangeText={setUrl}
                                    style={styles.input}
                                />
                                <TouchableOpacity style = {styles.verifyButtonContainer} onPress={sendUrl}>
                                    <View style={styles.verifyButton}>
                                        <Text style = {styles.verifyButtonText}>Verify</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </>
                    }
                />
            </View>
        </>
    );

}

const styles = StyleSheet.create({
    // container: {
    //     padding: 10,
    //     backgroundColor: '#f9f9f9',
    //     marginBottom: 10,
    // },
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
    imageIsTrue : {
        marginTop : 5,
        marginBottom : 20,
        right : "8%"
    },
    textOne : {
        fontSize: 23,
        color: '#55433B',
        fontWeight : "bold",
        textAlign : 'center'
    }, 
    textTwo : {
        fontSize : 18,
        color: '#55433B',
        fontWeight : "500",
        fontStyle: 'italic',
        textAlign : 'center'
    },
    containerYT: {
        borderColor: '#FF4C00',
        // borderWidth: 1.3,
        borderRadius: 20,
        minHeight: 80,
        padding: 15,
        flexDirection: 'row', // 내용을 행 방향으로 정렬
        alignItems: 'center', // 세로 방향으로 중앙 정렬
        minWidth : "90%",
        marginVertical : 10,
    },
    centeredImageContainer: {
        alignItems: 'center',
    },
    imageYT: {
        width: 40, // 이미지 크기 조정
        height: 40, // 이미지 크기 조정,
        justifyContent : 'center'
    },
    YTContent: {
        flexDirection: 'column', // 수직 방향으로 정렬
        marginLeft: 10,
        maxWidth: "70%", // 최대 너비 조정
        maxHeight : "100%"
    },
    YTTitle: {
        fontSize: 16, // 제목의 글씨 크기를 조정
        fontWeight: 'bold', // 글씨를 굵게
        color : "#55433B"
    },
    YTdate: {
        fontSize: 13,
        color : "#55433B"
    },
    newsBox: {
        maxWidth: "75%",
        marginBottom: 10, // Add some bottom margin to separate each news box
        margin: 7,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius : 20,
        left : "10%",
    },
    articleList: {
        flex: 1,
        left : "10%",
    },
    articleItem: {
        minWidth: "93%",
        minHeight : 80,
        padding: 10,
        borderWidth: 1,
        borderColor: '#fc7012',
        flexDirection: 'row', // Arrange the content in a row
        alignItems: 'center', // Center items along the cross axis
        borderRadius : 20
    },
    articleLeft : {
        flexDirection: 'vertical',
        marginLeft: 10,
        maxWidth : "70%"
    },
    articleTitle: {
        fontWeight: 'bold',
        textAlign: 'left',
        flexShrink: 1,
        color : "#55433B"
    },
    dateText: {
        color : "#55433B"
    },
    credibilityText: {
        textAlign: 'right',
        flex: 1, // Expand to fill available space
        color : "#55433B"
    },
    keywordText : {
        fontSize : 13,
        left : 15,
        color : '#FF4C00',
        fontWeight : "bold",
        marginBottom : 5,
        left : "5%",
    },
    newsText : {
        fontSize : 20,
        left : 15,
        color : "#55433B",
        fontWeight : "500",
        left : "5%",
    }, 
    input : {
        textAlign : 'center',
        backgroundColor : '#e6e6e6',
        borderRadius : 10,
        color : "#55433B",
        paddingVertical : 5,
        marginTop : 3,
    },
    verifyButtonContainer : {
        alignItems : 'center',
        justifyContent : 'center'
    },
    verifyButton : {
        marginVertical : 10,
        backgroundColor : '#ff6a2b',
        width : "100%",
        borderRadius : 10,
    },
    verifyButtonText : {
        color : 'white',
        textAlign : 'center',
        fontSize : 20,
        paddingVertical : 5
    },
    // loading : {
    //     width : 30,
    //     height :30
    // }
});