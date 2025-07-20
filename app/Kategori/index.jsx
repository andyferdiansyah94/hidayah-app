import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://10.0.2.2:8000/api/kategori';

const Kategori = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editCategory, setEditCategory] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCategory = async () => {
    try {
      const response = await axios.post(API_URL, { nama_kategori: categoryName });
      setData([...data, response.data.data]);
      setIsModalVisible(false);
      setCategoryName('');
    } catch (error) {
      console.error('Error adding category:', error.response?.data || error.message);
      Alert.alert('Error', 'Gagal menambahkan kategori.');
    }
  };

  const handleEditCategory = async () => {
    try {
      const response = await axios.put(`${API_URL}/${editCategory.id_kategori}`, { nama_kategori: categoryName });
      setData(data.map(item => (item.id_kategori === editCategory.id ? response.data.data : item)));
      setIsEditModalVisible(false);
      setCategoryName('');
      fetchData();
    } catch (error) {
      console.error('Error updating category:', error.response?.data || error.message);
      Alert.alert('Error', 'Gagal mengupdate kategori.');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      Alert.alert('Sukses', 'Kategori berhasil dihapus.');
      fetchData();
    } catch (error) {
      console.error('Error deleting category:', error.response?.data || error.message);
      Alert.alert('Error', 'Gagal menghapus kategori.');
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kategori Barang</Text>
      </View>
      <View style={styles.content}>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.addButtonText}>Tambah Kategori</Text>
        </TouchableOpacity>
  
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Nama Kategori</Text>
          <Text style={styles.tableHeaderText}>Aksi</Text>
        </View>
  
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id_kategori)}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.nama_kategori}</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setEditCategory(item);
                    setCategoryName(item.nama_kategori);
                    setIsEditModalVisible(true);
                  }}
                >
                  <Icon name="create" size={24} color="#F79300" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleDeleteCategory(item.id_kategori)}
                >
                  <Icon name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
  
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <TouchableOpacity style={styles.modalContainer} onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tambah Kategori</Text>
            <TextInput
              placeholder="Nama Kategori"
              style={styles.input}
              value={categoryName}
              onChangeText={setCategoryName}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleAddCategory}>
              <Text style={styles.submitButtonText}>Tambah</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
  
      <Modal visible={isEditModalVisible} animationType="slide" transparent={true}>
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setIsEditModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Kategori</Text>
            <TextInput
              placeholder="Nama Kategori"
              style={styles.input}
              value={categoryName}
              onChangeText={setCategoryName}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleEditCategory}>
              <Text style={styles.submitButtonText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    flex: 1,
    padding: 16,
  },  
  addButton: {
    backgroundColor: '#F79300',
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
    justifyContent: 'center',
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
    fontWeight: 'bold',
  },
  closeButtonText: {
    color: '#0891b2',
    marginTop: 10,
  },
  editButton: {
    padding: 8,
  },
});

export default Kategori;
