import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from "expo-router";

const BottomNavigationBar = () => {
  const router = useRouter(); // Initialize navigation
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push("[HomeDashboard]");
        }}
      >
        <Icon name="home" size={24} color="yellow" />
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
      <Icon name="eye" size={24} color="yellow"/>
        <Text style={styles.buttonText}>Add Property</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Icon name="eye" size={24} color="yellow" /> 
        <Text style={styles.buttonText}>View Ads</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push("profileScreen");
        }}
      >
        <Icon name="person" size={24} color="yellow" />
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#006666', // Set background color to #006666
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 12,
    color: 'yellow', // Change text color to match yellow icon
    marginTop: 5,
  },
});

export default BottomNavigationBar;
