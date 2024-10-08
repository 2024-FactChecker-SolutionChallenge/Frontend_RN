import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({
  setIsAuthenticated,
  setAccessToken,
  setRefreshToken,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = () => {
    fetch("http://35.216.92.188:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: email.trim(),
        password: password.trim(),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          // throw new Error('Login failed'); // 로그인 실패 처리
          alert("Login falied. Please Retry");
        }

        // 토큰 추출
        const accessToken = response.headers.get("access_token");
        const refreshToken = response.headers.get("refresh_token");

        if (accessToken && refreshToken) {
          // 토큰 저장
          AsyncStorage.setItem("accessToken", accessToken);
          AsyncStorage.setItem("refreshToken", refreshToken);
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);

          // 인증 상태 업데이트
          setIsAuthenticated(true);
        }

        return response.json();
      })
      .then((json) => {
        console.log(json);
      })
      .catch((error) => {
        console.error(error);
        // 에러 처리 로직
      });
  };

  const navigateToSignup = () => {
    // 회원가입 화면으로 이동
    navigation.navigate("Signup");
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("./assets/img/truetree_logo.png")} // 이미지 파일 경로 지정
      />
      <Text style={styles.title}>TRUETREE</Text>
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="P/W"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={navigateToSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  image: {
    width: 230,
    height: 230,
  },
  title: {
    fontSize: 40,
    fontWeight: "500",
    marginBottom: 20,
    color: "#5B882C",
  },
  input: {
    width: "90%",
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#55433B",
    marginBottom: 20,
    padding: 10,
  },
  button: {
    backgroundColor: "#55433B",
    padding: 10,
    width: "90%",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
  },
});

export default LoginScreen;
