import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useNavigation } from 'expo-router';

const API_URL = 'http://10.0.2.2:8000/api/barang';
const CATEGORY_API_URL = 'http://10.0.2.2:8000/api/kategori';

const Barang = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [editItem, setEditItem] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORY_API_URL);
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching kategori data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const handleAddData = async () => {
    try {
      const newItem = { name: itemName, quantity: parseInt(quantity), price: price, category: category };
      const response = await axios.post(API_URL, newItem);
      setData([...data, response.data.data]);
      setIsModalVisible(false);
      setIsSuccessVisible(true);
      resetForm();
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  const handleEditData = async () => {
    try {
      const updatedItem = { name: itemName, quantity: parseInt(quantity), price: price, category: category };
      await axios.put(`${API_URL}/${editItem.id}`, updatedItem);
      setData(data.map(item => (item.id === editItem.id ? { ...item, ...updatedItem } : item)));
      setIsEditModalVisible(false);
      setIsSuccessVisible(true);
      resetForm();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleDeleteData = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setData(data.filter(item => item.id !== id));
      Alert.alert('Success', 'Data deleted successfully');
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const resetForm = () => {
    setItemName('');
    setQuantity('');
    setPrice('');
    setCategory('');
    setEditItem(null);
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Data Barang</Text>
      </View>

    <View style={styles.content}>
    <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
      <Text style={styles.addButtonText}>Tambah Data</Text>
    </TouchableOpacity>

    <TextInput
      style={styles.searchInput}
      placeholder='Cari Nama Barang...'
      value={searchTerm}
      onChangeText={setSearchTerm}
    />

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Name</Text>
        <Text style={styles.tableHeaderText}>Quantity</Text>
        <Text style={styles.tableHeaderText}>Price</Text>
        <Text style={styles.tableHeaderText}>Category</Text>
        <Text style={styles.tableHeaderText}>Action</Text>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.name}</Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCell}>{item.price}</Text>
            <Text style={styles.tableCell}>{item.category}</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setEditItem(item);
                  setItemName(item.name);
                  setQuantity(item.quantity.toString());
                  setPrice(item.price);
                  setCategory(item.category);
                  setIsEditModalVisible(true);
                }}
              >
                <Icon name="create" size={24} color="#0891b2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={() => handleDeleteData(item.id)}>
                <Icon name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

<Modal visible={isModalVisible} animationType="slide" transparent={true}>
  <TouchableOpacity style={styles.modalContainer} onPress={() => setIsModalVisible(false)}>
    <View style={styles.modalContent} onStartShouldSetResponder={(e) => e.stopPropagation()}>
      <Text style={styles.modalTitle}>Tambah Data</Text>
      <TextInput
        placeholder="Nama Barang"
        style={styles.input}
        value={itemName}
        onChangeText={setItemName}
      />
      <TextInput
        placeholder="Kuantitas"
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Harga"
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <Picker
        selectedValue={category}
        style={styles.input}
        onValueChange={(itemValue) => setCategory(itemValue)}
      >
      <Picker.Item label="Pilih Kategori" value="" />
                {categories.map((cat) => (
                  <Picker.Item key={cat.nama_kategori} label={cat.nama_kategori} value={cat.nama_kategori} />
                ))}
      </Picker>
      <TouchableOpacity style={styles.submitButton} onPress={handleAddData}>
        <Text style={styles.submitButtonText}>Tambah Data</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
</Modal>

      <Modal visible={isEditModalVisible} animationType="slide" transparent={true}>
        <TouchableOpacity style={styles.modalContainer} onPress={() => {setIsEditModalVisible(false); resetForm();}}>
          <View style={styles.modalContent} onStartShouldSetResponder={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Edit Data</Text>
            <TextInput
              placeholder="Nama Barang"
              style={styles.input}
              value={itemName}
              onChangeText={setItemName}
            />
            <TextInput
              placeholder="Kuantitas"
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Harga"
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
           <Picker
              selectedValue={category}
              style={styles.input}
              onValueChange={(itemValue) => setCategory(itemValue)}
            >
            <Picker.Item label="Pilih Kategori" value="" />
                      {categories.map((cat) => (
                        <Picker.Item key={cat.nama_kategori} label={cat.nama_kategori} value={cat.nama_kategori} />
                      ))}
            </Picker>
            <TouchableOpacity style={styles.submitButton} onPress={handleEditData}>
              <Text style={styles.submitButtonText}>Simpan Perubahan</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  content: {
    padding: 16,
  },
  addButton: {
    backgroundColor: '#0891b2',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    padding: 8,
    borderRadius: 4,
    justifyContent: 'space-between',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
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
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  submitButton: {
    backgroundColor: '#0891b2',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  successContent: {
    width: 250,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  successText: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: 'bold',
  },
  closeButtonText: {
    color: '#007bff',
    marginTop: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    padding: 8,
    borderRadius: 4,
    justifyContent: 'space-between',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 15,
  },
});

export default Barang;
