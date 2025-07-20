import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const LaporanPenjualan = () => {
  const navigation = useNavigation();

  const [dataBarang, setDataBarang] = useState([]);
  const [dataJasa, setDataJasa] = useState([]);
  const [dataPelanggan, setDataPelanggan] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedHarga, setSelectedHarga] = useState(0);
  const [selectedPelanggan, setSelectedPelanggan] = useState('');
  const [tableData, setTableData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [totalHarga, setTotalHarga] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedBarang, setSelectedBarang] = useState('');
  const [selectedJasa, setSelectedJasa] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const barangResponse = await axios.get('http://10.0.2.2:8000/api/barang');
        setDataBarang(barangResponse.data.data);
        const jasaResponse = await axios.get('http://10.0.2.2:8000/api/jasa');
        setDataJasa(jasaResponse.data.data);
        const pelangganResponse = await axios.get('http://10.0.2.2:8000/api/pelanggan');
        setDataPelanggan(pelangganResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleBarangChange = (itemValue) => {
    setSelectedBarang(itemValue);
    const selected = dataBarang.find(item => item.name === itemValue);
    if (selected) {
      setSelectedHarga(parseInt(selected.price));
      setSelectedItem(selected.name);
    }
  };

  const handleJasaChange = (itemValue) => {
    setSelectedJasa(itemValue);
    const selected = dataJasa.find((item) => item.name === itemValue);
    if (selected) {
      setSelectedHarga(parseInt(selected.price));
      setSelectedItem(selected.name);
    }
  };

  const handleMasukanBarang = () => {
    let selectedItemData = null;
  
    if (selectedBarang) {
      selectedItemData = dataBarang.find((item) => item.name === selectedBarang);
    } else if (selectedJasa) {
      selectedItemData = dataJasa.find((item) => item.name === selectedJasa);
    }
  
    if (!selectedItemData) {
      alert('Pilih barang atau jasa terlebih dahulu');
      return;
    }
  
    const newItem = {
      id: selectedItemData.id,
      name: selectedItemData.name,
      kuantitas: 1,
      price: selectedItemData.price,
      type: selectedBarang ? 'barang' : 'jasa',
    };
  
    setTableData([...tableData, newItem]);
    updateTotalHarga([...tableData, newItem]);
    setSelectedBarang('');
    setSelectedJasa('');
    setSelectedHarga(0);
  };
  

  const updateTotalHarga = (data) => {
    const total = data.reduce((sum, item) => sum + (item.price * item.kuantitas), 0);
    setTotalHarga(total);
  };

  const handleKuantitasChange = (index, newKuantitas) => {
    const updatedData = [...tableData];
    updatedData[index] = {
      ...updatedData[index],
      kuantitas: parseInt(newKuantitas) || 1,
    };
    setTableData(updatedData);
    updateTotalHarga(updatedData);
  };

  const handleInputPenjualan = async () => {
    if (!selectedPelanggan || tableData.length === 0) {
      alert('Harap pilih pelanggan dan masukkan barang/jasa');
      return;
    }
  
    const namaBarang = tableData
      .filter((item) => item.type === 'barang') 
      .map((item) => ({
        id_barang: item.id,
        nama_barang: item.name,
        kuantitas: item.kuantitas,
      }));
  
    const namaJasa = tableData
      .filter((item) => item.type === 'jasa')
      .map((item) => ({
        id_jasa: item.id,
        nama_jasa: item.name,
        kuantitas: item.kuantitas,
      }));
  
    const payload = {
      nama_barang: namaBarang,
      nama_jasa: namaJasa,
      pelanggan_id: selectedPelanggan,
      harga: totalHarga,
    };
  
    console.log('Payload:', JSON.stringify(payload, null, 2));
  
    try {
      const response = await axios.post('http://10.0.2.2:8000/api/penjualan', payload);
  
      if (response.data.message) {
        console.log('Penjualan berhasil:', response.data);
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          setTableData([]);
          setSelectedItem('');
          setSelectedPelanggan('');
          setTotalHarga(0);
        }, 2000);
      }
    } catch (error) {
      console.error('Error input penjualan:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Gagal menyimpan penjualan');
      }
      setShowModal(true);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Input Penjualan</Text>
      </View>

      <View style={styles.inputContainer}>
      <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedBarang}
        onValueChange={handleBarangChange}
        style={styles.picker}
      >
        <Picker.Item label="Pilih Barang" value="" />
        {dataBarang.map((item) => (
          <Picker.Item key={item.id} label={item.name} value={item.name} />
        ))}
      </Picker>
    </View>

    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedJasa}
        onValueChange={handleJasaChange}
        style={styles.picker}
      >
        <Picker.Item label="Pilih Jasa" value="" />
        {dataJasa.map((item) => (
          <Picker.Item key={item.id} label={item.name} value={item.name} />
        ))}
      </Picker>
    </View>

        <View style={styles.hargaInput}>
          <Text style={styles.hargaText}>Rp {selectedHarga.toLocaleString()}</Text>
        </View>

        <TouchableOpacity
          style={styles.buttonMasukan}
          onPress={handleMasukanBarang}
        >
          <Text style={styles.buttonText}>Masukan Barang</Text>
        </TouchableOpacity>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.columnHeader}>Nama</Text>
            <Text style={styles.columnHeader}>Kuantitas</Text>
            <Text style={styles.columnHeader}>Harga</Text>
          </View>

          <ScrollView style={styles.tableBody}>
            {tableData.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.name}</Text>
                <TextInput
                  style={styles.kuantitasInput}
                  keyboardType="numeric"
                  value={String(item.kuantitas)}
                  onChangeText={(value) => handleKuantitasChange(index, value)}
                />
                <Text style={styles.tableCell}>
                  {(item.price * item.kuantitas).toLocaleString()}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>
            Total Harga: Rp {totalHarga.toLocaleString()}
          </Text>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPelanggan}
            onValueChange={(value) => setSelectedPelanggan(value)}
            style={styles.picker}
          >
            <Picker.Item label="Nama Pelanggan" value="" />
            {dataPelanggan.map((item) => (
              <Picker.Item key={item.id} label={item.name} value={item.id} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          style={styles.buttonInput}
          onPress={handleInputPenjualan}
        >
          <Text style={styles.buttonText}>Input Penjualan</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <MaterialIcons name={errorMessage ? "error" : "check-circle"} size={64} color={errorMessage ? "#f44336" : "#4CAF50"} />
            <Text style={styles.modalText}>{errorMessage || "Penjualan berhasil ditambahkan"}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 16,
  },
  inputContainer: {
    padding: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  hargaInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  hargaText: {
    color: '#666',
  },
  buttonMasukan: {
    backgroundColor: '#F79300',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonInput: {
    backgroundColor: '#F79300',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 16,
    maxHeight: 200,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  columnHeader: {
    flex: 1,
    padding: 12,
    fontWeight: '500',
  },
  tableBody: {
    maxHeight: 150,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tableCell: {
    flex: 1,
    padding: 12,
  },
  kuantitasContainer: {
    flex: 1,
  },
  totalContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LaporanPenjualan;