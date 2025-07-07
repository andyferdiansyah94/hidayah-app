import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput, Alert, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:8000/api/pelanggan';

const Pelanggan = () => {
    const navigation = useNavigation();
    const [dataPelanggan, setDataPelanggan] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentData, setCurrentData] = useState({ name: '', alamat: '', phone: '' });
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        fetchPelanggan();
    }, []);

    const fetchPelanggan = async () => {
        try {
            const response = await axios.get(API_URL);
            setDataPelanggan(response.data.data);
        } catch (error) {
            console.error('Error fetching pelanggan:', error);
            Alert.alert('Error', 'Gagal mengambil data pelanggan.');
        }
    };

    const handleAddEditData = async () => {
        if (!currentData.name || !currentData.alamat || !currentData.phone) {
            Alert.alert('Error', 'Semua data harus diisi!');
            return;
        }

        try {
            if (isEditMode) {
                await axios.put(`${API_URL}/${currentData.id}`, currentData);
                Alert.alert('Success', 'Data pelanggan berhasil diperbarui.');
            } else {
                await axios.post(API_URL, currentData);
                Alert.alert('Success', 'Data pelanggan berhasil ditambahkan.');
            }
            fetchPelanggan();
            setIsModalVisible(false);
            setCurrentData({ name: '', alamat: '', phone: '' });
        } catch (error) {
            console.error('Error saving pelanggan:', error);
            Alert.alert('Error', 'Gagal menyimpan data pelanggan.');
        }
    };

    const handleDeleteData = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            Alert.alert('Success', 'Data pelanggan berhasil dihapus.');
            fetchPelanggan();
        } catch (error) {
            console.error('Error deleting pelanggan:', error);
            Alert.alert('Error', 'Gagal menghapus data pelanggan.');
        }
    };

    const openAddModal = () => {
        setIsEditMode(false);
        setCurrentData({ name: '', alamat: '', phone: '' });
        setIsModalVisible(true);
    };

    const openEditModal = (data) => {
        setIsEditMode(true);
        setCurrentData(data);
        setIsModalVisible(true);
    };

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={[styles.cell, styles.cellName]}>{item.name}</Text>
            <Text style={[styles.cell, styles.cellAddress]}>{item.alamat}</Text>
            <Text style={[styles.cell, styles.cellPhone]}>{item.phone}</Text>
            <TouchableOpacity style={styles.cellAction} onPress={() => openEditModal(item)}>
                <Icon name="create" size={20} color="#0891b2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cellAction} onPress={() => handleDeleteData(item.id)}>
                <Icon name="trash" size={20} color="red" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Data Pelanggan</Text>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
                <Text style={styles.addButtonText}>Tambah Data</Text>
            </TouchableOpacity>

            <View style={styles.tableHeader}>
                <Text style={styles.headerText}>Nama</Text>
                <Text style={styles.headerText}>Alamat</Text>
                <Text style={styles.headerText}>Telepon</Text>
                <Text style={styles.headerText}>Aksi</Text>
            </View>

            <FlatList
                data={dataPelanggan}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setIsModalVisible(false)}
            >
                <TouchableWithoutFeedback
                    onPress={() => setIsModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{isEditMode ? 'Edit Data' : 'Tambah Data'}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nama Pelanggan"
                                value={currentData.name}
                                onChangeText={(text) => setCurrentData({ ...currentData, name: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Alamat"
                                value={currentData.alamat}
                                onChangeText={(text) => setCurrentData({ ...currentData, alamat: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Phone"
                                value={currentData.phone}
                                keyboardType="phone-pad"
                                onChangeText={(text) => setCurrentData({ ...currentData, phone: text })}
                            />
                            <TouchableOpacity style={styles.saveButton} onPress={handleAddEditData}>
                                <Text style={styles.saveButtonText}>{isEditMode ? 'Simpan Perubahan' : 'Tambah Data'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
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
    tableHeader: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#e0e0e0',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        marginHorizontal: 16,
    },
    headerText: {
        flex: 1,
        color: 'black',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },    
    addButton: {
        backgroundColor: '#0891b2',
        padding: 12,
        borderRadius: 8,
        margin: 16,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    tableHeader: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#e9ecef',
        marginLeft: 12,
        marginRight: 12,
    },
    tableHeaderText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
    },
    cell: {
        padding: 5,
        textAlign: 'center',
    },
    cellName: {
        flex: 2,
    },
    cellAddress: {
        flex: 3,
    },
    cellPhone: {
        flex: 2,
    },
    cellAction: {
        flex: 1,
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ced4da',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: '#0891b2',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    successContent: {
        width: '70%',
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    successText: {
        fontSize: 16,
        marginTop: 10,
    },
    modalContentWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
});

export default Pelanggan;
