import { View, StyleSheet, ScrollView, SafeAreaView, StatusBar, Text, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import DashboardButton from '../../components/DashboardButton';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const [user, setUser] = useState(null);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    const fetchCounts = async () => {
      try {
        const response = await fetch('http://10.0.2.2:8000/api/dashboard/counts');
        const json = await response.json();
        setCounts(json);
      } catch (error) {
        console.error('Error fetching counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchCounts();
  }, []);

  const menuConfig = {
    admin: {
      karyawan: 1,
      distributor: 1,
      barang: 1,
      pelanggan: 1,
      penjualan: 0,
      jasa: 1,
      laporan: 1,
      kategori: 1,
    },
    operator: {
      karyawan: 0,
      distributor: 0,
      barang: 0,
      pelanggan: 1,
      penjualan: 1,
      jasa: 0,
      laporan: 1,
      kategori: 1,
    },
  };

  const menus = [
    { key: 'karyawan', label: 'Karyawan', icon: 'account', count: counts.karyawan || 0, route: 'Karyawan' },
    { key: 'distributor', label: 'Distributor', icon: 'truck', count: counts.distributor || 0, route: 'Distributor' },
    { key: 'barang', label: 'Barang', icon: 'package', count: counts.barang || 0, route: 'Barang' },
    { key: 'pelanggan', label: 'Pelanggan', icon: 'account-group', count: counts.pelanggan || 0, route: 'Pelanggan' },
    { key: 'penjualan', label: 'Penjualan', icon: 'chart-bar', count: counts.penjualan || 0, route: 'LaporanPenjualan' },
    { key: 'jasa', label: 'Jasa', icon: 'wrench', count: counts.jasa || 0, route: 'Jasa' },
    { key: 'laporan', label: 'Laporan', icon: 'file-pdf-box', count: counts.laporan || 0, route: 'Laporan' },
    { key: 'kategori', label: 'Kategori', icon: 'folder', count: counts.kategori || 0, route: 'Kategori' },
  ];

  const filteredMenus = user ? menus.filter(menu => menuConfig[user.role][menu.key] === 1) : [];

  const handlePress = (route) => {
    router.push(`/${route}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <LottieView
          source={require('../../assets/lottie/loader.json')} 
          autoPlay
          loop
          style={styles.loader}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.appBar}>
        <Image source={require('../../assets/images/logo-hidayah.png')} style={styles.logo} />
        <Text style={styles.appBarTitle}>Dashboard</Text>
        <Text style={styles.userName}>{user?.nama}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.grid}>
          {filteredMenus.map((menu) => (
            <DashboardButton
              key={menu.key}
              icon={menu.icon}
              label={menu.label}
              count={menu.count}
              onPress={() => handlePress(menu.route)}
            />
          ))}
        </View>
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appBar: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 2,
    borderBottomColor: '#F79300',
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F79300',
  },
  userName: {
    fontSize: 16,
    color: '#F79300',
    textTransform: 'capitalize',
  },
  logo: {
    width: 40,
    height: 40,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bottomSpace: {
    height: 100,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 18,
    color: '#F79300',
  },
  loader: {
    width: 150,
    height: 150,
  },
});

export default Home;
