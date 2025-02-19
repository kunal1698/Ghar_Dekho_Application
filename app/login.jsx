import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiManager from '../ApiManager';
import CustomAlert from '../app/CustomAlert'; // Assuming this is your custom alert component

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedUserType, setSelectedUserType] = useState('Buyer');
  const [loading, setLoading] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // success or error

  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken'); 
      if (token) {
        router.push({
          pathname: "[HomeDashboard]",
          params: {
            token: token,
          },
        });
      }
    };
    checkLoginStatus();
  }, []);

  const handleCloseAlert = () => {
    setIsAlertVisible(false);
  };

  const handleSubmit = async () => {
    if (!email) {
      setAlertMessage('Please enter email');
      setAlertType('error');
      setIsAlertVisible(true);
      return;
    }

    if (!password) {
      setAlertMessage('Please enter password');
      setAlertType('error');
      setIsAlertVisible(true);
      return;
    }

    setLoading(true);
    setIsAlertVisible(true);
    try {
      const formData = { LoginID: email, Password: password, Memtype: selectedUserType };

      const result = await apiManager.post('getuserlogin', formData);
      console.warn('result', result.data);

      if (result.data) {
        const token = JSON.stringify(result.data);
        await AsyncStorage.setItem('userToken', token);

        setAlertType('success');
        setAlertMessage('Login Successfully');
        setIsAlertVisible(true);

        router.push({
          pathname: "[HomeDashboard]",
          params: { token: token },
        });
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage('Not Authorized');
      setAlertType('error');
      setIsAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const renderRadioButton = (value) => (
    <TouchableOpacity
      style={styles.radioOption}
      onPress={() => setSelectedUserType(value)}
      activeOpacity={0.7}
    >
      <View style={styles.radioCircle}>
        {selectedUserType === value && <View style={styles.selectedRb} />}
      </View>
      <Text style={styles.radioText}>{value}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Image
        source={require("../assets/images/splash.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <Text style={styles.subtitles}>I Am</Text>
      <View style={styles.radioContainer}>
        {renderRadioButton("Buyer")}
        {renderRadioButton("Seller")}
        {renderRadioButton("Agent")}
        {renderRadioButton("Builder")}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="shkunal@mail.com"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      <View style={styles.rememberMeContainer}>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.forgetPassword}>Forget password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.checkboxContainer} onPress={() =>(
              router.push('MobileNumberScreen')
            )}>
          <View style={styles.checkbox}>
            <View style={styles.checkboxTick}  />
          </View>
          <Text style={styles.checkboxLabel}>Login with OTP</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#5DB075" />}

      <TouchableOpacity
        style={styles.signInButton}
        onPress={handleSubmit}
        activeOpacity={0.7}
      >
        <Text style={styles.signInButtonText}>Sign in</Text>
      </TouchableOpacity>

      {/* Custom Alert */}
      <CustomAlert
        visible={isAlertVisible}
        onClose={handleCloseAlert}
        message={alertMessage}
        type={alertType} // success or error
      />

      <View style={styles.footer}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push("register")}>
          <Text style={styles.signUpText}>Sign up!</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  logo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#5DB075',
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
    borderColor: '#5DB075',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5DB075',
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
  rememberMeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    height: 20,
    width: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#5DB075',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxTick: {
    width: 10,
    height: 10,
    backgroundColor: '#5DB075',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  forgetPassword: {
    color: '#5DB075',
    fontSize: 14,
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

export default Login;