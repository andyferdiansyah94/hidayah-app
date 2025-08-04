import axios from 'axios';
import { useNavigation } from 'expo-router';
import { TentIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Modal,
    StyleSheet,
    FlatList,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { IconButton, Menu } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';

const API_URL = 'http://10.0.2.2:8000/api/jasa';
const CATEGORY_API_URL = 'http://10.0.2.2:8000/api/kategori';


const Jasa = () => {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [formData, setFormData] = useState({ id: '', name: '', price: '', category: 'Jasa' });
    const [itemName, setItemName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [editItem, setEditItem] = useState(null);
    const [isSuccessVisible, setIsSuccessVisible] = useState(false);
    const [sortOption, setSortOption] = useState('latest');
    const [isSortModalVisible, setIsSortModalVisible] = useState(false);
    const [visibleMenu, setVisibleMenu] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);


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

    const fetchCategories = async () => {
        try {
            const response = await axios.get(CATEGORY_API_URL);
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchCategories();
    }, [searchTerm, sortOption]);

    const handleAddData = async () => {
        try {
            const newItem = { name: itemName, price: price };
            const response = await axios.post(API_URL, newItem);
            setData([response.data.data, ...data]);
            setIsModalVisible(false);
            setIsSuccessVisible(true);
            resetForm();
        } catch (error) {
            Alert.alert('Error', 'Gagal untuk menambahkan data');
            console.error('Error menambahkan data: ', error);
        }
    };

    const handleEditData = async () => {
        try {
            const updatedItem = { name: itemName, price: price, category: category };
            await axios.put(`${API_URL}/${editItem.id}`, updatedItem);
            setData(data.map(item => (item.id === editItem.id ? { ...item, ...updatedItem } : item)));
            setIsEditModalVisible(false);
            setIsSuccessVisible(true);
            resetForm();
        } catch (error) {
            Alert.alert('Error', 'Gagal untuk mengedit data');
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
        setPrice('');
        setCategory('');
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

    const formatRupiah = (angka) => {
        if (!angka) return 'Rp 0';
        return 'Rp ' + parseFloat(angka).toLocaleString('id-ID', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Data Jasa</Text>
            </View>
            
            <View style={styles.content}>
                <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
                    <Text style={styles.addButtonText}>Tambah Data</Text>
                </TouchableOpacity>

                <View style={styles.searchSortContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cari Nama Jasa..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                    <TouchableOpacity onPress={() => setIsSortModalVisible(true)} style={styles.filterButton}>
                        <Icon name="funnel" size={20} color="#F79300" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemPrice}>{formatRupiah(item.price)}</Text>
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
                                        setEditItem(item);
                                        setItemName(item.name);
                                        setPrice(item.price);
                                        setCategory(item.category);
                                        setIsEditModalVisible(true);
                                        setVisibleMenu(null);
                                    }}
                                    title="Edit Jasa"
                                    leadingIcon={() => <Icon name='create' size={20} color={"#F79300"} />}
                                />
                                <Menu.Item
                                    onPress={() => {
                                        handleDeleteData(item.id);
                                        setVisibleMenu(null);
                                    }}
                                    title="Hapus Jasa"
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

                <Modal visible={isModalVisible} animationType='slide' transparent={true}>
                    <TouchableOpacity style={styles.modalContainer} onPress={() => setIsModalVisible(false)}>
                        <View style={styles.modalContent} onStartShouldSetResponder={(e) => e.stopPropagation()}>
                            <Text style={styles.modalTitle}>Tambah Data</Text>
                            <TextInput
                                placeholder='Nama Jasa'
                                style={styles.input}
                                value={itemName}
                                onChangeText={setItemName}
                            />
                            <TextInput
                                placeholder='Harga'
                                style={styles.input}
                                value={price}
                                onChangeText={setPrice}
                                keyboardType='numeric'
                            />
                            <TouchableOpacity style={styles.submitButton} onPress={handleAddData}>
                                <Text style={styles.submitButtonText}>Tambah Data</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                <Modal visible={isEditModalVisible} animationType='slide' transparent={true}>
                    <TouchableOpacity style={styles.modalContainer} onPress={() => {setIsEditModalVisible(false); resetForm();}}>
                        <View style={styles.modalContent} onStartShouldSetResponder={(e) => e.stopPropagation()}>
                            <Text style={styles.modalTitle}>Edit Data</Text>
                            <TextInput
                                placeholder='Nama Jasa'
                                style={styles.input}
                                value={itemName}
                                onChangeText={setItemName}
                            />
                            <TextInput
                                placeholder='Harga'
                                style={styles.input}
                                value={price}
                                onChangeText={setPrice}
                                keyboardType='numeric'
                            />
                            <TouchableOpacity style={styles.submitButton} onPress={handleEditData}>
                                <Text style={styles.submitButtonText}>Simpan Perubahan</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                <Modal visible={isSortModalVisible} animationType='slide' transparent={true} onRequestClose={() => setIsSortModalVisible(false)}>
                    <TouchableOpacity activeOpacity={1} style={styles.modalOverlay} onPress={() => setIsSortModalVisible(false)}>
                        <TouchableOpacity activeOpacity={1} style={styles.bottomSheet} onPress={() => {}}>
                            <View style={styles.sortHeader}>
                                <Text style={styles.sortTitle}>Urutkan Berdasarkan</Text>
                                <TouchableOpacity onPress={() => setIsSortModalVisible(false)} style={styles.closeButton}>
                                    <Icon name='close' size={24} color="#000" />
                                </TouchableOpacity>
                            </View>

                            {[
                                { label: 'Terbaru', value: 'latest' },
                                { label: 'Terlama', value: 'oldest' },
                                { label: 'A-Z', value: 'az' },
                                { label: 'Z-A', value: 'za' },
                            ].map(option => (
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
    addButton: {
        backgroundColor: '#F79300',
        padding: 12,
        borderRadius: 5,
        marginBottom: 16,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    tableHeader: {
        marginLeft: 20,
        marginRight: 20,
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#e9ecef',
    },
    tableRow: {
        marginLeft: 20,
        marginRight: 20,
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
    },
    tableCell: {
        flex: 1,
        fontSize: 14,
        color: '#000',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 5,
        padding: 8,
        marginBottom: 12,
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    successContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 10,
        alignItems: 'center',
    },
    successText: {
        fontSize: 16,
        fontWeight: '500',
        color: 'green',
        marginTop: 10,
    },
    content: {
        padding: 16,
        flex: 1,
    },
    searchSortContainer: {
        flexDirection: "row",
        marginBottom: 15,
        alignItems: "center",
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 44,
    },
    filterButton: {
        marginLeft: 10,
        padding: 10,
        width: 44,
        height: 44,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        width: "100%",
        height: 100,
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        alignItems: "center",
    },
    itemName: {
        fontSize: 18,
        marginLeft: 16,
        fontWeight: "bold",
        color: "#333",
    },
    itemPrice: {
        fontSize: 16,
        marginLeft: 16,
        color: "#F79300",
        marginTop: 4,
    },
    submitButton: {
        backgroundColor: "#F79300",
        padding: 12,
        borderRadius: 4,
        alignItems: "center",
        marginTop: 16,
    },
    submitButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: "flex-end",
    },
    bottomSheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '50%',
        paddingTop: 30,
        paddingBottom: 20,
        paddingHorizontal: 24,
    },
    sortHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    sortTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    sortOption: {
        flexDirection: "row",
        alignItems: 'center',
        paddingVertical: 12,
    },
    radioCircle: {
        height: 20,
        width: 20,
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
    sortOptionText:  {
        fontSize: 16,
        color: "#333",
    },
    emptyComponent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});

export default Jasa;