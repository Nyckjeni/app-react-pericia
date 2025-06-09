import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavbar from '../components/BottomNavbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const statusStyle = (status) => {
  switch (status) {
    case 'Em Andamento':
      return { backgroundColor: '#FFF3CD', borderColor: '#FFEEBA' };
    case 'Arquivado':
      return { backgroundColor: '#E2E3E5', borderColor: '#D6D8DB' };
    case 'Finalizado':
      return { backgroundColor: '#D4EDDA', borderColor: '#C3E6CB' };
    default:
      return { backgroundColor: '#FFF', borderColor: '#CCC' };
  }
};

const statusTextStyle = (status) => {
  switch (status) {
    case 'Em Andamento':
      return { color: '#856404' };
    case 'Arquivado':
      return { color: '#6C757D' };
    case 'Finalizado':
      return { color: '#155724' };
    default:
      return { color: '#000' };
  }
};

export default function CasosScreen({ navigation }) {
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const modoTeste = true;
useEffect(() => {
  const getData = async ( )=> { 
    const token= await AsyncStorage.getItem("accessToken")
    try {
      const response = await axios.get('https://dentcase-backend.onrender.com/api/cases', {  
        headers : {authorization:`Bearer ${token}`}}
      )
       setCasos(response.data);

    } catch(error){ 
      console.error('Erro na busca dos casos', error)}
  } 
  getData()
},[])
  



  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('DetalhesCaso', { caso: item })}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.id}>#{item.id}</Text>
          <Text style={styles.title}>{item.titulo}</Text>
        </View>
        <Text style={styles.description}>{item.descricao}</Text>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color="#555" />
            <Text style={styles.metaText}>{item.data}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="person-outline" size={16} color="#555" />
            <Text style={styles.metaText}>{item.responsavel}</Text>
          </View>
        </View>
        <View style={[styles.status, statusStyle(item.status)]}>
          <Text style={[styles.statusText, statusTextStyle(item.status)]}>
            {item.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Lista de Casos</Text>

        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Buscar caso por ID ou título"
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={20} color="#6B0D0D" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#6B0D0D" />
        ) : erro ? (
          <Text style={{ color: 'red' }}>{erro}</Text>
        ) : (
          <FlatList
            data={casos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 140 }}
          />
        )}
      </View>

      <BottomNavbar
        navigation={navigation}
        activeRoute="Casos"
        onAddPress={() => navigation.navigate('CadastrarCaso')}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6B0D0D',
    marginTop: 16,
    marginBottom: 12,
  },
  searchContainer: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  searchInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    color: '#000',
  },
  searchButton: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  header: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 4 },
  id: { color: '#B00020', fontWeight: 'bold' },
  title: { fontWeight: 'bold', color: '#000', flexShrink: 1 },
  description: { color: '#555', fontSize: 13, marginBottom: 8 },
  meta: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: '#555', fontSize: 13 },
  status: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
  },
  statusText: { fontSize: 12, fontWeight: 'bold' },
});