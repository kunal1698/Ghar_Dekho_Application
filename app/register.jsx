import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontFamily } from "../GlobalStyles"; 
import { useRouter } from 'expo-router';
import apiManager from '../ApiManager';

const SignUp = () => {
 
  const [formData, setFormData] = useState({
    MobileNo: '',
    FullName: '',
    EmailID: '',
    pass: '',
    address: '',
    MemType: ''
  });
  
  const [selectedUserType, setSelectedUserType] = useState('Buyer');
  const router = useRouter();

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleRadioChange = (value) => {
    setSelectedUserType(value);
    setFormData((prevData) => ({
      ...prevData,
      MemType: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.MobileNo || !formData.FullName || !formData.EmailID || !formData.pass || !formData.address || !formData.MemType) {
        Alert.alert('Error', 'Please fill all the fields.');
        return;
      }
  
      const response = await apiManager.post('/insertMember', formData);
      
      if (response && response.data) { 
        console.log('API Response:', response.data);
        Alert.alert('Success', 'Sign Up Successfully');
        router.push('login');
      } else {
        throw new Error('Failed to sign up.');
      }
    } catch (error) {
      console.error('Error occurred while submitting data:', error.response || error.message || error);
      Alert.alert('Error', 'Sign Up failed');
    }
  };
 
  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Sign up to continue</Text>

      {/* User Type Selection */}
      <Text style={styles.subtitles}>I Am</Text>
      <View style={styles.radioContainer}>
        {['Buyer', 'Seller', 'Agent', 'Builder'].map((type) => (
          <TouchableOpacity 
            key={type}
            style={styles.radioOption}
            onPress={() => handleRadioChange(type)}
          >
            <View style={styles.radioCircle}>
              {selectedUserType === type && <View style={styles.selectedRb} />}
            </View>
            <Text style={styles.radioText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={formData.FullName}
          onChangeText={text => handleInputChange('FullName', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          value={formData.MobileNo}
          onChangeText={text => handleInputChange('MobileNo', text)}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={formData.EmailID}
          onChangeText={text => handleInputChange('EmailID', text)}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={formData.pass}
          onChangeText={text => handleInputChange('pass', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={formData.address}
          onChangeText={text => handleInputChange('address', text)}
        />
      </View>

      {/* Sign in Button */}
      <TouchableOpacity style={styles.signInButton} onPress={handleSubmit}>
        <Text style={styles.signInButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push('login')}>
          <Text style={styles.signUpText}>Sign in!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold', 
    marginBottom: 10,
    color: '#2C6A6A',
    fontFamily: FontFamily.robotoBold, 
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  subtitles: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2C6A6A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2C6A6A',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  input: {
    height: 40,
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: '#2C6A6A',
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpText: {
    color: '#5DB075',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default SignUp;
