import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, Pressable, ScrollView, ImageBackground } from 'react-native';
import { Avatar, Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      router.push('/login');
      console.log('User logged out');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
    setIsModalVisible(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <ImageBackground source={require('../../assets/images/logo.png')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Hidayah Digital Printing</Text>
          {/* <Text style={styles.subtitle}>Profile</Text> */}
        </View>
        <View style={styles.profileCard}>
          <Avatar.Icon size={100} icon="account" style={styles.avatar} />
          <Text style={styles.name}>{user?.nama || 'Guest'}</Text>
          <Text style={styles.email}>{user?.email || 'hidayahprinting@gmail.com'}</Text>
          <Text style={styles.email}>{user?.email || '+031546321'}</Text>
        </View>
        {/* <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>120</Text>
            <Text style={styles.statLabel}>Pesanan</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Proyek Aktif</Text>
          </View>
        </View> */}
        <Button mode="contained" style={styles.button} onPress={() => setIsModalVisible(true)}>
          Logout
        </Button>
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Apakah Anda yakin ingin logout?</Text>
              <View style={styles.modalButtons}>
                <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.buttonText}>Batal</Text>
                </Pressable>
                <Pressable style={[styles.modalButton, styles.confirmButton]} onPress={handleLogout}>
                  <Text style={styles.buttonText}>Logout</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  container: {
    // flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 23,
    paddingTop: 20,
    fontWeight: 'bold',
    color: '#0891b2',
  },
  subtitle: {
    fontSize: 16,
    color: '#0891b2',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 150,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  avatar: {
    marginBottom: 10,
    backgroundColor: '#0891b2',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0891b2',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  button: {
    backgroundColor: '#0891b2',
    width: '90%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#d1d5db',
  },
  confirmButton: {
    backgroundColor: '#0891b2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Profile;
