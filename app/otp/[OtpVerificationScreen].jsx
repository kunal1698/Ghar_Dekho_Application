import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter , useLocalSearchParams } from "expo-router";
import CustomAlert from '../CustomAlert';
import { FontAwesome } from '@expo/vector-icons';

const OtpVerificationScreen = () => {
  const router = useRouter();
  const query = router.query || {};
  const data = useLocalSearchParams();  // Get mobile number and OTP from params
  const [otp, setOtp] = useState(new Array(6).fill('')); // For storing 6 digits separately
  const [loading, setLoading] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // success or error
  const [otpValid, setOtpValid] = useState(true); // To check if the OTP is valid
  const [otpExpirationTime, setOtpExpirationTime] = useState(Date.now() + 5 * 60 * 1000); // 5 minutes expiration
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      if (Date.now() > otpExpirationTime) {
        setOtpValid(false);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [otpExpirationTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [otpExpirationTime]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;

    // Auto-focus next input
    if (text && index < 5) {
      const nextInput = `otpInput${index + 1}`;
      this[nextInput].focus();
    }

    setOtp(newOtp);
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join(''); // Combine OTP values into one string
    const { mobileNumber, generatedOtp } = JSON.parse(data.pageName);

    console.log('Entered OTP:', otpValue);
    console.log('Generated OTP:', generatedOtp);
    console.log('OTP comparison:', otpValue === generatedOtp);

    setLoading(true);

    try {
      // Check if the OTP is empty or incomplete
      if (otpValue.length !== 6) {
        setAlertMessage('Please enter a complete 6-digit OTP');
        setAlertType('error');
        setIsAlertVisible(true);
        throw new Error('Please enter a complete 6-digit OTP');
      }

      // Check if the OTP is expired
      if (!otpValid) {
        setAlertMessage('OTP has expired. Please request a new OTP.');
        setAlertType('error');
        setIsAlertVisible(true);
        throw new Error('OTP has expired. Please request a new OTP.');
      }

      // Verify the OTP
      if (!generatedOtp) {
        setAlertMessage('Generated OTP not found. Please try again.');
        setAlertType('error');
        setIsAlertVisible(true);
        throw new Error('Generated OTP not found. Please try again.');
      }

      if (otpValue !== generatedOtp) {
        setAlertMessage('Invalid OTP. Please try again.');
        setAlertType('error');
        setIsAlertVisible(true);
        throw new Error('Invalid OTP. Please try again.');
      }

      // If OTP is valid, show success message
      setAlertMessage('OTP Verified Successfully');
      setAlertType('success');
      setIsAlertVisible(true);

      // Here you can add navigation logic or any other actions after successful verification

    } catch (error) {
      console.error('OTP Verification Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    // Logic to resend OTP can be similar to handleSendOtp from MobileNumberScreen
    // You may want to show a loading indicator while the new OTP is being sent
    // And reset the expiration time
    setOtpExpirationTime(Date.now() + 5 * 60 * 1000);
    // Call the API to send OTP again as in handleSendOtp
    
  };

  return (
    <View style={styles.container}>
      <FontAwesome name="lock" size={64} color="#5DB075" style={styles.icon} />
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>Enter the OTP sent to {data.mobileNumber}</Text>

      <View style={styles.otpContainer}>
        {otp.map((data, index) => (
          <TextInput
            key={index}
            ref={(input) => this[`otpInput${index}`] = input}
            style={[styles.otpInput, otp[index] && styles.otpInputFilled]}
            maxLength={1}
            keyboardType="number-pad"
            onChangeText={(text) => handleChange(text, index)}
            value={otp[index]}
          />
        ))}
      </View>

      <Text style={styles.timerText}>
        Time remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#5DB075" style={styles.loader} />
      ) : (
        <TouchableOpacity 
          style={[styles.verifyOtpButton, !otp.every(digit => digit !== '') && styles.disabledButton]} 
          onPress={handleVerifyOtp}
          disabled={!otp.every(digit => digit !== '')}
        >
          <Text style={styles.verifyOtpButtonText}>Verify OTP</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={[styles.resendOtpButton, otpValid && styles.disabledButton]} 
        onPress={handleResendOtp} 
        disabled={otpValid}
      >
        <Text style={[styles.resendOtpButtonText, otpValid && styles.disabledText]}>
          Resend OTP
        </Text>
      </TouchableOpacity>

      {/* Custom Alert */}
      <CustomAlert
        visible={isAlertVisible}
        onClose={() => setIsAlertVisible(false)}
        message={alertMessage}
        type={alertType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  otpInput: {
    width: '15%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 24,
    backgroundColor: '#fff',
  },
  otpInputFilled: {
    borderColor: '#5DB075',
    backgroundColor: '#e8f5e9',
  },
  timerText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  verifyOtpButton: {
    backgroundColor: '#5DB075',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  verifyOtpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  resendOtpButton: {
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5DB075',
  },
  resendOtpButtonText: {
    color: '#5DB075',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#999',
  },
  loader: {
    marginVertical: 20,
  },
});

export default OtpVerificationScreen;