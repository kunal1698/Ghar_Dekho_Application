import React from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';

const CustomAlert = ({ visible, onClose, type = 'success', message }) => {
  const isSuccess = type === 'success';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={[styles.alertContainer, isSuccess ? styles.successContainer : styles.errorContainer]}>
          {/* Image at the top */}
          <Image
            source={isSuccess 
              ? require('../assets/images/icon-awesomecheckcircle.png')
              : require('../assets/images/cross.png')} // Add your error icon path here
            style={styles.alertImage}
          />
          {/* Alert Text */}
          <Text style={styles.alertText}>{message || (isSuccess ? 'Login Successfully' : 'Login Failed')}</Text>

          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={[styles.button, isSuccess ? styles.successButton : styles.errorButton]}>
            <Text style={[styles.buttonText, isSuccess ? styles.successButtonText : styles.errorButtonText]}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  alertContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#006666', // Green background for the alert
    borderRadius: 20,
    alignItems: 'center',
  },
  successContainer: {
    backgroundColor: '#006666', // Green background for success alert
  },
  errorContainer: {
    backgroundColor: '#FF3B30', // Red background for error alert
  },
  alertImage: {
    width: 60,
    height: 60,
    marginBottom: 15,
  },
  alertText: {
    fontSize: 18,
    color: '#fff', // White text color
    marginBottom: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  successButton: {
    backgroundColor: '#fff',
  },
  errorButton: {
    backgroundColor: '#fff',
  },
  buttonText: {
    color: 'green', // Green text color to match the background
    fontWeight: 'bold',
  },
  successButtonText: {
    color: '#006666', // Green text color to match the success background
  },
  errorButtonText: {
    color: '#FF3B30', // Red text color to match the error background
  },
});

export default CustomAlert;
