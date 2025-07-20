import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, FlatList, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const EmployeeData = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [successVisible, setSuccessVisible] = useState(false);
    const [employeeData, setEmployeeData] = useState([]);

    const apiUrl = 'http://10.0.2.2:8000/api/employees';

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(apiUrl);
            setEmployeeData(response.data.data);
        } catch (error) {
            Alert.alert('Error', 'Gagal mengambil data karyawan');
        }
    };

    const handleAddData = async () => {
        try {
            await axios.post(apiUrl, { name, phone, address, status });
            fetchEmployees();
            setSuccessVisible(true);
            setModalVisible(false);
            setTimeout(() => setSuccessVisible(false), 2000);
        } catch (error) {
            Alert.alert('Error', 'Gagal menambahkan data');
        }
    };

    const handleEditData = async () => {
        try {
            await axios.put(`${apiUrl}/${selectedEmployee.id}`, { name, phone, address, status });
            fetchEmployees();
            setSuccessVisible(true);
            setEditModalVisible(false);
            setTimeout(() => setSuccessVisible(false), 2000);
        } catch (error) {
            Alert.alert('Error', 'Gagal mengubah data');
        }
    };

    const handleDeleteData = async (id) => {
        try {
            await axios.delete(`${apiUrl}/${id}`);
            fetchEmployees();
            Alert.alert('Success', 'Data berhasil dihapus');
        } catch (error) {
            Alert.alert('Error', 'Gagal menghapus data');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Data Karyawan</Text>
            </View>
    
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>Tambah Data</Text>
            </TouchableOpacity>
    
            <View style={styles.tableHeader}>
                <Text style={styles.headerText}>Nama</Text>
                <Text style={styles.headerText}>Telepon</Text>
                <Text style={styles.headerText}>Alamat</Text>
                <Text style={styles.headerText}>Status</Text>
                <Text style={styles.headerText}>Aksi</Text>
            </View>
    
            <FlatList
                data={employeeData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.employeeRow}>
                        <Text style={styles.employeeText}>{item.name}</Text>
                        <Text style={styles.employeeText}>{item.phone}</Text>
                        <Text style={styles.employeeText}>{item.address}</Text>
                        <Text style={styles.employeeText}>{item.status}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedEmployee(item);
                                setName(item.name);
                                setPhone(item.phone);
                                setAddress(item.address);
                                setStatus(item.status);
                                setEditModalVisible(true);
                            }}
                        >
                            <Icon name="create" size={24} color="#F79300" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteData(item.id)}>
                            <Icon name="trash" size={24} color="red" />
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
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalContent}
                        activeOpacity={1}
                        onPress={() => {}}
                    >
                        <Text style={styles.modalTitle}>Tambah Data</Text>
                        <TextInput
                            placeholder="Nama Karyawan"
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            placeholder="No Telepon"
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                        <TextInput
                            placeholder="Alamat"
                            style={styles.input}
                            value={address}
                            onChangeText={setAddress}
                        />
                        <View style={styles.dropdownContainer}>
                            <Picker
                                selectedValue={status}
                                onValueChange={(itemValue) => setStatus(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Pilih Status" value="" />
                                <Picker.Item label="PKWT" value="PKWT" />
                                <Picker.Item label="PKWTT" value="PKWTT" />
                            </Picker>
                        </View>
                        <TouchableOpacity style={styles.modalButton} onPress={handleAddData}>
                            <Text style={styles.modalButtonText}>Tambah Data</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setEditModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalContent}
                        activeOpacity={1}
                        onPress={() => {}}
                    >
                        <Text style={styles.modalTitle}>Edit Data Karyawan</Text>
                        <TextInput
                            placeholder="Nama Karyawan"
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            placeholder="No Telepon"
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                        <TextInput
                            placeholder="Alamat"
                            style={styles.input}
                            value={address}
                            onChangeText={setAddress}
                        />
                        <View style={styles.dropdownContainer}>
                            <Picker
                                selectedValue={status}
                                onValueChange={(itemValue) => setStatus(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Pilih Status" value="" />
                                <Picker.Item label="PKWT" value="PKWT" />
                                <Picker.Item label="PKWTT" value="PKWTT" />
                            </Picker>
                        </View>
                        <TouchableOpacity style={styles.modalButton} onPress={handleEditData}>
                            <Text style={styles.modalButtonText}>Simpan Perubahan</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={successVisible}
                onRequestClose={() => setSuccessVisible(false)}
            >
                <View style={styles.successContainer}>
                    <View style={styles.successContent}>
                        <Icon name="create" size={32} color="green" />
                        <Text style={styles.successText}>Berhasil Ditambahkan!</Text>
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
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '500',
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
    },
    employeeText: {
        flex: 1,
        fontSize: 14,
    },
    icon: {
        fontSize: 18,
        color: '#737373',
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
    dropdownContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 10,
        overflow: 'hidden',
    },
    picker: {
        width: '100%',
    },
    modalButton: {
        backgroundColor: '#0891b2',
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
        fontWeight: 'bold',
        color: 'green',
    },
});

export default EmployeeData;
