import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, FlatList, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { use } from 'react';
import { IconButton, Menu } from 'react-native-paper';

const API_URL = 'http://10.0.2.2:8000/api/employees';


const EmployeeData = () => {
    const navigation = useNavigation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isSuccessVisible, setIsSuccessVisible] = useState(false);
    const [employeeData, setEmployeeData] = useState([]);
    const [itemName, setItemName] = useState('');
    const [editItem, setEditItem] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('latest');
    const [data, setData] = useState([]);
    const [isSortModalVisible, setIsSortModalVisible] = useState(false);
    const [visibleMenu, setVisibleMenu] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);


    const fetchData = async () => {
        try {
        const response = await axios.get(API_URL, {
            params: {
                search: searchTerm,
                sort: sortOption,
            },
        });
        setData(response.data.data);
        } catch (error) {
        console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [searchTerm, sortOption]);

    const handleAddData = async () => {
        try {
            const newItem = { name: itemName, phone: phone, address: address, status: status  };
            const response = await axios.post(API_URL, newItem);
            setData([response.data.data, ...data]);
            setIsSuccessVisible(true);
            setIsModalVisible(false);
            resetForm();
        } catch (error) {
            Alert.alert('Error', 'Gagal menambahkan data');
        }
    };

    const handleEditData = async () => {
        try {
            const updatedItem = { name: itemName, phone: phone, address: address, status: status };
            await axios.put(`${API_URL}/${editItem.id}`, updatedItem);
            setData(data.map(item => (item.id === editItem.id ? { ...item, ...updatedItem } : item)));
            setIsSuccessVisible(true);
            setIsEditModalVisible(false);
            resetForm();
        } catch (error) {
            Alert.alert('Error', 'Gagal mengubah data');
        }
    };

    const handleDeleteData = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setData(data.filter(item => item.id !== id));
            Alert.alert('Success', 'Data deleted succesfully');
        } catch (error) {
            Alert.alert('Error', 'Gagal menghapus data');
        }
    };

    const resetForm = () => {
        setItemName('');
        setAddress('');
        setPhone('');
        setStatus('');
        setEditItem(null);
    };

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Data Karyawan</Text>
            </View>

            <View style={styles.content}>
                <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
                    <Text style={styles.addButtonText}>Tambah Data</Text>
                </TouchableOpacity>
        
                <View style={styles.searchSortContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder='Cari Nama Karyawan...'
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                    <TouchableOpacity onPress={() => setIsSortModalVisible(true)} style={styles.filterButton}>
                        <Icon name='funnel' size={20} color="#F79300" />
                    </TouchableOpacity>
                </View>
        
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator = {false}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.employeeText}>{item.name}</Text>
                            </View>

                            <Menu
                                visible={visibleMenu === item.id}
                                onDismiss={() => setVisibleMenu(null)}
                                anchor={
                                    <IconButton
                                        icon='dots-vertical'
                                        size={24}
                                        onPress={() => setVisibleMenu(visibleMenu === item.id ? null : item.id)}
                                        color='#000'
                                    />
                                }
                            >
                                <Menu.Item
                                    onPress={() => {
                                        setSelectedItem(item);
                                        setIsDetailModalVisible(true);
                                        setVisibleMenu(null);
                                    }}
                                    title="Detail Karyawan"
                                    leadingIcon={() => <Icon name='eye' size={20} color="#F79300" />}
                                />
                                <Menu.Item
                                    onPress={() => {
                                        setEditItem(item);
                                        setItemName(item.name);
                                        setAddress(item.address);
                                        setPhone(item.phone);
                                        setStatus(item.status);
                                        setIsEditModalVisible(true);
                                        setVisibleMenu(null);
                                    }}
                                    title="Edit Karyawan"
                                    leadingIcon={() => <Icon name='create' size={20} color='#F79300' />}
                                />
                                <Menu.Item
                                    onPress={() => {
                                        handleDeleteData(item.id);
                                        setVisibleMenu(null);
                                    }}
                                    title="Hapus Karyawan"
                                    leadingIcon={() => <Icon name='trash' size={20} color="red" />}
                                />
                            </Menu>
                        </View>
                    )}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    contentContainerStyle={{ paddingBottom: 10 }}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyComponent}>
                            <Text style={{ color: "#888" }}>Tidak ada data yang ditemukan</Text>
                        </View>
                    )}
                    style={{ flex: 1 }}
                />

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => setIsModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPressOut={() => setIsModalVisible(false)}
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
                                value={itemName}
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
                    visible={isEditModalVisible}
                    onRequestClose={() => setIsEditModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPressOut={() => setIsEditModalVisible(false)}
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
                                value={itemName}
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
                    visible={isSuccessVisible}
                    onRequestClose={() => setIsSuccessVisible(false)}
                >
                    <View style={styles.successContainer}>
                        <View style={styles.successContent}>
                            <Icon name="create" size={32} color="green" />
                            <Text style={styles.successText}>Berhasil Ditambahkan!</Text>
                        </View>
                    </View>
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
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 16,
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
        fontSize: 18,
        marginLeft: 16,
        fontWeight: 'bold',
        color: "black"
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
        fontWeight: 'bold',
        color: 'green',
    },
    content: {
        padding: 16,
        flex: 1,
    },
    searchSortContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'center',
    },
    filterButton: {
        marginLeft: 10,
        padding: 10,
        width: 44,
        height: 44,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 44,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '100%',
        height: 100,
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        alignItems: 'center',
    },
    emptyComponent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});

export default EmployeeData;
