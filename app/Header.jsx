import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function Header({ onMenuPress }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('userToken');
        setIsLoggedIn(!!value);
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };
    getData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setIsLoggedIn(false);
      router.push('login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isLoggedIn ? (
          <>
            <TouchableOpacity
              onPress={onMenuPress}
              accessible={true}
              accessibilityLabel="Open menu"
              style={styles.iconButton}
            >
              <Icon name="menu-outline" size={26} color="#006666" />
            </TouchableOpacity>
            <Image
              source={require('../assets/images/splash.png')} // Adjust the path to your logo
              style={styles.logo}
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={handleLogout}
              accessible={true}
              accessibilityLabel="Logout"
              style={styles.iconButton}
            >
              <View style={styles.logoutContainer}>
                <Icon name="log-out-outline" size={24} style={styles.listIcon} />
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => router.push('register')}
              style={styles.iconButton}
              accessible={true}
              accessibilityLabel="Sign Up"
            >
              <Icon name="person-add-outline" size={26} color="#006666" />
            </TouchableOpacity>
            <Image
              source={require('../assets/images/splash.png')} // Adjust the path to your logo
              style={styles.logo}
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={() => router.push('login')}
              style={styles.iconButton}
              accessible={true}
              accessibilityLabel="Login"
            >
              <Icon name="log-in-outline" size={26} color="#006666" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingVertical: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 150, 
    height: 60, 
    marginHorizontal: 10,
  },
  iconButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listIcon: {
    marginRight: 5, // Space between icon and text
    color: '#006666', // Color of the logout icon
  },
  logoutText: {
    color: '#006666',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
