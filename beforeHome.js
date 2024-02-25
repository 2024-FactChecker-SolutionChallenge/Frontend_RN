import { ImageBackground, View, Text, StyleSheet } from "react-native";
import React, { useState, useRef, useEffect } from "react";

// ... your other imports

const BeforeHome = () => {
  useEffect(() => {}, [styles]);

  return (
    <ImageBackground
      source={require("./assets/img/truetree_background.png")} // Replace with your local image path
      style={styles.backgroundImage}
    >
      {/* <Text style = {styles.text}>Welcome to</Text>
        <Text style = {styles.text}>TRUETREE</Text> */}
    </ImageBackground>
  );
};

// Add this to your StyleSheet
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    color: "#f25900",
    fontSize: 40,
    fontWeight: "400",
    bottom: "10%",
  },
  // ... your other styles ...
});

export default BeforeHome;
