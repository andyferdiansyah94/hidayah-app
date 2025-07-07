import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Laporan = () => {
  const navigation = useNavigation();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());  
  const [data, setData] = useState([]);
  const [role, setRole] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from(
    { length: 6 },
    (_, i) => (new Date().getFullYear() - i).toString()
  );

  useEffect(() => {
    fetchSalesByMonth();
    getUserRole();
  }, [selectedMonth, selectedYear]);

  const getUserRole = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        setRole(parsedUser.role);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchSalesByMonth = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://10.0.2.2:8000/api/penjualan/monthly', {
        bulan: selectedMonth,
        tahun: selectedYear
      });

      if (response.data.data) {
        setData(response.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
      Alert.alert('Error', 'Gagal mengambil data penjualan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://10.0.2.2:8000/api/penjualan/${id}`);
      Alert.alert('Sukses', 'Penjualan berhasil dihapus');
      fetchSalesByMonth();
    } catch (error) {
      console.error('Error deleting sale:', error);
      Alert.alert('Error', 'Gagal menghapus penjualan');
    }
  };

  const confirmDelete = (id) => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus penjualan ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => handleDelete(id) }
      ]
    );
  };

  const exportToPDF = async () => {
    try {
      const html = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                font-size: 12px;
                color: #333;
              }
              .header {
                text-align: center;
                padding: 20px;
                background-color: #f8f8f8;
                border-bottom: 2px solid #ddd;
              }
              .header h1 {
                margin: 0;
                font-size: 18px;
                color: #444;
              }
              .header p {
                margin: 5px 0 0;
                font-size: 14px;
                color: #666;
              }
              .table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              .table th, .table td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              .table th {
                background-color: #f4f4f4;
                font-weight: bold;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #888;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Laporan Penjualan</h1>
              <p>${months[selectedMonth - 1]} ${selectedYear}</p>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Nama Pelanggan</th>
                  <th>Total Harga</th>
                  <th>Barang</th>
                </tr>
              </thead>
              <tbody>
                ${data.map(item => `
                  <tr>
                    <td>${item.pelanggan_name}</td>
                    <td>${item.harga}</td>
                    <td>${item.nama_barang.map(barang => `
                        ${barang.nama_barang} (${barang.kuantitas} pcs)
                    `).join('<br />')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="footer">
              <p>Generated by Hidayah App</p>
            </div>
          </body>
        </html>
      `;
  
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
      Alert.alert('Sukses', 'PDF berhasil disimpan dan dibagikan');
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Gagal mengexport PDF');
    }
  };  

  const toggleModal = (barang) => {
    setSelectedItems(barang);
    setShowModal(true);
  };

  const calculateTotalBarang = () => {
    return selectedItems.reduce((total, item) => total + item.kuantitas, 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Laporan Penjualan</Text>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity style={styles.dropdown}>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(value) => setSelectedMonth(value)}
            style={styles.picker}
          >
            {months.map((month, index) => (
              <Picker.Item key={month} label={month} value={index + 1} />
            ))}
          </Picker>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dropdown}>
          <Picker
            selectedValue={selectedYear}
            onValueChange={(value) => setSelectedYear(value)}
            style={styles.picker}
          >
            {years.map((year) => (
              <Picker.Item key={year} label={year} value={parseInt(year, 10)} />
            ))}
          </Picker>
          </TouchableOpacity>

          <TouchableOpacity style={styles.exportButton} onPress={exportToPDF}>
            <Icon name="document-text-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Memuat data...</Text>
        </View>
      ) : (
        <ScrollView style={styles.tableContent}>
          <View style={styles.tableRowHeader}>
            <Text style={styles.cellTextHeader}>Nama</Text>
            <Text style={styles.cellTextHeader}>Total Harga</Text>
            <Text style={styles.cellTextHeader}>Actions</Text>
          </View>

          {data.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.cellText}>{item.pelanggan_name}</Text>
              <Text style={styles.cellText}>{item.harga}</Text>
              <View style={styles.actionContainer}>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={() => toggleModal(item.nama_barang)}
                >
                  <Icon name="eye" size={20} color="#FFF" />
                </TouchableOpacity>
                {role !== 'admin' && (
                <TouchableOpacity 
                  style={[styles.actionButton, {backgroundColor: 'red', marginLeft: 10}]} 
                  onPress={() => confirmDelete(item.id)}
                >
                  <Icon name="trash" size={20} color="#FFF" />
                </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal visible={showModal} animationType="slide" transparent={true} onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Daftar Barang</Text>
            {selectedItems.map((barang, index) => (
              <Text key={index} style={styles.modalItem}>
                {barang.nama_barang} - {barang.kuantitas} pcs
              </Text>
            ))}
            <Text style={styles.modalTotal}>Total Barang: {calculateTotalBarang()} pcs</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  filterContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dropdown: {
    flex: 1,
    height: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginRight: 8,
    justifyContent: 'center',
  },
  picker: {
    height: 40,
  },
  exportButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableContent: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cellTextHeader: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cellText: {
    flex: 1,
    textAlign: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    backgroundColor: '#5DB075',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalItem: {
    fontSize: 16,
    marginBottom: 8,
  },
  modalTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#5DB075',
    borderRadius: 8,
  },
  closeText: {
    color: '#FFF',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Laporan;
