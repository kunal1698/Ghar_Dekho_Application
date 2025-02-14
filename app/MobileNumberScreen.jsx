import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from "expo-router";
import CustomAlert from '../app/CustomAlert';
import apiManager from '../ApiManager';

const MobileNumberScreen = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const router = useRouter();

  const handleMobileNumberChange = (text) => {
    // Only allow digits
    const numericText = text.replace(/[^0-9]/g, '');
    setMobileNumber(numericText);
  };

  const handleSendOtp = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      setAlertMessage('Please enter a valid 10-digit mobile number');
      setAlertType('error');
      setIsAlertVisible(true);
      return;
    }

    setLoading(true);

    try {
      // First, check if the mobile number exists
      const formData = { mobileno: mobileNumber };
      const response1 = await apiManager.post('getuserloginbymobile', formData);
      
      console.log('API Response:', response1);

      // Check for the specific "No Record Found" response
      if (response1 && response1.IsSuccess === false && response1.message === "No Record Found") {
        setAlertMessage('Mobile number not found. Please register first.');
        setAlertType('error');
        setIsAlertVisible(true);
        return;
      }

      // Check for null response or other error conditions
      if (!response1 || response1.IsSuccess === false || !response1.data) {
        setAlertMessage('An error occurred. Please try again.');
        setAlertType('error');
        setIsAlertVisible(true);
        return;
      }

      const userData = response1.data;

      // If we have valid user data, proceed with OTP generation and sending
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

      // Call OTP API to send OTP to the user's mobile number
      const apiUrl = `https://api.sinthan.co.in/pushapi/sendmsg?username=GHARDEKHOAPI&dest=91${mobileNumber}&apikey=K2U4YHbLeT75ovEMuB34P1sVIUdNBrcf&signature=GHRDKO&msgtype=PM&msgtxt=Your ghar dekho online portal login otp is ${generatedOtp}. GHAR DEKHO ONLINE&templateid=1707172776000110010&entityid=1701172741858649443`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }

      const responseData = await response.text();
      console.log('OTP API Response:', responseData);

      // Navigate to OTP verification screen
      router.push({
        pathname: "otp/OtpVerificationScreen",
        params: {
          pageName: JSON.stringify({mobileNumber, generatedOtp, userData}),
        },
      });
    } catch (error) {
      console.error('Error:', error);
      setAlertMessage('An error occurred. Please try again.');
      setAlertType('error');
      setIsAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>Enter your mobile number to continue</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputPrefix}>+91</Text>
            <TextInput
              style={styles.input}
              placeholder="10-digit mobile number"
              value={mobileNumber}
              onChangeText={handleMobileNumberChange}
              keyboardType="number-pad"
              maxLength={10}
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#5DB075" style={styles.loader} />
          ) : mobileNumber.length === 10 ? (
            <TouchableOpacity style={styles.sendOtpButton} onPress={handleSendOtp}>
              <Text style={styles.sendOtpButtonText}>Send OTP</Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.sendOtpButton, styles.disabledButton]}>
              <Text style={[styles.sendOtpButtonText, styles.disabledButtonText]}>Send OTP</Text>
            </View>
          )}

          {/* Custom Alert */}
          <CustomAlert
            visible={isAlertVisible}
            onClose={() => setIsAlertVisible(false)}
            message={alertMessage}
            type={alertType}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputPrefix: {
    paddingLeft: 15,
    paddingRight: 5,
    fontSize: 16,
    color: '#333',
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
  sendOtpButton: {
    backgroundColor: '#5DB075',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sendOtpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  disabledButtonText: {
    color: '#666',
  },
});

export default MobileNumberScreen;