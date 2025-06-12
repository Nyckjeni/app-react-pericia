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
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import axios from 'axios';
  import BottomNavbar from '../components/BottomNavbar';

  const statusStyle = (status) => {
    switch (status) {
      case 'em andamento':
        return { backgroundColor: '#FFF3CD', borderColor: '#FFEEBA' };
      case 'arquivado':
        return { backgroundColor: '#E2E3E5', borderColor: '#D6D8DB' };
      case 'finalizado':
        return { backgroundColor: '#D4EDDA', borderColor: '#C3E6CB' };
      default:
        return { backgroundColor: '#FFF', borderColor: '#CCC' };
    }
  };

  const statusTextStyle = (status) => {
    switch (status) {
      case 'em andamento':
        return { color: '#856404' };
      case 'arquivado':
        return { color: '#6C757D' };
      case 'finalizado':
        return { color: '#155724' };
      default:
        return { color: '#000' };
    }
  };

  export default function CasosScreen({ navigation }) {
    const [casos, setCasos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
      const getData = async () => {
        setLoading(true);
        setErro(null);

        try {
          const token = await AsyncStorage.getItem('accessToken');
          if (!token) {
            setErro('Token de acesso não encontrado');
            return;
          }

          const response = await axios.get(
            'https://dentcase-backend.onrender.com/api/cases',
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          const casosData = Array.isArray(response.data) ? response.data : [];
          const casosNormalizados = casosData.map((caso) => ({
            _id: caso._id,                     // inclui o MongoDB _id
            caseId: caso.caseId,               // mantém o caseId
            status: caso.status || 'em andamento',
            descricao: caso.description || 'Descrição não informada',
            paciente: caso.patientName || 'Não informado',
            dataIncidente: caso.incidentDate
              ? new Date(caso.incidentDate).toLocaleDateString('pt-BR')
              : 'Data não informada',
            localIncidente: caso.incidentLocation || 'Local não informado',
          }));

          setCasos(casosNormalizados);
        } catch (error) {
          console.error('Erro na busca dos casos:', error);
          if (error.response?.status === 401) {
            setErro('Sessão expirada. Faça login novamente.');
          } else {
            setErro('Não foi possível carregar os casos.');
          }
        } finally {
          setLoading(false);
        }
      };

      getData();
    }, []);

    const filteredCasos = casos.filter((caso) => {
      const matchesSearch =
        !searchText ||
        caso.caseId.toLowerCase().includes(searchText.toLowerCase()) ||
        caso.paciente.toLowerCase().includes(searchText.toLowerCase());

      const matchesStatus = !selectedStatus || caso.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });

    const renderItem = ({ item }) => (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('DetalhesCaso', {
            caso: {
              _id: item._id,
              caseId: item.caseId,
            },
          })
        }
        activeOpacity={0.7}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.id}>#{item.caseId}</Text>
            <Text style={styles.title} numberOfLines={2}>
              {item.paciente}
            </Text>
          </View>
          <Text style={styles.description} numberOfLines={3}>
            {item.descricao}
          </Text>
          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color="#555" />
              <Text style={styles.metaText}>{item.dataIncidente}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={16} color="#555" />
              <Text style={styles.metaText}>{item.localIncidente}</Text>
            </View>
          </View>
          <View style={[styles.status, statusStyle(item.status)]}>
            <Text style={[styles.statusText, statusTextStyle(item.status)]}>
              {item.status === 'em andamento'
                ? 'Em Andamento'
                : item.status === 'finalizado'
                ? 'Finalizado'
                : 'Arquivado'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );

    const renderEmptyList = () => (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-outline" size={50} color="#ccc" />
        <Text style={styles.emptyText}>
          {searchText ? 'Nenhum caso encontrado' : 'Nenhum caso cadastrado'}
        </Text>
      </View>
    );

    return (
      <>
        <View style={styles.container}>
          <Text style={styles.pageTitle}>Lista de Casos</Text>

          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Buscar caso por ID ou paciente"
              placeholderTextColor="#999"
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
            />
            <TouchableOpacity style={styles.searchButton}>
              <Ionicons name="search" size={20} color="#6B0D0D" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Filtrar por status:</Text>
            <View style={styles.statusFilterContainer}>
              {['', 'em andamento', 'finalizado', 'arquivado'].map((status) => (
                <TouchableOpacity
                  key={status || 'todos'}
                  style={[
                    styles.statusFilterButton,
                    selectedStatus === status && styles.statusFilterButtonActive,
                  ]}
                  onPress={() => setSelectedStatus(status)}
                >
                  <Text
                    style={[
                      styles.statusFilterText,
                      selectedStatus === status && styles.statusFilterTextActive,
                    ]}
                  >
                    {status === ''
                      ? 'Todos'
                      : status === 'em andamento'
                      ? 'Em Andamento'
                      : status === 'finalizado'
                      ? 'Finalizado'
                      : 'Arquivado'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6B0D0D" />
              <Text style={styles.loadingText}>Carregando casos...</Text>
            </View>
          ) : erro ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={50} color="#B00020" />
              <Text style={styles.errorText}>{erro}</Text>
            </View>
          ) : (
            <FlatList
              data={filteredCasos}
              renderItem={renderItem}
              keyExtractor={(item) => item.caseId}
              contentContainerStyle={{ paddingBottom: 140 }}
              ListEmptyComponent={renderEmptyList}
              showsVerticalScrollIndicator={false}
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
    searchContainer: {
      flexDirection: 'row',
      marginBottom: 16,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 40,
      color: '#000',
      backgroundColor: '#fff',
    },
    searchButton: {
      backgroundColor: '#eee',
      padding: 8,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 40,
    },
    filterContainer: {
      marginBottom: 16,
    },
    filterLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#333',
      marginBottom: 8,
    },
    statusFilterContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    statusFilterButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#ddd',
      backgroundColor: '#fff',
    },
    statusFilterButtonActive: {
      backgroundColor: '#6B0D0D',
      borderColor: '#6B0D0D',
    },
    statusFilterText: {
      fontSize: 12,
      color: '#666',
      fontWeight: '500',
    },
    statusFilterTextActive: {
      color: '#fff',
      fontWeight: '600',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 12,
      color: '#666',
      fontSize: 16,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    errorText: {
      color: '#B00020',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 12,
      marginBottom: 20,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 50,
    },
    emptyText: {
      color: '#666',
      fontSize: 16,
      marginTop: 12,
      textAlign: 'center',
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
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 4,
    },
    id: {
      color: '#B00020',
      fontWeight: 'bold',
      fontSize: 14,
    },
    title: {
      fontWeight: 'bold',
      color: '#000',
      flexShrink: 1,
      fontSize: 14,
    },
    description: {
      color: '#555',
      fontSize: 13,
      marginBottom: 8,
      lineHeight: 18,
    },
    meta: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 8,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      color: '#555',
      fontSize: 13,
    },
    status: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 5,
      borderWidth: 1,
    },
    statusText: {
      fontSize: 12,
      fontWeight: 'bold',
    },
  });
