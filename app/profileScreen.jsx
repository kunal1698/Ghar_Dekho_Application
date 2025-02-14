import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get('window'); // Get device dimensions

const profileScreen = () => {
  
  const router = useRouter();

  // State to hold user details
  const [userDetail, setUserDetail] = useState([]);

  // Form state to bind to the text inputs
  const [formData, setFormData] = useState({
    FullName: "",
    MobileNo: "",
    EmailID: "",
    Address: "",
    MemberAddress: "",
  });

  // Fetch user detail when component mounts
  useEffect(() => {
    fetchUserDetail();
  }, []);

  // Set formData when userDetail is fetched
  useEffect(() => {
    if (userDetail.length > 0) {

      console.warn("userDetail",userDetail);
      
      setFormData({
        FullName: userDetail[0].FullName || "",
        MobileNo: userDetail[0].MobileNo || "",
        EmailID: userDetail[0].EmailID || "",
        Address: userDetail[0].Address || "",
        MemberAddress: userDetail[0].MemberAddress || "",
        MemberType: userDetail[0].MemberType || "",
      });
    }
  }, [userDetail]);

  // Fetch user detail from AsyncStorage
  const fetchUserDetail = async () => {
    try {
      const userDetailString = await AsyncStorage.getItem("userToken");
      if (userDetailString) {
        const parsedData = JSON.parse(userDetailString);
        setUserDetail(parsedData); 
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Handle input change and update formData
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value, 
    });
  };

  // // Handle form submission
  // const handleSubmit = () => {
  //   console.log("Form submitted with:", formData);
  //   AsyncStorage.setItem("userToken", JSON.stringify([formData])); 
  // };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Icon name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.header}>Profile Details</Text>

      <View style={styles.profileImageContainer}>
        <Image style={styles.profileImage} source={require('../assets/images/ghar_l.png')} />
      </View>

      <Text style={styles.name}>{formData.FullName}</Text>
      <Text style={styles.credit}>Member Type: <Text style={styles.creditAmount}>{formData.MemberType}</Text></Text>

      {/* Editable Fields */}
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          value={formData.FullName}
          onChangeText={(value) => handleInputChange('FullName', value)}
          readOnly
        />
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          value={formData.MobileNo}
          onChangeText={(value) => handleInputChange('MobileNo', value)}
          readOnly
        />
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          value={formData.EmailID}
          onChangeText={(value) => handleInputChange('EmailID', value)}
          readOnly
        />
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          value={formData.MemberAddress}
          onChangeText={(value) => handleInputChange('MemberAddress', value)}
          readOnly
        />
      </View>

      {/* <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>Save Now</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8F8F8',
    padding: width * 0.05, 
    alignItems: 'center', 
  },
  backButton: {
    position: "absolute",
    top: height * 0.05, 
    left: width * 0.05, 
    backgroundColor: "#C0A94A",
    padding: 10,
    borderRadius: 50,
    elevation: 2,
  },
  header: {
    fontSize: width * 0.06, 
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: width * 0.3, 
    height: width * 0.3,
    borderRadius: width * 0.15,
  },
  name: {
    fontSize: width * 0.05, 
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  credit: {
    fontSize: width * 0.04, 
    textAlign: 'center',
    marginBottom: 20,
  },
  creditAmount: {
    fontWeight: 'bold',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    width: '100%', 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  input: {
    flex: 1,
    fontSize: width * 0.04, 
  },
  saveButton: {
    backgroundColor: '#5DB075',
    padding: height * 0.02, 
    borderRadius: 10,
    alignItems: 'center',
    width: '100%', 
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: width * 0.045, 
    fontWeight: 'bold',
  },
});

export default profileScreen;
