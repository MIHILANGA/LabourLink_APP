import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ navigation }) => {
  const [laborCategories, setLaborCategories] = useState([]);
  const [filteredLaborers, setFilteredLaborers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get(
            'https://labourlink.onrender.com/api/user/get-all-approved-labourers',
            {
              headers: { Authorization: 'Bearer ' + token },
            }
          );
          setLaborCategories(response.data.data);
          setFilteredLaborers(response.data.data); // Initialize filtered list
        } else {
          setError('No token found');
        }
      } catch (error) {
        setError('Error occurred: ' + (error.response?.data?.message || 'Unknown error'));
      }
    };

    getData();
  }, []);

  // Function to handle search filtering
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filtered = laborCategories.filter(
        (item) =>
          item.jobTitle.toLowerCase().includes(text.toLowerCase()) ||
          item.firstName.toLowerCase().includes(text.toLowerCase()) ||
          item.lastName.toLowerCase().includes(text.toLowerCase()) ||
          item.location.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredLaborers(filtered);
    } else {
      setFilteredLaborers(laborCategories);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LaborLink</Text>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search laborers..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={filteredLaborers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Details', { category: item.name })}
            >
              <Image
                source={{ uri: item.image || 'https://via.placeholder.com/100' }} // Fallback image
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.jobTitle}</Text>
                <Text style={styles.cardSubTitle}>{item.firstName} {item.lastName}</Text>
                <Text style={styles.cardDescription}>{'💰 Rs.'}{item.feePerHour}</Text>
                <Text style={styles.cardDescription}>{'📍 '}{item.location}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No laborers found.</Text>}
        />
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchBar: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    flexDirection: 'row',
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubTitle: {
    fontSize: 16,
    color: '#555',
  },
  cardDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
});

export default Home;
