import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar } from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import LottieView from 'lottie-react-native';

const History = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch('http://10.0.2.2:8000/api/penjualans/today')
        .then((response) => response.json())
        .then((json) => {
          setData(json.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }, 2000);

    return () => clearTimeout(timer); 
  }, []);

  const totalPendapatan = useMemo(() => {
    if (!data || data.length === 0) {
      return 0;
    }
    return data.reduce((total, item) => total + item.harga, 0);
  }, [data]);

  const AppBar = () => {
    return (
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Laporan Harian</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.namaBarangContainer}>
        {item.nama_barang.map((barang, index) => (
          <Text key={index} style={styles.namaBarangText}>
            {barang.nama_barang}, Qty: {barang.kuantitas}
          </Text>
        ))}
      </View>
      <Text style={styles.cell}>{item.kuantitas}</Text>
      <Text style={styles.cell}>{item.harga}</Text>
      <Text style={styles.cell}>{item.pelanggan_name}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <AppBar />
        <View style={styles.loadingContainer}>
          <LottieView
            source={require('../../assets/lottie/loader.json')}
            autoPlay
            loop
            style={styles.loader}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppBar />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Income: {totalPendapatan.toLocaleString()}</Text>
      </View>
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Name</Text>
        <Text style={styles.headerText}>Quantity (Barang)</Text>
        <Text style={styles.headerText}>Price</Text>
        <Text style={styles.headerText}>Customer</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.table}
        contentContainerStyle={styles.scrollContainer}
        ListFooterComponent={<View style={styles.bottomSpace} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appBar: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F79300',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    paddingHorizontal: 0,
    paddingBottom: 20,
  },
  totalContainer: {
    backgroundColor: '#ffd699ff',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000ff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffd699ff',
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 5,
    marginHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000ff',
  },
  table: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    marginVertical: 2,
    borderRadius: 8,
    elevation: 1,
    marginHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  namaBarangContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  namaBarangText: {
    fontSize: 14,
    color: '#333',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
  bottomSpace: {
    height: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loader: {
    width: 150,
    height: 150,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#0891b2',
    fontWeight: 'bold',
  },
});

export default History;
