import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  FlatList,
  ScrollView,
} from "react-native";
import { CircularProgress } from "react-native-circular-progress";
import Svg, { Circle } from "react-native-svg";

function MyPage({ route }) {
  const { accessToken, refreshToken } = route.params;

  // 예시 데이터
  const [articlesReadThisWeek, setArticlesReadThisWeek] = useState(0);
  const [totalArticlesGoal, setTotalArticlesGoal] = useState(0);
  const [quizScoreThisWeek, setQuizScoreThisWeek] = useState(0);
  const [totalQuizScoreGoal, setTotalQuizScoreGoal] = useState(0);
  const [nickname, setNickName] = useState(null);
  const [tier, setTier] = useState(null);
  const [opacity, setOpacity] = useState(null);

  const fetchMyPage = async () => {
    try {
      const response = await fetch("http://35.216.92.188:8080/api/analytics/", {
        method: "GET",
        headers: {
          ACCESS_TOKEN: `Bearer ${accessToken}`,
          REFRESH_TOKEN: refreshToken,
        },
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const json = await response.json();
      console.log("fetch data", json);
      // setArticlesReadThisWeek(json.weekly_total_read);
      setArticlesReadThisWeek(7);
      setTotalArticlesGoal(json.weekly_read_goal);
      // setQuizScoreThisWeek(json.weekly_total_quiz);
      setQuizScoreThisWeek(26);
      setTotalQuizScoreGoal(json.weekly_quiz_goal);
      setNickName(json.nickname);
      setTier(json.tier);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    fetchMyPage();
  }, []);

  const rate = articlesReadThisWeek / totalArticlesGoal; // 0.0 (투명) 에서 1.0 (불투명) 사이의 값

  const badges = [
    { id: "1", src: require("./assets/img/badges/badge1.png") },
    { id: "2", src: require("./assets/img/badges/badge2.png") },
    { id: "3", src: require("./assets/img/badges/badge3.png") },
    { id: "4", src: require("./assets/img/badges/badge4.png") },
    { id: "5", src: require("./assets/img/badges/badge1.png") },
    { id: "6", src: require("./assets/img/badges/badge2.png") },
    { id: "7", src: require("./assets/img/badges/badge3.png") },
    { id: "8", src: require("./assets/img/badges/badge4.png") },
    // 여기에 더 많은 뱃지 이미지들을 추가할 수 있어
  ];

  const onPress = () => {};

  useEffect(() => {
    if (rate < 0.3) {
      setOpacity(0.6);
    } else if (rate < 0.5) {
      setOpacity(0.65);
    } else if (rate < 0.7) {
      setOpacity(0.7);
    } else {
      setOpacity(rate);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.image}
          source={require("./assets/img/truetree_logo.png")} // 이미지 파일 경로 지정
        />
        <Text style={styles.logoText}>TRUETREE</Text>
      </View>
      <View style={styles.seperatorOne} />
      {/* <View style={styles.seperatorTwo} /> */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>Hi, {nickname}</Text>
          <Text style={styles.name}>You are 20th place</Text>
          <Text style={styles.name}>in {tier} tier</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressContainerStem}>
            <Svg height="170" width="170" viewBox="0 0 100 100">
              {/* 배경 원 */}
              <Circle
                cx="50"
                cy="50"
                r="45"
                fill="#571b01"
                fillOpacity={opacity}
              />
            </Svg>
            <ImageBackground
              source={require("./assets/img/myPageTree.png")} // 이미지 경로 확인
              style={styles.imageBackground}
              // 이미지 스타일을 여기에 추가합니다
            >
              {/* 만약 이미지 위에 다른 요소를 놓고 싶다면 여기에 추가하세요. 예를 들어: */}
              {/* <Text>여기에 텍스트</Text> */}
            </ImageBackground>
          </View>
          <View style={styles.progressContainerCircle}>
            <CircularProgress
              size={200} // 원의 크기
              width={13} // 선의 두께
              fill={(quizScoreThisWeek / totalQuizScoreGoal) * 100} // 현재 진행률
              tintColor="#5B882C" // 원의 색깔
              backgroundColor="#cccccc" // 원의 배경색
              rotation={0}
              lineCap="round"
            ></CircularProgress>
          </View>
        </View>
        {/* 이번주 누적 데일리 퀴즈 점수 / 목표 누적 데일리 퀴즈 점수 */}
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressTextTitle}>Progress of the Week</Text>
          <Text style={styles.progressText}>
            read articles : {articlesReadThisWeek}/{totalArticlesGoal}
          </Text>
          <Text style={styles.progressText}>
            total daily quiz scores: {quizScoreThisWeek}/{totalQuizScoreGoal}
          </Text>
          <Text style={styles.bonusScoreText}>Bonus Score : 10 points</Text>
          <Text style={styles.bonusScoreExplain}>
            (You can get it if you achive your goals)
          </Text>
          <Text style={styles.badgeText}>🎖️ Your Badges 🎖️</Text>
        </View>
        <FlatList
          style={styles.badgeList}
          data={badges}
          renderItem={({ item }) => (
            <Image source={item.src} style={styles.badge} />
          )}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.text}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row", // Aligns children in a row
    alignItems: "center", // Centers children vertically in the container
    marginHorizontal: "3%",
    maxHeight: "10%",
    paddingTop: "1%",
  },
  image: {
    width: 40,
    height: 40,
    marginLeft: "3%", // Add some margin to the right of the image, if needed
  },
  logoText: {
    fontSize: 20,
    color: "#5B882C",
    fontWeight: "400", // Makes the font weight thinner
    flex: 1, // Takes up all available space in the row
    textAlign: "center", // Centers the text horizontally,
    right: "260%",
  },
  seperatorOne: {
    marginTop: 5,
    marginBottom: 8,
    height: 3, // 선의 두께를 조절합니다.
    width: "100%", // 구분선의 너비를 조절합니다. 로고와 텍스트의 절반만큼의 길이로 설정합니다.
    backgroundColor: "#5B882C", // 초록색으로 설정합니다.
    borderWidth: 1, // 선의 두께를 조절합니다.
    borderColor: "#5B882C", // 초록색으로 경계선을 설정합니다.
  },
  seperatorTwo: {
    height: 1, // 선의 두께를 조절합니다.
    width: "100%", // 구분선의 너비를 조절합니다. 로고와 텍스트의 절반만큼의 길이로 설정합니다.
    backgroundColor: "#5B882C", // 초록색으로 설정합니다.
    borderWidth: 1, // 선의 두께를 조절합니다.
    borderColor: "#5B882C", // 초록색으로 경계선을 설정합니다.
    marginTop: 5,
    marginBottom: 8,
  },
  nameContainer: {
    alignSelf: "stretch",
    padding: 20,
    paddingTop: 10,
  },
  name: {
    fontSize: 18,
    color: "#55433B",
    fontWeight: "500",
  },
  imageBackground: {
    width: 170, // 이미지의 너비
    height: 170, // 이미지의 높이
    position: "absolute", // Svg 컴포넌트 위에 겹치도록 설정
    top: "-1%", // Svg 컴포넌트와 동일한 위치에
    left: "0%", // Svg 컴포넌트와 동일한 위치에
  },
  progressContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 500,
    backgroundColor: "tomato",
    marginTop: "22%",
  },
  progressContainerStem: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
    position: "absolute",
  },
  progressContainerCircle: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
    position: "absolute",
  },
  progressTextContainer: {
    marginTop: "35%",
    maxHeight: "20%",
  },
  progressTextTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    top: "-30%",
    color: "#55433B",
    marginVertical: 10,
    marginBottom: 3,
  },
  progressText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    top: "-30%",
    color: "#55433B",
  },
  bonusScoreText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    top: "-30%",
    color: "#5B882C",
  },
  bonusScoreExplain: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "bold",
    top: "-30%",
    color: "#5B882C",
  },
  badgeText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#55433B",
    top: "-20%",
  },
  badgeList: {
    marginHorizontal: 13,
    marginTop: 25,
  },
  badge: {
    width: 60, // 뱃지의 너비
    height: 60, // 뱃지의 높이
    marginHorizontal: 5, // 좌우 마진,
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#5B882C", // 버튼의 배경색
    padding: 10, // 버튼 안쪽의 여백
    borderRadius: 5, // 버튼의 모서리 둥글기
    alignItems: "center", // 텍스트를 중앙에 정렬
    justifyContent: "center",
    maxWidth: "50%",
    marginHorizontal: "25%",
    marginVertical: "5%",
  },
  text: {
    color: "white", // 텍스트 색상
    fontSize: 16, // 텍스트 크기
  },
  scroll: {
    minWidth: "100%",
  },
});

export default MyPage;
