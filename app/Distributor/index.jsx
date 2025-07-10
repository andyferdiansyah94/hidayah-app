import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const Distributor = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); 
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [successVisible, setSuccessVisible] = useState(false);
    const [distributors, setDistributors] = useState([]);

    // Fetching distributors data from API
    useEffect(() => {
        fetchDistributors();
    }, []);

    const fetchDistributors = async () => {
        try {
            const response = await axios.get('http://10.0.2.2:8000/api/distributors');
            setDistributors(response.data.data);
        } catch (error) {
            console.error('Error fetching distributors: ', error);
        }
    };

    const handleAddData = async () => {
        try {
            const response = await axios.post('http://10.0.2.2:8000/api/distributors', {
                name,
                phone,
                address
            });
            setDistributors([...distributors, response.data.data]);
            setSuccessVisible(true);
            setModalVisible(false);
            setTimeout(() => setSuccessVisible(false), 2000);
        } catch (error) {
            console.error('Error adding distributor: ', error);
        }
    };

    const handleEditData = async () => {
        try {
            const response = await axios.put(`http://10.0.2.2:8000/api/distributors/${selectedItem.id}`, {
                name,
                phone,
                address
            });
            const updatedDistributors = distributors.map(item => 
                item.id === selectedItem.id ? response.data.data : item
            );
            setDistributors(updatedDistributors);
            setSuccessVisible(true);
            setModalVisible(false);
            setTimeout(() => setSuccessVisible(false), 2000);
        } catch (error) {
            console.error('Error editing distributor: ', error);
        }
    };

    const handleDeleteData = async (id) => {
        try {
            await axios.delete(`http://10.0.2.2:8000/api/distributors/${id}`);
            setDistributors(distributors.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting distributor: ', error);
        }
    };

    const handleEditDataModal = (item) => {
        setEditMode(true);
        setSelectedItem(item);
        setName(item.name);
        setPhone(item.phone);
        setAddress(item.address);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Data Distributor</Text>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>Tambah Data</Text>
            </TouchableOpacity>

            <View style={styles.tableHeader}>
                <Text style={styles.headerText}>Name</Text>
                <Text style={styles.headerText}>Address</Text>
                <Text style={styles.headerText}>Phone</Text>
                <Text style={styles.headerText}>Action</Text>
            </View>

            <FlatList
                data={distributors}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.employeeRow}>
                        <Text style={styles.employeeText}>{item.name}</Text>
                        <Text style={styles.employeeText}>{item.address}</Text>
                        <Text style={styles.employeeText}>{item.phone}</Text>
                        <TouchableOpacity onPress={() => handleEditDataModal(item)} style={styles.editButton}>
                            <Icon name="create" size={20} color="#F79300" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteData(item.id)} style={styles.deleteButton}>
                            <Icon name="trash" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity style={styles.modalOverlay} onPressOut={() => setModalVisible(false)}>
                    <TouchableOpacity style={styles.modalContent} onPress={() => {}}>
                        <Text style={styles.modalTitle}>{editMode ? 'Edit Data' : 'Tambah Data'}</Text>
                        <TextInput
                            placeholder="Nama Distributor"
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            placeholder="Alamat"
                            style={styles.input}
                            value={address}
                            onChangeText={setAddress}
                        />
                        <TextInput
                            placeholder="No Telepon"
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                        <TouchableOpacity style={styles.modalButton} onPress={editMode ? handleEditData : handleAddData}>
                            <Text style={styles.modalButtonText}>{editMode ? 'Simpan Perubahan' : 'Tambah Data'}</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <Modal animationType="fade" transparent={true} visible={successVisible}>
                <View style={styles.successContainer}>
                    <View style={styles.successContent}>
                        <Icon name="checkmark-circle" size={32} color="green" />
                        <Text style={styles.successText}>{editMode ? 'Berhasil Diubah!' : 'Berhasil Ditambahkan!'}</Text>
                    </View>
                </View>
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
        backgroundColor: '#F79300',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 16,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    employeeRow: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'white',
        marginBottom: 5,
        borderRadius: 5,
        marginHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    employeeText: {
        flex: 1,
        fontSize: 14,
    },
    editButton: {
        padding: 5,
        marginLeft: 10,
    },
    deleteButton: {
        padding: 5,
        marginLeft: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 10,
    },
    modalButton: {
        backgroundColor: '#F79300',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    successContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    successText: {
        fontSize: 16,
        color: 'green',
        fontWeight: 'bold',
        marginTop: 10,
    },
});

export default Distributor;
