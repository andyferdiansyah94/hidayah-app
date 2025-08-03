import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { Menu, IconButton } from 'react-native-paper';
import { set, sub } from 'react-native-reanimated';

const Distributor = () => {
    const navigation = useNavigation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null); 
    const [itemName, setItemName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [isSuccessVisible, setIsSuccessVisible] = useState(false);
    const [distributors, setDistributors] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerms, setSearchTerms] = useState('');
    const [isSortModalVisible, setIsSortModalVisible] = useState(false);
    const [visibleMenu, setVisibleMenu] = useState(null);
    const [sortOption, setSortOption] = useState('latest'); // Default sort by latest

    // Fetching distributors data from API
    useEffect(() => {
        fetchDistributors();
    }, [searchTerms, sortOption]);

    const fetchDistributors = async () => {
        try {
            const response = await axios.get('http://10.0.2.2:8000/api/distributors', {
                params: {
                    search: searchTerms,
                    sort: sortOption
                },
            });
            setDistributors(response.data.data);
        } catch (error) {
            console.error('Error fetching distributors: ', error);
        }
    };

    const handleAddData = async () => {
        try {
            const newItem = {
                name: itemName,
                phone: phone,
                address: address
            };
            const response = await axios.post('http://10.0.2.2:8000/api/distributors', newItem);
            setDistributors([response.data.data, ...distributors]);
            setIsModalVisible(false);
            setIsSuccessVisible(true);
            setTimeout(() => setIsSuccessVisible(false), 2000);
            resetForm();
        } catch (error) {
            console.error('Error adding distributor: ', error);
        }
    };

    const handleEditData = async () => {
        try {
            const updatedItem = { name: itemName, phone: phone, address: address };
            await axios.put(`http://10.0.2.2:8000/api/distributors/${editItem.id}`, updatedItem);
            const updatedDistributors = distributors.map(item =>
                item.id === editItem.id ? { ...item, ...updatedItem } : item
            );
            setDistributors(updatedDistributors);
            setIsEditModalVisible(false);
            setIsSuccessVisible(true);
            setTimeout(() => setIsSuccessVisible(false), 2000);
            resetForm();
        } catch (error) {
            console.error('Error editing distributor: ', error);
        }
    };

    
    const handleDeleteData = async (id) => {
        try {
            await axios.delete(`http://10.0.2.2:8000/api/distributors/${id}`);
            setDistributors(distributors.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting data: ', error);
        }
    };

    const resetForm = () => {
        setItemName('');
        setPhone('');
        setAddress('');
        setSelectedItem(null);
        setEditItem(null);
    };

    const handleEditDataModal = (item) => {
        setEditItem(item);
        setItemName(item.name);
        setPhone(item.phone);
        setAddress(item.address);
        setIsEditModalVisible(true);
    };

    const filterDistributors = distributors.filter(item =>
        item.name.toLowerCase().includes(searchTerms.toLowerCase()) ||
        item.address.toLowerCase().includes(searchTerms.toLowerCase()) ||
        item.phone.toLowerCase().includes(searchTerms.toLowerCase())
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchDistributors();
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Data Distributor</Text>
            </View>

            <View style={styles.content}>
                <TouchableOpacity style={styles.addButton} onPress={() => {
                    setIsModalVisible(true)}}>
                    <Text style={styles.addButtonText}>Tambah Data</Text>
                </TouchableOpacity>

                <View style={styles.searchSortContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder='Cari nama, alamat, atau no telepon'
                        value={searchTerms}
                        onChangeText={setSearchTerms}
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={() => {setIsSortModalVisible(true)}}>
                        <Icon name="funnel" size={20} color="#F79300" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={filterDistributors}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={{ flex:1 }}>
                                <Text style={styles.employeeText}>{item.name}</Text>
                            </View>

                            <Menu
                                visible={visibleMenu === item.id}
                                onDismiss={() => setVisibleMenu(null)}
                                anchor={
                                    <IconButton
                                        icon="dots-vertical"
                                        size={24}
                                        onPress={() => setVisibleMenu(visibleMenu === item.id ? null : item.id)}
                                        color="#000"
                                    />
                                }
                            >
                                <Menu.Item
                                    onPress={() => {
                                        setSelectedItem(item);
                                        setIsDetailModalVisible(true);
                                        setVisibleMenu(null);
                                    }}
                                    title="Detail Distributor"
                                    leadingIcon={() => <Icon name="eye" size={20} color="#F79300" />}
                                />
                                <Menu.Item
                                    onPress={() => {
                                        handleEditDataModal(item);
                                        setVisibleMenu(null);
                                    }}
                                    title="Edit Distributor"
                                    leadingIcon={() => <Icon name="create" size={20} color="#F79300" />}
                                />
                                <Menu.Item
                                    onPress={() => {
                                        handleDeleteData(item.id);
                                        setVisibleMenu(null);
                                    }}
                                    title="Hapus Distributor"
                                    leadingIcon={() => <Icon name="trash" size={20} color="red" />}
                                />
                            </Menu>
                        </View>
                    )}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    contentContainerStyle={{ paddingBottom: 10 }}
                    ListEmptyComponent={() => (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={{ color: '#999' }}>Tidak ada data distributor ditemukan.</Text>
                        </View>
                    )}
                    style={{  flex: 1 }}
                />
            </View>
        

            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <TouchableOpacity style={styles.modalCountainer} onPress={() => setIsModalVisible(false)}>
                    <View style={styles.modalContent} onStartShouldSetResponder={(e) => e.stopPropagation()}>
                        <Text style={styles.modalTitle}>Tambah Data</Text>
                        <TextInput
                            placeholder="Nama Distributor"
                            style={styles.input}
                            value={itemName}
                            onChangeText={setItemName}
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
                        <TouchableOpacity style={styles.submitButton} onPress={handleAddData}>
                            <Text style={styles.submitButtonText}>Tambah Data</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal visible={isEditModalVisible} animationType="slide" transparent={true}>
                <TouchableOpacity style={styles.modalCountainer} onPress={() => {setIsEditModalVisible(false); resetForm();}}>
                    <View style={styles.modalContent} onStartShouldSetResponder={(e) => e.stopPropagation()}>
                        <Text style={styles.modalTitle}>Edit Data</Text>
                        <TextInput
                            placeholder="Nama Distributor"
                            style={styles.input}
                            value={itemName}
                            onChangeText={setItemName}
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
                        <TouchableOpacity style={styles.submitButton} onPress={handleEditData}>
                            <Text style={styles.submitButtonText}>Simpan Perubahan</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal visible={isDetailModalVisible} animationType="slide" transparent={true}>
                <TouchableOpacity style={styles.modalCountainer} onPress={() => setIsDetailModalVisible(false)}>
                    <View style={styles.modalContent} onStartShouldSetResponder={(e) => e.stopPropagation()}>
                        <Text style={styles.modalTitle}>Detail Distributor</Text>
                        {selectedItem ? (
                            <>
                                <Text style={styles.input}>Nama: {selectedItem.name}</Text>
                                <Text style={styles.input}>Alamat: {selectedItem.address}</Text>
                                <Text style={styles.input}>No Telepon: {selectedItem.phone}</Text>
                            </>
                        ) : (
                            <Text style={styles.input}>Tidak ada data yang dipilih.</Text>
                        )}
                        <TouchableOpacity style={styles.submitButton} onPress={() => setIsDetailModalVisible(false)}>
                            <Text style={styles.submitButtonText}>Tutup</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal visible={isSuccessVisible} transparent={true} animationType="fade">
                <View style={styles.successContainer}>
                    <View style={styles.successContent}>
                        <Icon name="checkmark-circle" size={50} color="green" />
                        <Text style={styles.successText}>Data berhasil disimpan!</Text>
                    </View>
                </View>
            </Modal>

            <Modal visible={isSortModalVisible} transparent={true} animationType="slide" onRequestClose={() => setIsSortModalVisible(false)}>
                <TouchableOpacity activeOpacity={1} style={styles.modalOverlay} onPress={() => setIsSortModalVisible(false)}>
                    <TouchableOpacity activeOpacity={1} style={styles.bottomSheet} onPress={() => {}}>
                        <View style={styles.sortHeader}>
                            <Text style={styles.sortTitle}>Urutkan Berdasarkan</Text>
                            <TouchableOpacity onPress={() => setIsSortModalVisible(false)} style={styles.closeButton}>
                                <Icon name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        {[
                            { label: 'Terbaru', value: 'latest' },
                            { label: 'Terlama', value: 'oldest' },
                            { label: 'A-Z', value: 'az' },
                            { label: 'Z-A', value: 'za' }
                        ].map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={styles.sortOption}
                                onPress={() => {
                                    setSortOption(option.value);
                                    setIsSortModalVisible(false);
                                }}
                            >
                                <View style={styles.radioCircle}>
                                    {sortOption === option.value && <View style={styles.selectedRb} />}
                                </View>
                                <Text style={styles.sortOptionText}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </TouchableOpacity>
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
    tableHeader: {
        flexDirection: 'row',
        padding: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        justifyContent: 'space-between',
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
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    employeeText: {
        fontSize: 18,
        marginLeft: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    editButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    deleteButton: {
        padding: 5,
        marginLeft: 10,
    },
    modalContent: {
        width: 300,
        backgroundColor: 'white',
        padding: 20,
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
    content: {
        flex: 1,
        padding: 16,
    },
    searchSortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    searchInput: {
        flex: 1,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        height: 44,
    },
    searchButton: {
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
    modalCountainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    submitButton: {
        backgroundColor: '#F79300',
        padding: 12,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 16,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    bottomSheet: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '50%',
        paddingTop: 30,
        paddingBottom: 20,
        paddingHorizontal: 24,
    },
    sortHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sortTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 8,
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#F79300',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    selectedRb: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#F79300',
    },
    sortOptionText: {
        fontSize: 16,
        color: '#333',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '100%',
        height: 100,
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        alignItems: 'center',
    },
});

export default Distributor;
