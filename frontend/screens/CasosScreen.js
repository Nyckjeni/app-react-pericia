import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavbar from '../components/BottomNavbar'; // importe a BottomNavbar

const casos = [
  {
    id: 'caso-001',
    titulo: 'Identificação da vítima em um acidente rodoviário',
    descricao:
      'Vítima do sexo masculino de aproximadamente 30 anos, com fraturas dentárias caracterís...',
    data: '10/5/2024',
    responsavel: 'dr.silva',
    status: 'Em Andamento',
  },
  {
    id: 'caso-002',
    titulo: 'Identificação da vítima em um acidente rodoviário',
    descricao:
      'Vítima do sexo masculino de aproximadamente 30 anos, com fraturas dentárias caracterís...',
    data: '10/5/2024',
    responsavel: 'dr.silva',
    status: 'Arquivado',
  },
  {
    id: 'caso-003',
    titulo: 'Identificação da vítima em um acidente rodoviário',
    descricao:
      'Vítima do sexo masculino de aproximadamente 30 anos, com fraturas dentárias caracterís...',
    data: '10/5/2024',
    responsavel: 'dr.silva',
    status: 'Finalizado',
  },
];

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
  const renderItem = ({ item }) => (
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

        <FlatList
          data={casos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 140 }} // espaço para a navbar
        />
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
    backgroundColor: '#f5f5f5', // Igual ao primeiro código
    paddingTop: 40, // Igual ao primeiro código
    paddingHorizontal: 16, // Margem lateral igual ao primeiro código
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6B0D0D', // Cor do título igual ao primeiro código
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
