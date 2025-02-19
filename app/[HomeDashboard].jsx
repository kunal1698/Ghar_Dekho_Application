import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, ActivityIndicator, Dimensions, Image } from 'react-native'; // Add Image import
import Icon from 'react-native-vector-icons/Ionicons';
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import LatestProperties from "./LatestProperties";
import NearbyProperties from "./NearbyProperties";
import RentalProperties from "./RentalProperties";
import BottomNavigationBar from "./BottomNavigationBar";
import Sidebar from "./Sidebar";
import { router, useLocalSearchParams } from "expo-router";
import Header from "./Header";

const { width } = Dimensions.get("window"); // Get window width for responsiveness

export default function HomeDashboard() {
  const [loading, setLoading] = useState(true);
  const [isSideBar, setISideBar] = useState(false);
  const datat = useLocalSearchParams(); 
  const [searchQuery, setSearchQuery] = useState("");

  

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Roboto_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
  const handleSearch = async () => {
    
    router.push({
      pathname: "Categories",
      params: {
        pageName: "All",
        searchQuery: searchQuery, 
      },
    });
    console.warn('searchQuery',searchQuery);
  };

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      {isSideBar && (
        <View style={styles.sidebarContainer}>
          <Sidebar
            isSideBar={isSideBar}
            setISideBar={setISideBar}
            datat={datat}
          />
        </View>
      )}

      {/* Full-width Header */}
      <View style={styles.fullWidthHeader}>
        <Header
          title="Home"
          onMenuPress={() => setISideBar(true)}
          onNotificationPress={() => alert("Notifications clicked!")}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.subtitle}>Find your dream home</Text>
          <View style={styles.searchBar}>
          <TextInput
              placeholder="Search by City"
              style={styles.searchInput}
              value={searchQuery} 
              onChangeText={setSearchQuery} 
            />
            <Icon
              name="search-outline"
              size={25}
              color="#ccc"
              onPress={handleSearch}
            />
            {/* <TextInput
              placeholder="Search by city name"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)} 
            />
            <Icon
              name="search-outline"
              size={25}
              color="#ccc"
              onPress={() => {
                if (searchQuery.trim() !== "") {
                  router.push({
                    pathname: "Categories",
                    params: {
                      city: searchQuery.trim(), 
                    },
                  });
                } else {
                  alert("Please enter a city name to search.");
                }
              }} */}
          </View>
        </View>

        {/* Latest Property Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Properties</Text>
          <LatestProperties />
        </View>

        {/* Nearby Property Section */}
        <NearbyProperties />

        {/* Banner Image Below NearbyProperties */}
        <View style={styles.bannerContainer}>
          <Image 
            source={require('../assets/images/baner1.jpg')} 
            style={styles.bannerImage}
            resizeMode="cover"  
          />
        </View>

        {/* Rental Properties Section */}
        <RentalProperties />

         {/* Banner Image Below NearbyProperties */}
         <View style={styles.bannerContainer1}>
          <Image 
            source={require('../assets/images/baner.jpg')} 
            style={styles.bannerImage1}
            resizeMode="cover"  
          />
        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNavigationBar style={styles.bottomNavBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: '0%',
    paddingBottom: 70,
  },
  scrollView: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    marginTop: 30,
  },
  subtitle: {
    fontSize: width < 400 ? 20 : 22,
    marginLeft: 15,
    fontWeight: 'bold',
    color: 'green',
    marginVertical: 5,
    fontFamily: 'Roboto_400Regular',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: 'Roboto_400Regular',
    paddingHorizontal: 10,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: width < 400 ? 16 : 18,
    marginLeft: 15,
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 10,
  },
  bottomNavBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    elevation: 5,
    height: 60,
  },
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '75%',
    zIndex: 2,
    backgroundColor: '#006666',
  },
  fullWidthHeader: {
    width: '100%',
    margin: 0,
  },
  bannerContainer: {
    marginTop: 20, 
    alignItems: 'center', 
  },
  bannerImage: {
    width: width * 0.9, 
    height: width * 0.24, 
    borderRadius: 10, 
  },
  bannerContainer1: {
    marginTop: 5, 
    alignItems: 'center', 
    marginBottom:10,
  },
  bannerImage1: {
    width: width * 0.9, 
    height: width * 0.24, 
    borderRadius: 10, 
  },
});
