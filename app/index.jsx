import * as React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { FontFamily, FontSize, Color, Border } from "../GlobalStyles";
import SplashScreen from '../components/Splash';


// Get screen dimensions
const { width, height } = Dimensions.get('window');

const images = [ 
  require("../assets/images/group3.png"),
  require("../assets/images/group2.png"), 
  require("../assets/images/group1.png"), 
];

const texts = [
  "Welcome",
  "Real State Agent", 
  "Buy or Sell Dream Home", 
];

const descriptions = [
  "Welcome to GharDekho Online Buy and Selling of house made easy",
  "Selling and listing Your Property Made easy.",
  "GharDekho Online team will help Buyer and seller with best option to sell or buy a property",
];

const WelcomeScreen = () => {
  const [isSplashVisible, setIsSplashVisible] = React.useState(true);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const router = useRouter(); // Initialize navigation
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); 
    return () => clearInterval(timer); 
  }, []);


  if (isSplashVisible) {
    return <SplashScreen/>;
  }
  return (
    <View style={styles.container}>
      {/* Top Image */}
      <View style={styles.imageContainer}>
        <Image
          source={images[currentIndex]}
          style={styles.headerImage}
          resizeMode="contain"
        />
      </View>

      {/* Text Section */}
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>{texts[currentIndex]}</Text>
        {/* Display the current text */}
        <Text style={styles.descriptionText}>{descriptions[currentIndex]}</Text>
        {/* Button Section */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("[HomeDashboard]")} 
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        
        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : null,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    justifyContent: "space-between",
    paddingBottom: 'auto',
    fontFamily:FontFamily.robotoMedium,
    fontSize:FontSize.size_xl,
  },
  imageContainer: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 15, // Added padding for image container
  },
  headerImage: {
    width: "80%", // Ensure image is responsive
    height: "80%", 
  },
  textContainer: {
    flex: 3,
    backgroundColor: "#005950", // Teal background
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 26, // Slightly increased font size for the title
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: "#d3d3d3",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22, // Improved line height for better readability
  },
  button: {
    backgroundColor: "#00D79A", // Green button color
    paddingVertical: 15,
    paddingHorizontal: width * 0.2, // Button width adjusted based on screen width
    borderRadius: 30,
    marginTop: 20,
    shadowColor: "#000", // Added shadow for button
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Shadow for Android
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#d3d3d3",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#00D79A", // Active dot color
    opacity: 1, // Added opacity for visual effect
  },
});

export default WelcomeScreen;
