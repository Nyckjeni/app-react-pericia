import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import BottomNavbar from '../components/BottomNavbar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function UsuariosScreen({ navigation }) {
  
  const [loading, setLoading] = useState(true);

  const [openTipo, setOpenTipo] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState('Todos');
  const [tipos] = useState([
    { label: 'Todos', value: 'Todos' },
    { label: 'Peritos', value: 'Perito' },
    { label: 'Administradores', value: 'Administrador' },
    { label: 'Assistentes', value: 'Assistente' },
  ]);

  const [openOrdenar, setOpenOrdenar] = useState(false);
  const [ordenarPor, setOrdenarPor] = useState('Mais recentes');
  const [ordens] = useState([
    { label: 'Mais recentes', value: 'Mais recentes' },
    { label: 'Mais antigos', value: 'Mais antigos' },
  ]);

  const [usuarios, setUsuarios] = useState([
  {
    _id: '1',
    nome: 'João Silva',
    email: 'joao.silva@email.com',
    matricula: '12345',
    acesso: '2025-06-01',
    tipo: 'Administrador',
    createdAt: '2025-06-01T10:00:00Z'
  },
  {
    _id: '2',
    nome: 'Maria Oliveira',
    email: 'maria.oliveira@email.com',
    matricula: '67890',
    acesso: '2025-05-25',
    tipo: 'Perito',
    createdAt: '2025-05-25T09:00:00Z'
  },
  {
    _id: '3',
    nome: 'Carlos Pereira',
    email: 'carlos.pereira@email.com',
    matricula: '54321',
    acesso: null,
    tipo: 'Assistente',
    createdAt: '2025-06-03T14:30:00Z'
  },
]);


  useEffect(() => {
  const fetchUsuarios = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      console.log("TOKEN:", token);

      if (!token) {
        console.error("Token não encontrado");
        setLoading(false);
        return;
      }

      const response = await axios.get('https://dentcase-backend.onrender.com/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Usuários recebidos:", response.data);
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchUsuarios();
}, []);

  const renderItem = ({ item }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => navigation.navigate('EditarUsuario', { usuario: item })}
  >
    <Text style={styles.name}>{item.nome}</Text>
    <Text><Text style={styles.bold}>Email:</Text> {item.email}</Text>
    <Text><Text style={styles.bold}>Matrícula:</Text> {item.matricula || 'N/A'}</Text>
    <Text><Text style={styles.bold}>Cadastrado em:</Text> {item.acesso || 'Nunca acessou'}</Text>
    <View style={styles.badgeContainer}>
      <Text style={[styles.badge, item.tipo === 'Administrador' ? styles.adminBadge : styles.peritoBadge]}>
        {item.tipo}
      </Text>
    </View>
  </TouchableOpacity>
);

  const usuariosFiltrados = usuarios
    .filter((usuario) => tipoFiltro === 'Todos' || usuario.tipo === tipoFiltro)
    .sort((a, b) => {
      if (ordenarPor === 'Mais recentes') return new Date(b.createdAt) - new Date(a.createdAt);
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.pageTitle}>Gerenciamento de Usuários</Text>
          <TouchableOpacity
            style={styles.novoUsuarioButton}
            onPress={() => navigation.navigate('CadastrarUsuario')}
          >
            <Text style={styles.novoUsuarioButtonText}>Cadastrar Novo Usuário</Text>
          </TouchableOpacity>



          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Buscar por matrícula ou nome..."
              placeholderTextColor="#999"
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.searchButton}>
              <Ionicons name="search" size={20} color="#6B0D0D" />
            </TouchableOpacity>
          </View>

          <View style={styles.dropdownRow}>
            <DropDownPicker
              open={openTipo}
              value={tipoFiltro}
              items={tipos}
              setOpen={setOpenTipo}
              setValue={setTipoFiltro}
              setItems={() => { }}
              containerStyle={{ width: '48%' }}
              zIndex={3000}
              zIndexInverse={1000}
            />
            <DropDownPicker
              open={openOrdenar}
              value={ordenarPor}
              items={ordens}
              setOpen={setOpenOrdenar}
              setValue={setOrdenarPor}
              setItems={() => { }}
              containerStyle={{ width: '48%' }}
              zIndex={2000}
              zIndexInverse={2000}
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#6B0D0D" />
          ) : (
            <FlatList
              data={usuariosFiltrados}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          )}
        </View>
      </View>

      <BottomNavbar
        navigation={navigation}
        activeRoute="Usuarios"
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
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    zIndex: 3000,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    elevation: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  badgeContainer: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  badge: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 12,
  },
  peritoBadge: {
    borderColor: '#198754',
    color: '#198754',
  },
  adminBadge: {
    borderColor: '#0d6efd',
    color: '#0d6efd',
  },
  novoUsuarioButton: {
    backgroundColor: '#6B0D0D',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },

  novoUsuarioButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

});
