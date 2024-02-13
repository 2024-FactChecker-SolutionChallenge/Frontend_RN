import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, FlatList, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import {LinearGradient} from 'expo-linear-gradient';

const HomeScreen = ({route}) => {
    const { accessToken, refreshToken } = route.params;

    const navigation = useNavigation();
    const [selectedSection, setSelectedSection] = useState(null);
    
    const sections = {
        100: 'Politics',
        101: 'Economy',
        102: 'Society',
        103: 'Lifestyle & Culture',
        104: 'World',
        105: 'IT & Science'
    }

    const [ articles, setArticles ] = useState({
        "data": {
            "interest_article": [
                {
                    "id" : 1,
                    "title": "[속보] 지드래곤 마약 입건", // string
                    "article":"뉴스기사 본문", // string
                    "date" : "뉴스 기사 쓰인 날짜", // string
                    "section" : 100, // int
                    // 정치 : 100 / 경제 : 101 / 사회 : 102 / 생활문화 : 103 / 세계 : 104 / IT과학 : 105 /
                    "credibility": 0.09, // float
                },
                {
                    "id" : 2,
                    "title": "뉴스기사 제목2", // string
                    "article":"뉴스기사 본문", // string
                    "date" : "뉴스 기사 쓰인 날짜", // string
                    "section" : 101, // int
                    // 정치 : 100 / 경제 : 101 / 사회 : 102 / 생활문화 : 103 / 세계 : 104 / IT과학 : 105 /
                    "credibility": 0.09,     // float
                },
                {
                    "id" : 3,
                    "title": "뉴스기사 제목3", // string
                    "article":"뉴스기사 본문", // string
                    "date" : "뉴스 기사 쓰인 날짜", // string
                    "section" : 100, // int
                    // 정치 : 100 / 경제 : 101 / 사회 : 102 / 생활문화 : 103 / 세계 : 104 / IT과학 : 105 /
                    "credibility": 0.09, // float
                },
                {
                    "id" : 4,
                    "title": "뉴스기사 제목4", // string
                    "article":"뉴스기사 본문", // string
                    "date" : "뉴스 기사 쓰인 날짜", // string
                    "section" : 100, // int
                    // 정치 : 100 / 경제 : 101 / 사회 : 102 / 생활문화 : 103 / 세계 : 104 / IT과학 : 105 /
                    "credibility": 0.09,     // float
                },
                {
                    "id" : 5,
                    "title": "뉴스기사 제목5", // string
                    "article":"뉴스기사 본문", // string
                    "date" : "뉴스 기사 쓰인 날짜", // string
                    "section" : 100, // int
                    // 정치 : 100 / 경제 : 101 / 사회 : 102 / 생활문화 : 103 / 세계 : 104 / IT과학 : 105 /
                    "credibility": 0.09,     // float
                },
            ]
        }
    })

    const handleItemClick = (itemId) => {
        navigation.navigate('Check words & Summarize', { itemId });
    };

    const filterArticlesBySection = (sectionId) => {
        // 이미 선택된 섹션이 다시 클릭된 경우 선택 해제
        if (selectedSection === sectionId) {
            setSelectedSection(null);
        } else {
            // 다른 섹션이 클릭되면 선택 상태 업데이트
            setSelectedSection(sectionId);
        }
    };
    

    const renderArticleItem = ({ item }) => (
        <LinearGradient
        colors={['#FFFFFF', '#FFFFFF']} // Use the two main colors of your gradient
        style = {styles.newsBox}
        >
            <TouchableOpacity activeOpacity={1} onPress={() => handleItemClick(item.id)} style={styles.articleItem}>
                <View style={styles.articleLeft}>
                    <Text style={styles.articleTitle}>{item.title}</Text>
                    <Text style={styles.date}>{item.date}</Text>
                </View>
            <Text style = {styles.credibilityText}>{item.credibility*1000}% True</Text>
            </TouchableOpacity>
        </LinearGradient>
    );

    return (
        <View style={styles.container}>
            <View style = {styles.logoContainer}>
                <Image
                    style={styles.image}
                    source={require('./assets/img/truetree_logo.png')} // 이미지 파일 경로 지정
                />
                <Text style = {styles.logoText}>TRUETREE</Text>
            </View>
            <View style={styles.seperatorOne} />
            {/* <View style={styles.seperatorTwo} /> */}
            <ScrollView style={styles.sectionBar} horizontal={true} showsHorizontalScrollIndicator={false}>
                {Object.entries(sections).map(([key, value]) => (
                    <TouchableOpacity 
                        activeOpacity={1}
                        key={key} 
                        style={[
                            styles.sectionButton,
                            selectedSection === key && styles.sectionButtonSelected, // 현재 선택된 섹션 스타일
                        ]}
                        onPress={() => filterArticlesBySection(key)}
                    >
                        <Text style={selectedSection === key ? styles.sectionTextSelected : styles.sectionText}>{value}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <FlatList
                data={articles.data.interest_article.filter(article => selectedSection == null || article.section === parseInt(selectedSection))}
                renderItem={renderArticleItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.articleList}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <LinearGradient
                        colors={['#f7be7c', '#f5a984']} // Use the two main colors of your gradient
                        style={styles.card}
                        >
                        <View style = {styles.gradientContainer}>
                            <Image source={require('./assets/img/truetree_다람쥐.png')} style={styles.imagesq} />
                            <View style = {styles.gradientTextContainer}>
                            <Text style={styles.text}>
                                Check out
                            </Text>
                            <Text style={styles.text}>
                                the up-to-date articles
                            </Text>
                            <Text style={styles.text}>
                                of your interest
                            </Text>
                            <Text style={styles.text}>
                                with verified reliability!
                            </Text>
                            </View>
                        </View>
                    </LinearGradient>
                }
            />

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
    sectionBar: {
        // backgroundColor: 'blue',
        marginHorizontal : 10,
        paddingHorizontal: 10,
        paddingVertical : 8,
        maxHeight: 50, // 카테고리 바의 최대 높이를 제한
    },
    sectionButton: {
        paddingVertical: 5,
        paddingHorizontal: 12,
        backgroundColor: '#e0e0e0',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    sectionButtonSelected: {
        backgroundColor: '#EB5929', // 선택된 버튼의 배경색
    },
    sectionText: {
        fontSize: 14,
        color : '#55433B',
    },
    sectionTextSelected: {
        fontSize: 14,
        color : "white"
    },
    card: {
        margin: 15,
        borderRadius: 20,
        padding: 25,
        alignItems: 'center', // This aligns children along the cross axis of the current line, similar to 'align-items' in CSS
        justifyContent: 'center', // This defines the alignment along the main axis, similar to 'justify-content' in CSS
        shadowColor: '#EAEAEA',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        maxWidth: "100%",
        minHeight: "23%",
        backgroundColor: '#FFFFFF', // Don't forget to set a background color
    },
    imagesq: {
        width: 100,
        height: 100,
        marginRight : 15, // Add some margin to the right of the image, if needed
    },
    gradientContainer: {
        flexDirection: 'row', // Set the children to be in a row
        alignItems: 'center', // Align children vertically in the middle
        width: '100%', // Ensure the container takes the full width of the card
    },
    gradientTextContainer : {
        flexDirection : 'column',
        fontWeight: '300',
        maxHeight : 100
    },
    text: {
        fontSize: 18,
        fontWeight : "500",
        color: '#55433B',
        textAlign: 'right',
        flex: 1, // Allow text to fill the remaining space
        height : "7%"
    },
    newsBox: {
        minWidth: "75%",
        marginBottom: 10, // Add some bottom margin to separate each news box
        margin: 7,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius : 20
    },
    articleList: {
        flex: 1,
    },
    articleItem: {
        minWidth: "94%",
        minHeight : 80,
        padding: 10,
        borderWidth: 1.2,
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
    
});

export default HomeScreen;
