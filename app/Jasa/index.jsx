import { useNavigation } from 'expo-router';
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
import Icon from 'react-native-vector-icons/Ionicons';

const Jasa = () => {
    const navigation = useNavigation();
    const API_URL = 'http://10.0.2.2:8000/api/jasa';

    const [data, setData] = useState([]);
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [formData, setFormData] = useState({ id: '', name: '', price: '', category: 'Jasa' });

    const fetchData = async () => {
        try {
            const response = await fetch(API_URL);
            const result = await response.json();
            setData(result.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch data from API');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveData = async () => {
        if (formData.name && formData.price) {
            try {
                const method = isEditModalVisible ? 'PUT' : 'POST';
                const url = isEditModalVisible ? `${API_URL}/${formData.id}` : API_URL;

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        price: formData.price,
                        category: formData.category,
                    }),
                });

                if (response.ok) {
                    Alert.alert('Success', isEditModalVisible ? 'Data updated successfully' : 'Data added successfully');
                    fetchData();
                    setFormData({ id: '', name: '', price: '', category: 'Jasa' });
                    setAddModalVisible(false);
                    setEditModalVisible(false);
                } else {
                    const errorData = await response.json();
                    Alert.alert('Error', errorData.message || 'Failed to save data');
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to save data');
            }
        } else {
            Alert.alert('Error', 'Please fill in all fields');
        }
    };

    const handleEditData = (item) => {
        setFormData(item);
        setEditModalVisible(true);
    };

    const handleDeleteData = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                Alert.alert('Success', 'Data deleted successfully');
                fetchData();
            } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.message || 'Failed to delete data');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to delete data');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Data Jasa</Text>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
                <Text style={styles.addButtonText}>Tambah Data</Text>
            </TouchableOpacity>

            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>{item.name}</Text>
                        <Text style={styles.tableCell}>{item.price}</Text>
                        <Text style={styles.tableCell}>{item.category}</Text>
                        <TouchableOpacity onPress={() => handleEditData(item)}>
                            <Icon name="create" size={20} color="#0891b2" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteData(item.id)}>
                            <Icon name="trash" size={20} color="#e63946" />
                        </TouchableOpacity>
                    </View>
                )}
                ListHeaderComponent={() => (
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableCell}>Nama</Text>
                        <Text style={styles.tableCell}>Price</Text>
                        <Text style={styles.tableCell}>Kategori</Text>
                        <Text style={styles.tableCell}>Action</Text>
                    </View>
                )}
            />


        <Modal
            visible={isAddModalVisible || isEditModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => {
                setAddModalVisible(false);
                setEditModalVisible(false);
                setFormData({ id: '', name: '', price: '', category: 'Jasa' });
            }}
        >
            <TouchableWithoutFeedback
                onPress={() => {
                    setAddModalVisible(false);
                    setEditModalVisible(false);
                    Keyboard.dismiss();
                }}
            >
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>
                                {isEditModalVisible ? 'Edit Data' : 'Tambah Data'}
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nama Jasa"
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Harga"
                                keyboardType="numeric"
                                value={formData.price}
                                onChangeText={(text) => setFormData({ ...formData, price: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Kategori"
                                value={formData.category}
                                onChangeText={(text) => setFormData({ ...formData, category: text })}
                            />
                            <TouchableOpacity style={styles.addButton} onPress={handleSaveData}>
                                <Text style={styles.addButtonText}>
                                    {isEditModalVisible ? 'Simpan Perubahan' : 'Tambah Data'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
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
    addButton: {
        backgroundColor: '#0891b2',
        padding: 12,
        borderRadius: 5,
        margin: 16,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#FFF',
        fontWeight: '600',
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
        fontWeight: '600',
        marginBottom: 12,
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
});

export default Jasa;