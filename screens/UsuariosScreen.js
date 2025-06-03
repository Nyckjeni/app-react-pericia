import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import BottomNavbar from '../components/BottomNavbar';

const usuarios = [
  { id: '1', nome: 'Admin master', email: 'admin@gmail.com', matricula: 'N/A', acesso: 'Nunca acessou', tipo: 'Administrador' },
  { id: '2', nome: 'João Carlos', email: 'joaocarlos@gmail.com', matricula: 'MAT1744938124209', acesso: 'Nunca acessou', tipo: 'Perito' },
  { id: '3', nome: 'Edmar', email: 'edmarsantos@gmail.com', matricula: 'MAT1745247639297', acesso: 'Nunca acessou', tipo: 'Perito' },
  { id: '4', nome: 'William', email: 'williamandre@gmail.com', matricula: 'MAT1745765500820', acesso: 'Nunca acessou', tipo: 'Assistente' },
];

export default function UsuariosScreen({ navigation }) {
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.nome}</Text>
      <Text><Text style={styles.bold}>Email:</Text> {item.email}</Text>
      <Text><Text style={styles.bold}>Matrícula:</Text> {item.matricula}</Text>
      <Text><Text style={styles.bold}>Cadastrado em:</Text> {item.acesso}</Text>
      <View style={styles.badgeContainer}>
        <Text style={[styles.badge, item.tipo === 'Administrador' ? styles.adminBadge : styles.peritoBadge]}>
          {item.tipo}
        </Text>
      </View>
    </View>
  );

  const usuariosFiltrados = usuarios
    .filter((usuario) => tipoFiltro === 'Todos' || usuario.tipo === tipoFiltro)
    .sort((a, b) => {
      if (ordenarPor === 'Mais recentes') return b.id - a.id;
      return a.id - b.id;
    });

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Título igual do outro código */}
        <Text style={styles.pageTitle}>Gerenciamento de Usuários</Text>

        {/* Campo de busca + botão iguais ao do outro código */}
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

        {/* Filtros em dropdown */}
        <View style={styles.dropdownRow}>
          <DropDownPicker
            open={openTipo}
            value={tipoFiltro}
            items={tipos}
            setOpen={setOpenTipo}
            setValue={setTipoFiltro}
            setItems={() => {}}
            placeholder="Filtrar por tipo"
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
            setItems={() => {}}
            placeholder="Ordenar por"
            containerStyle={{ width: '48%' }}
            zIndex={2000}
            zIndexInverse={2000}
          />
        </View>

        <FlatList
          data={usuariosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>

      <BottomNavbar navigation={navigation} activeRoute="Usuarios" />
    </View>
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
});
