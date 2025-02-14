import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Image } from "expo-image";
import { Color, FontFamily, Border } from "../GlobalStyles";

const SplashScreen = () => {
  return (
    <View style={styles.splashScreen}>
      <View style={styles.rectanglePosition} />
      <View style={styles.rectanglePosition}>
        <View style={[styles.rectangle3204, styles.rectanglePosition]} />
      </View>
    
      <View style={styles.logoContainer}>
        <Image
          style={styles.bgIcon}
          contentFit="cover"
          source={require("../assets/images/ghar_l.png")}
        />
        {/* <View style={styles.plot}>
          <Text style={styles.plot1}>Ghardekho</Text>
        </View> */}
        {/* <Image
          style={styles.ecoHouseIcon}
          contentFit="cover"
          source={require("../assets/images/bg.png")}
        /> */}
      </View>
      <View style={[styles.barsHomeIndicatorOnLight, styles.barsLayout]}>
        <View style={[styles.barsHomeIndicatorOnLightB, styles.barsLayout]} />
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rectanglePosition: {
    width: "100%",
    left: 0,
    top: 0,
    position: "absolute",
    height: "100%",
  },
  barsLayout: {
    height: 34,
    width: "100%",
    left: 0,
    position: "absolute",
  },
  rectangle3204: {
    backgroundColor: Color.colorDarkslategray,
  },
  bgIcon: {
    width: "100%", // Full width of screen
    height: "100%", // Full height of screen
    position: "absolute",
  },
  plot1: {
    fontSize: 40,
    fontWeight: "700",
    fontFamily: FontFamily.robotoBold,
    color: Color.colorGray_100,
    textAlign: "center",
  },
  plot: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%", 
    height: "auto",
    marginTop: 20,
  },
  ecoHouseIcon: {
    width: 98,
    height: 90,
    //marginTop: 10, // Small margin between "PLOT" and house icon
  },
  logoContainer: {
    position: "absolute", // Make it responsive with respect to the screen
    top: "50%", // Move it to the middle vertically
    left: "50%", // Move it to the middle horizontally
    transform: [{ translateX: -133 }, { translateY: -133 }], // Center the logo
    width: 267,
    height: 267,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2, // Ensure the logo is above the background
  },
  barsHomeIndicatorOnLightB: {
    backgroundColor: Color.colorGray_400,
    top: 0,
    height: 34,
  },
  homeIndicator: {
    top: 15,
    left: 121,
    borderRadius: Border.br_10xs_5,
    width: 134,
    height: 5,
    position: "absolute",
    backgroundColor: Color.colorWhite,
  },
  barsHomeIndicatorOnLight: {
    top: 778,
  },
  splashScreen: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    height: "100%",
    backgroundColor: Color.colorWhite,
  },
});

export default SplashScreen;
