import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [getCode, setGetCode] = useState("");
  const [checkCode, setCheckCode] = useState("");
  const [codeEqual, setCodeEqual] = useState(null);
  const [pwEqual, setPwEqual] = useState(null);

  const sendEmail = () => {
    fetch("http://35.216.92.188:8080/api/auth/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
      }),
    })
      .then((response) => response.json())
      .then((response) => setGetCode(response.AuthenticationCode))
      .then((json) => console.log(json))
      .catch((error) => console.error(error));
  };

  console.log(getCode);

  const verifyCode = (inputCode) => {
    if (inputCode === getCode.trim()) {
      setCodeEqual(true);
    } else {
      setCodeEqual(false);
    }
  };

  const verifyPw = (inputPw) => {
    console.log(password, passwordConfirm);
    if (inputPw === password.trim()) {
      setPwEqual(true);
    } else {
      setPwEqual(false);
    }
  };

  const [selectedLearningLevel, setSelectedLearningLevel] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const learningLevels = ["Beginner", "Intermediate", "Advanced"];
  const interests1 = ["POLITICS", "ECONOMY", "SOCIETY"];
  const interests2 = ["GLOBAL", "IT/SCIENCE", "CULTURE"];

  const handleSelectLearningLevel = (level) => {
    setSelectedLearningLevel(level);
  };

  const handleSelectInterest = (interest) => {
    setSelectedInterests((prevInterests) => {
      if (prevInterests.includes(interest)) {
        return prevInterests.filter((i) => i !== interest);
      } else {
        return [...prevInterests, interest];
      }
    });
  };

  // console.log(selectedLearningLevel)
  // console.log(selectedInterests)

  const interestsJson = {
    1: "POLITICS",
    2: "ECONOMY",
    3: "SOCIETY",
    4: "GLOBAL",
    5: "IT/SCIENCE",
    6: "CULTURE",
  };

  const navigation = useNavigation();

  const handleSignup = () => {
    // E-mail, Nickname, P/W, 약관 동의 여부 등의 유효성을 검사합니다.
    if (!email || !username || !password) {
      alert("Enter all the fields.");
      return;
    } else {
      if (!codeEqual || !pwEqual) {
        alert("The input isn't valid");
      } else {
        // interestsJson 객체의 값들을 배열로 가져옴
        const filteredDictionary = {};

        Object.entries(interestsJson).forEach(([key, value]) => {
          if (selectedInterests.includes(value)) {
            filteredDictionary[key] = value;
          }
        });

        fetch("http://35.216.92.188:8080/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: email.trim(),
            password: password.trim(),
            nickname: username.trim(),
            grade: selectedLearningLevel.trim(),
            interests: filteredDictionary,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Login failed"); // 로그인 실패 처리
            }
            return response.json();
          })
          .then((json) => {
            console.log(json);
            navigation.navigate("Login"); // 이 부분을 성공 로직에 맞게 조정
          })
          .catch((error) => {
            console.error(error);
            // 에러 처리 로직
          });
      }
    }
  };

  // Render function for the interests FlatList
  const renderInterestItem = ({ item }) => (
    <View style={styles.interestButtonBox}>
      <TouchableOpacity
        style={[
          styles.interestButton,
          selectedInterests.includes(item) && styles.selectedInterestButton,
        ]}
        onPress={() => handleSelectInterest(item)}
      >
        <Text
          style={[
            styles.interestButtonText,
            selectedInterests.includes(item) &&
              styles.selectedInterestButtonText,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.wrapContainer}>
        <View style={styles.leftContainer}>
          <View style={styles.label}>
            <Text style={[styles.labelText, { marginTop: "10%" }]}>
              Nickname
            </Text>
          </View>
          <View style={styles.label}>
            <Text style={[styles.labelText]}>E-mail</Text>
          </View>
          <View style={[styles.label]}>
            <Text style={[styles.labelText]}>Verify</Text>
          </View>
          <View style={[styles.label, (style = { marginTop: "50%" })]}>
            <Text style={[styles.labelText]}>P/W</Text>
          </View>
          <View style={styles.label}>
            <Text style={[styles.labelText]}>Confirm P/W</Text>
          </View>
        </View>
        <View style={styles.rightContainer}>
          <TextInput
            placeholder="Nickname"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <View style={styles.rowContainer}>
            <TextInput
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              style={styles.emailInput}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.authButton}
              onPress={sendEmail}
            >
              <View>
                <Text style={styles.authText}>Get code</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Enter the verification code"
            value={checkCode}
            onChangeText={(text) => {
              setCheckCode(text);
              verifyCode(text);
            }}
            style={styles.input}
          />
          {codeEqual == null ? (
            <Text></Text>
          ) : codeEqual ? (
            <Text style={{ fontSize: 14, left: "3%", color: "blue" }}>
              Valid
            </Text>
          ) : (
            <Text style={{ fontSize: 14, left: "3%", color: "red" }}>
              Invalid
            </Text>
          )}
          <TextInput
            placeholder="P/W"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            placeholder="P/W 확인"
            value={passwordConfirm}
            onChangeText={(text) => {
              setPasswordConfirm(text);
              verifyPw(text);
            }}
            secureTextEntry
            style={styles.input}
          />
          {pwEqual == null ? (
            ""
          ) : pwEqual ? (
            <Text style={{ fontSize: 14, left: "3%", color: "blue" }}>
              Valid
            </Text>
          ) : (
            <Text style={{ fontSize: 14, left: "3%", color: "red" }}>
              Invalid
            </Text>
          )}
        </View>
      </View>
      <Text style={styles.textGoal}>Weekly Goals</Text>
      <View style={styles.radioGroup}>
        {learningLevels.map((level) => (
          <TouchableOpacity
            key={level}
            style={styles.radioButton}
            onPress={() => handleSelectLearningLevel(level)}
          >
            <Text style={styles.radioText}>{level}</Text>
            <View style={styles.outerCircle}>
              {selectedLearningLevel === level && (
                <View style={styles.innerCircle} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.textInterest}>Interests</Text>
      <View style={styles.interestContainer}>
        <FlatList
          data={interests1}
          style={styles.interestBox}
          renderItem={renderInterestItem}
          keyExtractor={(item) => item}
          horizontal={true}
        />
        <FlatList
          data={interests2}
          style={styles.interestBox}
          renderItem={renderInterestItem}
          keyExtractor={(item) => item}
          horizontal={true}
        />
      </View>

      {/* 회원가입 버튼 */}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* 스위치 */}
      {/* <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>약관에 동의합니다</Text>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isAgree ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isAgree}
            />
        </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
  },
  wrapContainer: {
    flexDirection: "row",
    minWidth: "100%",
    height: 300,
  },
  leftContainer: {
    flexDirection: "column",
    left: 0,
    minWidth: "20%",
  },
  rightContainer: {
    flexDirection: "column",
    minWidth: "72%",
    left: "5%",
  },
  label: {
    width: "110%",
    justifyContent: "center",
    alignItems: "left",
    height: 40,
    marginTop: "17%",
    marginBottom: "20%",
    textAlign: "left",
    left: "15%",
  },
  labelText: {
    fontSize: 12,
  },
  input: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    borderBottomWidth: 1,
    borderColor: "#55433B",
    marginVertical: "5%",
    left: "3%",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: "3%",
    position: "relative",
  },
  emailInput: {
    width: "70%", // 이메일 입력란의 너비
    height: 40,
    borderBottomWidth: 1,
    borderColor: "#55433B",
    marginRight: 10, // 버튼과의 간격
    marginVertical: "5%",
  },
  authInput: {
    width: "70%", // 이메일 입력란의 너비
    height: 40,
    borderBottomWidth: 1,
    borderColor: "#55433B",
    marginRight: 10, // 버튼과의 간격
  },
  authButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#55433B",
    maxWidth: "100%",
    position: "absolute",
    right: "5%",
    bottom: "10%",
    padding: 10,
    borderRadius: 20,
    marginBottom: 15,
    // 여기에 추가 버튼 스타일을 정의할 수 있어
  },
  authText: {
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  textGoal: {
    color: "#55433B",
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 110,
  },
  textInterest: {
    color: "#55433B",
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 3,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  radioButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "33%",
  },
  radioText: {
    marginRight: 8,
    color: "#55433B",
  },
  // 스위치와 관련된 스타일을 추가합니다.
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  switchLabel: {
    marginRight: 10,
  },
  outerCircle: {
    // ... Styles for the outer circle of the radio button
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#55433B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  innerCircle: {
    // ... Styles for the inner circle of the radio button
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#55433B",
  },
  interestContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 110,
  },
  interestBox: {
    flexGrow: 0,
    flexDirection: "row",
  },
  interestButtonBox: {
    marginHorizontal: 10, // Space between items
    justifyContent: "center",
    alignItems: "center",
  },
  interestButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#55433B",
    borderRadius: 15,
    backgroundColor: "transparent",
    marginVertical: 5,
  },
  selectedInterestButton: {
    backgroundColor: "#55433B",
  },
  interestButtonText: {
    color: "#55433B",
  },
  selectedInterestButtonText: {
    color: "white",
  },
  button: {
    backgroundColor: "#55433B", // 버튼의 배경색
    padding: 10, // 버튼 안쪽의 여백
    borderRadius: 5, // 버튼의 모서리 둥글기
    alignItems: "center", // 텍스트를 중앙에 정렬
    justifyContent: "center",
    maxWidth: "50%",
    marginHorizontal: "25%",
    marginVertical: "10%",
    marginTop: "5%",
    marginBottom: "5%",
  },
  buttonText: {
    color: "white",
  },
});

export default SignupScreen;
