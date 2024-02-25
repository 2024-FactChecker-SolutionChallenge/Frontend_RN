// App.js
import React, { useState, useRef, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons"; // Make sure to install this package
import HomeScreen from "./HomeScreen";
import WordList from "./WordLearn/WordList";
import FactCheck from "./FactCheck";
import LearnScreen from "./Learn";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, SafeAreaView, Platform, StatusBar } from "react-native";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import MyPage from "./MyPage";
import LoginScreen from "./Login";
import SignupScreen from "./Singup";
import BeforeHome from "./beforeHome";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const [showBeforeHome, setShowBeforeHome] = useState(false);

  // ... rest of your code ...

  useEffect(() => {
    // Check if the user is authenticated
    if (isAuthenticated) {
      // Show BeforeHome component
      setShowBeforeHome(true);

      // Hide BeforeHome component after 4 seconds
      const timer = setTimeout(() => {
        setShowBeforeHome(false);
      }, 4000);

      // Clean up the timer
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const getTabBarVisibility = (route) => {
    // Get the current route name
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

    if (routeName === "Quiz" || routeName === "Results") {
      return "none";
    } else {
      return "flex";
    }
  };

  // 인증된 사용자만 접근할 수 있는 메인 탭 네비게이터
  const MainTabNavigator = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Word") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "FactCheck") {
            iconName = focused ? "play-circle" : "play-circle-outline";
          } else if (route.name === "MyPage") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          }
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#EB5929",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: "#55433B", // 원하는 배경색으로 설정
          display: getTabBarVisibility(route),
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false }}
        initialParams={{ accessToken, refreshToken }}
      />
      <Tab.Screen
        name="FactCheck"
        component={FactCheckStack}
        options={{ headerShown: false }}
        initialParams={{ accessToken, refreshToken }}
      />
      <Tab.Screen
        name="Word"
        component={WordList}
        options={{ headerShown: false }}
        initialParams={{ accessToken, refreshToken }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPage}
        options={{ headerShown: false }}
        initialParams={{ accessToken, refreshToken }}
      />
    </Tab.Navigator>
  );

  // 인증 화면을 위한 스택 네비게이터
  const AuthStackNavigator = () => (
    <Stack.Navigator>
      <Stack.Screen name="Login" options={{ headerShown: false }}>
        {(props) => (
          <LoginScreen
            {...props}
            setIsAuthenticated={setIsAuthenticated}
            setAccessToken={setAccessToken}
            setRefreshToken={setRefreshToken}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#EB5929", // 헤더의 배경색
            justifyContent: "center",
          },
          headerTitleStyle: {
            color: "white", // 제목의 색상
          },
        }}
      />
    </Stack.Navigator>
  );

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        {isAuthenticated ? (
          <>
            {showBeforeHome ? (
              <BeforeHome />
            ) : (
              <MainTabNavigator
                accessToken={accessToken}
                refreshToken={refreshToken}
              />
            )}
          </>
        ) : (
          <AuthStackNavigator />
        )}
      </NavigationContainer>
    </SafeAreaView>
  );
}

function HomeStack({ navigation, route }) {
  const { accessToken, refreshToken } = route.params;

  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
    if (routeName === "Check words & Summarize") {
      navigation.setOptions({
        tabBarStyle: {
          display: "none",
        },
      });
    } else {
      navigation.setOptions({
        tabBarStyle: {
          display: "flex",
          backgroundColor: "#55433B", // 예시 색상
        },
      });
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="홈화면"
        component={HomeScreen}
        options={{ headerShown: false }}
        initialParams={{ accessToken, refreshToken }}
      />
      <Stack.Screen
        name="Check words & Summarize"
        component={LearnScreen}
        initialParams={{ accessToken, refreshToken }}
        options={{
          headerShown: true,
          tabBarStyle: { display: "none" }, // 이 줄을 추가
          headerStyle: {
            backgroundColor: "#EB5929", // 헤더의 배경색
            justifyContent: "center",
          },
          headerTitleStyle: {
            color: "white", // 제목의 색상
          },
        }}
      />
    </Stack.Navigator>
  );
}

function FactCheckStack({ navigation, route }) {
  const { accessToken, refreshToken } = route.params;

  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
    if (routeName === "Check words & Summarize") {
      navigation.setOptions({
        tabBarStyle: {
          display: "none",
        },
      });
    } else {
      navigation.setOptions({
        tabBarStyle: {
          display: "flex",
          backgroundColor: "#55433B", // 예시 색상
        },
      });
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Factcheck"
        component={FactCheck}
        options={{ headerShown: false }}
        initialParams={{ accessToken, refreshToken }}
      />
      <Stack.Screen
        name="Check words & Summarize"
        component={LearnScreen}
        initialParams={{ accessToken, refreshToken }}
        options={{
          headerShown: true,
          tabBarStyle: { display: "none" }, // 이 줄을 추가
          headerStyle: {
            backgroundColor: "#EB5929", // 헤더의 배경색
            justifyContent: "center",
          },
          headerTitleStyle: {
            color: "white", // 제목의 색상
            fontWeight: "bold", // 제목의 글꼴 두껍게 설정
          },
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop: (StatusBar.currentHeight || 0) + 10, // Adjust for Android status bar
  },
});

export default App;
