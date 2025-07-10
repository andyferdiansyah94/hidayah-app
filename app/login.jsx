import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import ReactNativeModal from 'react-native-modal';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const logo = require('../assets/images/logo-hidayah.png');

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isErrorModalVisible, setErrorModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorModalVisible(true);
      return;
    }
  
    try {
      const response = await axios.post('http://10.0.2.2:8000/api/login', {
        username: username,
        password: password,
      });
  
      if (response.data) {
        const userData = response.data.user;
        console.log('User Data:', userData);

        await AsyncStorage.setItem('user', JSON.stringify(userData));
      
        const menuConfig = {
          admin: {
            karyawan: 1,
            distributor: 1,
            barang: 1,
            pelanggan: 1,
            penjualan: 0,
            jasa: 1,
            laporan: 1,
          },
          operator: {
            karyawan: 0,
            distributor: 0,
            barang: 0,
            pelanggan: 1,
            penjualan: 1,
            jasa: 0,
            laporan: 1,
          },
        };
      
        const role = userData.role;
        const menus = menuConfig[role];
      
        setSuccessModalVisible(true);
      
        setTimeout(() => {
          setSuccessModalVisible(false);
      
          router.replace({
            pathname: '/(tabs)',
            query: { role, menus: JSON.stringify(menus) },
          });
        }, 1500);
      }      
    } catch (error) {
      // console.error('Login Error:', error);
      setErrorModalVisible(true);
    }
  };

  const closeErrorModal = () => {
    setErrorModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeButton}>
            <Icon
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={24}
              color="#0891b2"
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Masuk</Text>
        </TouchableOpacity>
      </View>

      <ReactNativeModal isVisible={isErrorModalVisible} onBackdropPress={closeErrorModal}>
        <View style={styles.modalContainer}>
          <Icon name="alert-circle" size={50} color="#d9534f" style={styles.errorIcon} />
          {/* <Text style={styles.}>Error</Text> */}
          <Text style={styles.modalTitleError}>Login gagal. Periksa username dan password Anda.</Text>
          <TouchableOpacity style={styles.closeButton} onPress={closeErrorModal}>
            <Text style={styles.closeButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </ReactNativeModal>

      <ReactNativeModal isVisible={isSuccessModalVisible} animationIn="fadeIn" animationOut="fadeOut">
        <View style={styles.modalContainer}>
          <Icon name="check-circle" size={50} color="#5cb85c" style={styles.successIcon} />
          {/* <Text style={styles.}>Berhasil</Text> */}
          <Text style={styles.modalTitleSuccess}>Login berhasil!</Text>
        </View>
      </ReactNativeModal>

      <View style={styles.bottomBar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 0,
    marginTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 1,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 0,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    padding: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  eyeButton: {
    padding: 10,
    position: 'absolute',
    right: 10,
  },
  buttonContainer: {
    width: '100%',
    padding: 20,
  },
  button: {
    backgroundColor: '#F79300',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomBar: {
    backgroundColor: '#F79300',
    height: 50,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitleError: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d9534f',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalTitleSuccess: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5cb85c',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#0891b2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  successIcon: {
    marginBottom: 15,
  },
  errorIcon: {
    marginBottom: 15,
  },
});

export default Login;
